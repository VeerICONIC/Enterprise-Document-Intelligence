import os

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

documents = []

# Load all PDFs
for filename in os.listdir("data"):

    if filename.endswith(".pdf"):

        print(f"Loading {filename}")

        loader = PyPDFLoader(
            os.path.join("data", filename)
        )

        docs = loader.load()

        # store filename in metadata
        for doc in docs:
            doc.metadata["document_name"] = filename

        documents.extend(docs)

print(f"\nLoaded {len(documents)} pages")

# Chunking
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)

chunks = text_splitter.split_documents(
    documents
)

print(f"Created {len(chunks)} chunks")

# Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Create vector database
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="vectorstore"
)

print("\nVector database created successfully!")