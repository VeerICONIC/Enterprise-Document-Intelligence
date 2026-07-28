from typing import TypedDict
from langgraph.graph import StateGraph, END

from src.router import route_query

from src.agents import  (
    qa_agent,
    summary_agent,
    extraction_agent,
    comparison_agent,
    validation_agent,
    rewrite_query_agent
)


class GraphState(TypedDict):
    question: str
    rewritten_question: str
    context: str
    route: str
    response: str
    validation: str


# ---------------- REWRITE NODE ----------------

def rewrite_node(state):

    rewritten = rewrite_query_agent(
        state["question"]
    )

    state["rewritten_question"] = rewritten

    print(
        f"\nRewritten Query: {rewritten}\n"
    )

    return state


# ---------------- ROUTER NODE ----------------

def router_node(state):

    route = route_query(
        state["rewritten_question"]
    )

    state["route"] = route

    print(
        f"\nRouter selected: {route.upper()} AGENT\n"
    )

    return state


# ---------------- AGENT NODES ----------------

def qa_node(state):

    state["response"] = qa_agent(
        state["context"],
        state["question"]
    )

    return state


def summary_node(state):

    state["response"] = summary_agent(
        state["context"]
    )

    return state


def extract_node(state):

    state["response"] = extraction_agent(
        state["context"],
        state["question"]
    )

    return state


def compare_node(state):

    state["response"] = comparison_agent(
        state["context"],
        state["question"]
    )

    return state


# ---------------- VALIDATION NODE ----------------

def validation_node(state):

    verdict = validation_agent(
        state["context"],
        state["response"]
    )

    state["validation"] = verdict

    return state


# ---------------- BUILD GRAPH ----------------

workflow = StateGraph(GraphState)

# Add all nodes
workflow.add_node("rewrite", rewrite_node)
workflow.add_node("router", router_node)
workflow.add_node("qa", qa_node)
workflow.add_node("summary", summary_node)
workflow.add_node("extract", extract_node)
workflow.add_node("compare", compare_node)
workflow.add_node("validate", validation_node)

# Entry point
workflow.set_entry_point("rewrite")

# Rewrite -> Router
workflow.add_edge(
    "rewrite",
    "router"
)


# Router logic
def route_selector(state):
    return state["route"]


workflow.add_conditional_edges(
    "router",
    route_selector,
    {
        "qa": "qa",
        "summary": "summary",
        "extract": "extract",
        "compare": "compare"
    }
)

# Validation stage
workflow.add_edge("qa", "validate")
workflow.add_edge("summary", "validate")
workflow.add_edge("extract", "validate")
workflow.add_edge("compare", "validate")

workflow.add_edge(
    "validate",
    END
)

graph = workflow.compile()