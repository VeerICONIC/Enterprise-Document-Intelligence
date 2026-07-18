from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from graph import graph

print("=" * 70)
print("Enterprise Document Intelligence System")
print("Powered by LangGraph + Ollama + ChromaDB")
print("Type 'exit' to quit")
print("=" * 70)

# Embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load vector database
vectorstore = Chroma(
    persist_directory="vectorstore",
    embedding_function=embeddings
)

retriever = vectorstore.as_retriever(
    search_kwargs={"k": 4}
)

while True:

    question = input("\nQuestion: ")

    if question.lower() == "exit":
        break

    # Step 1: Retrieve relevant documents
    docs = retriever.invoke(question)

    context = ""

    for doc in docs:
        source = doc.metadata.get(
            "document_name",
            "Unknown Document"
        )

        context += f"""
Document: {source}

Content:
{doc.page_content}

"""

    # Step 2: Pass state into LangGraph
    state = {
        "question": question,
        "rewritten_question": "",
        "context": context,
        "route": "",
        "response": "",
        "validation": ""
    }

    result = graph.invoke(state)

    # Step 3: Display rewritten query
    print("\n" + "=" * 70)
    print(
        f"REWRITTEN QUERY : {result['rewritten_question']}"
    )
    print(
        f"AGENT USED      : {result['route'].upper()} AGENT"
    )
    print("=" * 70)

    # Step 4: Validation check
    if result["validation"] == "SUPPORTED":
        print("\nResponse:\n")
        print(result["response"])

    else:
        print(
            "\nThe answer could not be reliably supported "
            "by the retrieved documents."
        )

    # Step 5: Sources
    print("\nSources:")

    for idx, doc in enumerate(
        docs,
        start=1
    ):

        source = doc.metadata.get(
            "document_name",
            "Unknown"
        )

        page = doc.metadata.get(
            "page",
            0
        ) + 1

        print(
            f"{idx}. {source} | Page {page}"
        )

    print("\n" + "-" * 70)