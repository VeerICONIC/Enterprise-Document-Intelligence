from typing import TypedDict
from langgraph.graph import StateGraph, END

from router import route_query
from agents import (
    qa_agent,
    summary_agent,
    extraction_agent,
    comparison_agent
)

class GraphState(TypedDict):
    question: str
    context: str
    response: str
    route: str


def router_node(state):

    route = route_query(
        state["question"]
    )

    state["route"] = route

    return state


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


graph = StateGraph(GraphState)

graph.add_node(
    "router",
    router_node
)

graph.add_node(
    "qa",
    qa_node
)

graph.add_node(
    "summary",
    summary_node
)

graph.add_node(
    "extract",
    extract_node
)

graph.add_node(
    "compare",
    compare_node
)

graph.set_entry_point(
    "router"
)


def routing_function(state):

    return state["route"]


graph.add_conditional_edges(
    "router",
    routing_function,
    {
        "qa": "qa",
        "summary": "summary",
        "extract": "extract",
        "compare": "compare"
    }
)

graph.add_edge(
    "qa",
    END
)

graph.add_edge(
    "summary",
    END
)

graph.add_edge(
    "extract",
    END
)

graph.add_edge(
    "compare",
    END
)

workflow = graph.compile()