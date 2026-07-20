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

function addEdge(source, target, weight) {
    if (!currentGraph) return;
    const w = Number(weight);
    if (!Number.isFinite(w) || w <= 0) return;
    const validNode = id => currentGraph.nodes.some(n => n.id === id);
    if (!validNode(source) || !validNode(target)) return;

    // Grafi është I PANDREJTUAR (shih graphRenderer.js) — A-B dhe B-A janë
    // e njëjta lidhje. D3 forceLink() muton e.source/e.target në objekte
    // nyjesh pas render-it të parë, ndaj normalizojmë në ID string këtu —
    // krahasim direkt me string do të dështonte në heshtje.
    const idOf = v => (typeof v === 'object' && v !== null) ? v.id : v;
    const exists = currentGraph.edges.some(e =>
        (idOf(e.source) === source && idOf(e.target) === target) ||
        (idOf(e.source) === target && idOf(e.target) === source)
    );
    if (exists) {
        alert(`Lidhja "${source}-${target}" ekziston tashmë.`);
        return;
    }

    currentGraph.edges.push({ source, target, weight: w });
    renderGraph(currentGraph);
}
export { initGraph, getGraph, addNode, addEdge };