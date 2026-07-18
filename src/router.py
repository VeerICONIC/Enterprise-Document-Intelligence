from langchain_ollama import ChatOllama

# Local LLM
llm = ChatOllama(
    model="qwen2.5:7b",
    temperature=0
)


def route_query(query: str):

    prompt = f"""
You are an intelligent routing agent.

Classify the user query into EXACTLY one of the following categories:

1. qa
   - General question answering from documents.
   - Example:
     "What skills does candidate A have?"
     "What projects are mentioned?"

2. summary
   - Requests asking for summaries, overviews or key points.
   - Example:
     "Summarize the resumes."
     "Give an overview of the report."

3. extract
   - Requests asking to extract specific entities or lists.
   - Example:
     "Extract all programming languages."
     "List all deadlines."
     "Extract email addresses."

4. compare
   - Requests asking to compare multiple documents, candidates or reports.
   - Example:
     "Compare these resumes."
     "Which candidate is better for Data Scientist role?"

Return ONLY one word:

qa
summary
extract
compare

User Query:
{query}
"""

    response = llm.invoke(prompt)

    route = response.content.strip().lower()

    valid_routes = [
        "qa",
        "summary",
        "extract",
        "compare"
    ]

    if route not in valid_routes:
        route = "qa"

    return route