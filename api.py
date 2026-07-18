import hashlib
import json
from datetime import datetime
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from src.graph import graph

app = FastAPI(title="Enterprise Document Intelligence API",
              description="Agentic RAG using LangGraph + Ollama + ChromaDB",
              version="1.0")

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


# =====================================================
# Persistent ChromaDB
# =====================================================

VECTOR_DIR = "vectorstore"

os.makedirs(VECTOR_DIR, exist_ok=True)

vectorstore = Chroma(
    persist_directory=VECTOR_DIR,
    embedding_function=embeddings
)

uploaded_retriever = vectorstore.as_retriever(
    search_kwargs={"k":4}
)

REGISTRY_FILE = "document_registry.json"

def load_registry():
    if not os.path.exists(REGISTRY_FILE):
        return {}
    try:
        with open(REGISTRY_FILE, "r") as f:
            content = f.read().strip()
            if not content:
                return {}
            return json.loads(content)
    except (json.JSONDecodeError, FileNotFoundError):
        return {}

def save_registry(registry):
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(
            registry,
            f,
            indent=4,
            ensure_ascii=False
        )

def calculate_file_hash(file_path):
    sha = hashlib.sha256()
    with open(file_path, "rb") as f:
        while True:
            data = f.read(8192)
            if not data:
                break
            sha.update(data)
    return sha.hexdigest()

class QueryRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message":"Enterprise Document Intelligence API Running"}

@app.get("/health")
def health():
    return {"status":"healthy"}


@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    global uploaded_retriever
    global vectorstore

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    upload_dir = "uploaded_docs"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(
        upload_dir,
        file.filename
    )

    # Prevent duplicate uploads
    if os.path.exists(file_path):
        return {
            "message": f"{file.filename} already exists."
        }

    with open(file_path, "wb") as f:
        f.write(await file.read())
        
        registry = load_registry()

        file_hash = calculate_file_hash(file_path)

        if file_hash in registry:   

            os.remove(file_path)

        existing = registry[file_hash]

        return {
        "message": "Duplicate document detected.",
        "existing_document": existing["filename"],
        "uploaded_at": existing["uploaded_at"],
        "pages": existing["pages"],
        "chunks": existing["chunks"]
        }

    registry[file_hash] = file.filename

    save_registry(registry)

    loader = PyPDFLoader(file_path)

    documents = loader.load()

    for doc in documents:
        doc.metadata["document_name"] = file.filename

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(documents)
    
    registry[file_hash] = {
    "filename": file.filename,
    "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "pages": len(documents),
    "chunks": len(chunks)
    }

    save_registry(registry)

    vectorstore.add_documents(chunks)

    uploaded_retriever = vectorstore.as_retriever(
        search_kwargs={"k":4}
    )

    return {
        "message": "Upload Successful",
        "document": file.filename,
        "pages": len(documents),
        "chunks_added": len(chunks)
    }
    
@app.post("/query")
def query_documents(request: QueryRequest):

    global uploaded_retriever

    docs = uploaded_retriever.invoke(
        request.question
    )

    if len(docs) == 0:

        raise HTTPException(
            status_code=404,
            detail="No relevant documents found."
        )

    context = ""

    sources = []

    for doc in docs:

        context += f"""
Document:
{doc.metadata.get("document_name")}

Content:
{doc.page_content}

"""

        sources.append({
            "document": doc.metadata.get(
                "document_name"
            ),
            "page": doc.metadata.get(
                "page",
                0
            ) + 1
        })

    state = {
        "question": request.question,
        "rewritten_question": "",
        "context": context,
        "route": "",
        "response": "",
        "validation": ""
    }

    result = graph.invoke(state)

    return {
        "metadata": {
            "agent": result["route"],
            "validation": result["validation"],
            "rewritten_query": result["rewritten_question"]
        },
        "answer": result["response"],
        "sources": sources
    }       
    
@app.get("/documents")
def list_documents():

    registry = load_registry()

    return {
        "total_documents": len(registry),
        "documents": list(registry.values())
    }                                                                                    