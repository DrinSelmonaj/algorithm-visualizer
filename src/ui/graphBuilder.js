// src/ui/graphBuilder.js
// Ndërton UI-n për krijimin/editimin e grafeve.

import { render as renderGraph } from '../engine/graphRenderer.js';
import { DEFAULT_GRAPH }         from '../algorithms/graph/dijkstra.js';

let currentGraph = null;

function initGraph() {
    currentGraph = {
        nodes: DEFAULT_GRAPH.nodes.map(n => ({ ...n })),
        edges: DEFAULT_GRAPH.edges.map(e => ({ ...e })),
    };
    renderGraph(currentGraph);
    return currentGraph;
}

function getGraph() {
    return currentGraph;
}

// Shton një nyje të re dhe rivizaton grafin
function addNode(id) {
    if (!currentGraph || !id) return;
    if (currentGraph.nodes.some(n => n.id === id)) return;
    currentGraph.nodes.push({ id });
    renderGraph(currentGraph);
}

// Shton një lidhje të re mes dy nyjeve ekzistuese
function addEdge(source, target, weight) {
    if (!currentGraph) return;
    const w = Number(weight);
    if (!Number.isFinite(w) || w <= 0) return;
    const validNode = id => currentGraph.nodes.some(n => n.id === id);
    if (!validNode(source) || !validNode(target)) return;
    currentGraph.edges.push({ source, target, weight: w });
    renderGraph(currentGraph);
}

export { initGraph, getGraph, addNode, addEdge };