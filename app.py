import streamlit as st
import os

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from src.graph import graph

st.set_page_config(
    page_title="Enterprise Document Intelligence System",
    page_icon="📄",
    layout="wide"
)

st.title("📄 Enterprise Document Intelligence System")
st.subheader(
    "Agentic RAG using LangGraph + Ollama + ChromaDB"
)

# ----------------------------
# Upload PDFs
# ----------------------------

uploaded_files = st.file_uploader(
    "Upload PDF Documents",
    type=["pdf"],
    accept_multiple_files=True
)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

retriever = None

if uploaded_files:

    os.makedirs(
        "temp_uploads",
        exist_ok=True
    )

    documents = []

    for uploaded_file in uploaded_files:

        save_path = os.path.join(
            "temp_uploads",
            uploaded_file.name
        )

        with open(save_path, "wb") as f:
            f.write(
                uploaded_file.getbuffer()
            )

        loader = PyPDFLoader(
            save_path
        )

        docs = loader.load()

        for doc in docs:
            doc.metadata[
                "document_name"
            ] = uploaded_file.name

        documents.extend(docs)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    chunks = splitter.split_documents(
        documents
    )

    vectorstore = Chroma.from_documents(
        chunks,
        embeddings
    )

    retriever = vectorstore.as_retriever(
        search_kwargs={"k":4}
    )

    st.success(
        f"{len(uploaded_files)} document(s) uploaded successfully."
    )

# ----------------------------
# Question
# ----------------------------

question = st.text_input(
    "Ask a question about the uploaded documents"
)

if st.button("Generate Response"):

    if retriever is None:
        st.warning(
            "Please upload PDFs first."
        )
        st.stop()

    with st.spinner(
        "Thinking..."
    ):

        docs = retriever.invoke(
            question
        )

        context = ""

        for doc in docs:

            source = doc.metadata.get(
                "document_name",
                "Unknown Document"
            )

            context += f"""
=========================
Document: {source}
=========================

{doc.page_content}

"""

        state = {
            "question": question,
            "rewritten_question": "",
            "context": context,
            "route": "",
            "response": "",
            "validation": ""
        }

        result = graph.invoke(
            state
        )

    col1, col2 = st.columns(2)

    with col1:
        st.metric(
            "Agent Used",
            result["route"].upper()
        )

    with col2:
        st.metric(
            "Validation",
            result["validation"]
        )

    st.divider()

    st.subheader(
        "Rewritten Query"
    )

    st.info(
        result["rewritten_question"]
    )

    st.subheader(
        "Response"
    )

    if result["validation"] == "SUPPORTED":
        st.write(
            result["response"]
        )
    else:
        st.error(
            "The answer could not be reliably supported by the uploaded documents."
        )

    st.subheader(
        "Sources"
    )

    for doc in docs:

        source = doc.metadata.get(
            "document_name",
            "Unknown"
        )

        page = (
            doc.metadata.get(
                "page",
                0
            ) + 1
        )

        st.write(
            f"📄 {source} | Page {page}"
        )