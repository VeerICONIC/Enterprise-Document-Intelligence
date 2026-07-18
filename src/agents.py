from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="qwen2.5:7b",
    temperature=0
)


def qa_agent(context, question):

    prompt = f"""
You are a document question answering assistant.

Answer ONLY from the provided context.

If the answer is not present in the context say:
'I could not find this information in the document.'

Context:
{context}

Question:
{question}
"""

    return llm.invoke(prompt).content


def summary_agent(context):

    prompt = f"""
You are a document summarization assistant.

Generate a concise summary in bullet points.

Context:
{context}
"""

    return llm.invoke(prompt).content


def extraction_agent(context, question):

    prompt = f"""
You are an information extraction assistant.

Extract only the requested information.

Context:
{context}

Request:
{question}
"""

    return llm.invoke(prompt).content


def comparison_agent(context, question):

    prompt = f"""
Compare the provided information and answer the query.

Context:
{context}

Question:
{question}
"""

    return llm.invoke(prompt).content

def validation_agent(context, answer):

    prompt = f"""
You are a response validation agent.

Determine whether the answer is completely supported
by the provided context.

Return ONLY one of the following:

SUPPORTED
UNSUPPORTED

Context:
{context}

Answer:
{answer}
"""

    result = llm.invoke(prompt)

    verdict = result.content.strip().upper()

    if "SUPPORTED" in verdict:
        return "SUPPORTED"

    return "UNSUPPORTED"

def rewrite_query_agent(question):

    prompt = f"""
You are a query rewriting agent for an enterprise document intelligence system.

The uploaded documents are PDFs such as:
- resumes
- reports
- research papers
- invoices
- business documents

Your task is to rewrite the query to improve semantic retrieval.

Rules:
1. Preserve the original meaning.
2. Do NOT invent new context.
3. Do NOT introduce politics, elections, news or unrelated domains.
4. Assume the query refers to the uploaded documents.
5. Make the query more specific and retrieval friendly.

Examples:

Original:
What are his projects?

Rewritten:
What projects are mentioned in the uploaded resumes?

Original:
What is the name of the 2nd candidate?

Rewritten:
What is the name of the second candidate mentioned in the uploaded resumes?

Original:
Compare both candidates.

Rewritten:
Compare the candidates mentioned in the uploaded resumes.

Return ONLY the rewritten query.

Query:
{question}
"""

    result = llm.invoke(prompt)

    return result.content.strip()