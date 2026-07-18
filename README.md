<p align="center">
  <img src="assets/banner.png" alt="Enterprise Document Intelligence System Banner" width="100%">
</p>

<h1 align="center">Enterprise Document Intelligence System</h1>

<p align="center">
An enterprise-style Multi-Agent Retrieval-Augmented Generation (RAG) platform for intelligent PDF analysis using FastAPI, LangGraph, Ollama, and ChromaDB.
</p>

<p align="center">

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-RAG-green)
![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-purple)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-black)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-orange)
![Docker](https://img.shields.io/badge/Docker-Container-blue?logo=docker)

</p>

---

## 🏗️ System Architecture

<p align="center">
  <img src="architecture/architecture.png" alt="Architecture Diagram" width="100%">
</p>

---

## Features

- 📄 Upload PDF documents
- 🔍 Semantic Search using ChromaDB
- 🤖 Multi-Agent Workflow using LangGraph
- ✍️ Query Rewriting
- 🧭 Intelligent Agent Routing
- ❓ Question Answering
- 📝 Document Summarization
- 📊 Information Extraction
- ⚖️ Document Comparison
- ✅ Response Validation
- 🚀 FastAPI REST API
- 🐳 Docker Support
- 💻 Local LLM using Ollama

---

## Tech Stack

| Category | Technology |
|-----------|------------|
| Backend | FastAPI |
| AI Framework | LangChain |
| Workflow | LangGraph |
| LLM | Ollama (Qwen2.5:7B) |
| Vector Database | ChromaDB |
| Embeddings | HuggingFace all-MiniLM-L6-v2 |
| Language | Python |
| Containerization | Docker |

---

## Project Structure

```text
Enterprise-Document-Intelligence/
│
├── api.py
├── requirements.txt
├── Dockerfile
├── README.md
├── document_registry.json
│
├── src/
│   ├── agents.py
│   ├── graph.py
│   └── router.py
│
├── uploaded_docs/
├── vectorstore/
├── architecture/
├── screenshots/
└── docs/
```

---

## Workflow

```text
Upload PDF
      │
      ▼
Chunk Documents
      │
      ▼
Generate Embeddings
      │
      ▼
Store in ChromaDB
      │
      ▼
Retriever
      │
      ▼
Rewrite Agent
      │
      ▼
Router Agent
      │
      ▼
QA / Summary / Extraction / Comparison
      │
      ▼
Validation Agent
      │
      ▼
JSON Response
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /upload | Upload and index PDF |
| POST | /query | Ask questions |
| GET | /documents | List uploaded documents |

---

## Installation

Clone repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run Ollama

```bash
ollama run qwen2.5:7b
```

Run API

```bash
python -m uvicorn api:app --reload
```

Open Swagger

```
http://127.0.0.1:8000/docs
```

---

## Screenshots

### Swagger UI

<p align="center">
  <img src="screenshots/swagger-home.png" width="100%">
</p>

### Upload Endpoint

<p align="center">
  <img src="screenshots/upload-api.png" width="100%">
</p>

### Query Endpoint

<p align="center">
  <img src="screenshots/query-api.png" width="100%">
</p>
---

## Future Improvements

- OCR Support
- Authentication
- Hybrid Search
- Cloud Deployment
- Role-Based Access
- Multi-user Support

---

## Author

**Veer Jariwala**

Electronics and Communication Engineering

National Institute of Technology Tiruchirappalli