import hashlib
import json
import os
import shutil
import time
import uuid
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.graph import graph

app = FastAPI(
    title="Enterprise Document Intelligence API",
    description="Agentic RAG using LangGraph + Ollama + ChromaDB",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

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
    search_kwargs={"k": 4}
)

REGISTRY_FILE = "document_registry.json"

UPLOAD_DIR = "uploaded_docs"

os.makedirs(UPLOAD_DIR, exist_ok=True)


def refresh_retriever():
    global uploaded_retriever

    uploaded_retriever = vectorstore.as_retriever(
        search_kwargs={"k": 4}
    )

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
    return {
        "message": "Enterprise Document Intelligence API Running"
    }


@app.get("/health")
def health():
    return {
        "fastapi": True,
        "ollama": True,
        "chromadb": True,
        "langgraph": True,
    }


@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):

    global uploaded_retriever
    

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    upload_dir = UPLOAD_DIR

    file_path = os.path.join(
        upload_dir,
        file.filename
    )

    if os.path.exists(file_path):
        raise HTTPException(
            status_code=409,
            detail="A file with this name already exists."
        )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    registry = load_registry()

    file_hash = calculate_file_hash(file_path)

    if file_hash in registry:

        existing = registry[file_hash]

        os.remove(file_path)

        return {
            "message": "Duplicate document detected.",
            "existing_document": existing["filename"],
            "uploaded_at": existing["uploaded_at"],
            "pages": existing["pages"],
            "chunks": existing["chunks"]
        }

    loader = PyPDFLoader(file_path)

    documents = loader.load()

    for doc in documents:
        doc.metadata["document_name"] = file.filename

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(documents)
    
    chunk_ids = []

    for chunk in chunks:

        chunk_id = str(uuid.uuid4())

        chunk_ids.append(chunk_id)

    registry[file_hash] = {
    "filename": file.filename,
    "uploaded_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "pages": len(documents),
    "chunks": len(chunks),
    "chunk_ids": chunk_ids
    }

    save_registry(registry)

    vectorstore.add_documents(
    documents=chunks,
    ids=chunk_ids
    )

    refresh_retriever()

    return {
        "message": "Upload Successful",
        "document": file.filename,
        "pages": len(documents),
        "chunks_added": len(chunks)
    }
@app.post("/query")
def query_documents(request: QueryRequest):

    global uploaded_retriever

    # -------------------------------
    # Start Timer
    # -------------------------------
    start_time = time.time()

    docs = uploaded_retriever.invoke(
        request.question
    )
    
    print("\n========== RETRIEVED ==========")

    for doc in docs:
        print(doc.metadata)

    print("===============================\n")

    if len(docs) == 0:
        raise HTTPException(
            status_code=404,
            detail="No relevant documents found."
        )

    context = ""

    sources = []

    documents_used = set()

    for doc in docs:

        document_name = doc.metadata.get(
            "document_name",
            "Unknown Document"
        )

        page_number = doc.metadata.get(
            "page",
            0
        ) + 1

        context += f"""
Document:
{document_name}

Content:
{doc.page_content}

"""

        sources.append(
            {
                "document": document_name,
                "page": page_number
            }
        )

        documents_used.add(document_name)

    state = {
        "question": request.question,
        "rewritten_question": "",
        "context": context,
        "route": "",
        "response": "",
        "validation": ""
    }

    result = graph.invoke(state)

    # -------------------------------
    # Stop Timer
    # -------------------------------
    end_time = time.time()

    response_time = round(
        end_time - start_time,
        2
    )

    return {

        "metadata": {

            "agent": result["route"],

            "validation": result["validation"],

            "rewritten_query":
                result["rewritten_question"]

        },

        "analytics": {

            "response_time": response_time,

            "retrieved_chunks": len(docs),

            "documents_used": list(documents_used),

            "documents_count": len(documents_used),

            "sources_count": len(sources)

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


@app.get("/dashboard")
def dashboard_stats():

    registry = load_registry()

    documents = list(registry.values())

    total_documents = len(documents)

    total_pages = sum(
        doc["pages"] for doc in documents
    )

    total_chunks = sum(
        doc["chunks"] for doc in documents
    )

    avg_pages = (
        round(total_pages / total_documents, 2)
        if total_documents else 0
    )

    avg_chunks = (
        round(total_chunks / total_documents, 2)
        if total_documents else 0
    )

    largest_document = (
        max(
            documents,
            key=lambda x: x["pages"]
        )["filename"]
        if documents else "-"
    )

    latest_document = (
        max(
            documents,
            key=lambda x: x["uploaded_at"]
        )["filename"]
        if documents else "-"
    )

    return {

        "documents": total_documents,

        "pages": total_pages,

        "chunks": total_chunks,

        "avg_pages": avg_pages,

        "avg_chunks": avg_chunks,

        "largest_document": largest_document,

        "latest_document": latest_document,

        "vectorstore": "Connected",

        "document_data": documents

    }
@app.delete("/documents/{filename}")
def delete_document(filename: str):

    registry = load_registry()

    file_hash = None

    record = None

    for key, value in registry.items():

        if value["filename"] == filename:

            file_hash = key
            record = value
            break

    if record is None:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    try:

        vectorstore.delete(
            ids=record["chunk_ids"]
        )

    except Exception as e:

        print(e)

    pdf_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    if os.path.exists(pdf_path):

        os.remove(pdf_path)

    del registry[file_hash]

    save_registry(registry)

    refresh_retriever()

    return {

        "message": "Document deleted successfully."

    }