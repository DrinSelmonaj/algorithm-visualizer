// src/ui/graphBuilder.js
// Ndërton UI-n për krijimin/editimin e grafeve.

import { t }                 from '../i18n/index.js';
import { render as renderGraph } from '../engine/graphRenderer.js';
import { DEFAULT_GRAPH }         from '../algorithms/graph/dijkstra.js';
import { isValidNodeId, idOf }   from '../graph/model.js';

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
    if (!currentGraph) return { ok: false, error: t('graph.err.notReady') };
    if (!isValidNodeId(id)) {
        return { ok: false, error: t('graph.err.badId') };
    }
    if (currentGraph.nodes.some(n => n.id === id)) return { ok: false, error: t('graph.err.nodeExists', { id }) };
    currentGraph.nodes.push({ id });
    renderGraph(currentGraph);
    return { ok: true };
}

function addEdge(source, target, weight) {
    if (!currentGraph) return { ok: false, error: t('graph.err.notReady') };
    const w = Number(weight);
    if (!Number.isFinite(w) || w <= 0) return { ok: false, error: t('graph.err.weight') };
    const validNode = id => currentGraph.nodes.some(n => n.id === id);
    if (!validNode(source) || !validNode(target)) return { ok: false, error: t('graph.err.bothNodes') };
    if (source === target) return { ok: false, error: t('graph.err.selfLoop') };

    // Grafi është I PANDREJTUAR (shih graphRenderer.js) — A-B dhe B-A janë
    // e njëjta lidhje. D3 forceLink() muton e.source/e.target në objekte
    // nyjesh pas render-it të parë, ndaj normalizojmë në ID string këtu —
    // krahasim direkt me string do të dështonte në heshtje.
    const exists = currentGraph.edges.some(e =>
        (idOf(e.source) === source && idOf(e.target) === target) ||
        (idOf(e.source) === target && idOf(e.target) === source)
    );
    if (exists) {
        return { ok: false, error: t('graph.err.edgeExists', { a: source, b: target }) };
    }

    currentGraph.edges.push({ source, target, weight: w });
    renderGraph(currentGraph);
    return { ok: true };
}
export { initGraph, getGraph, addNode, addEdge };
