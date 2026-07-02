// src/ui/graphBuilder.js
// Ndërton UI-n për krijimin/editimin e grafeve.
// Për momentin përdor grafin default nga dijkstra.js.
// Zgjerim i mundshëm: input manual i nyjeve dhe skajeve.

import { render as renderGraph } from '../engine/graphRenderer.js';
import { DEFAULT_GRAPH }         from '../algorithms/graph/dijkstra.js';

let currentGraph = null;

/**
 * Inicializo vizualizimin e grafeve me grafin default.
 * Thirret nga main.js kur zgjidhet Dijkstra ose Kruskal.
 * @returns {Object} grafu aktual
 */
function initGraph() {
    currentGraph = {
        nodes: DEFAULT_GRAPH.nodes.map(n => ({ ...n })),
        edges: DEFAULT_GRAPH.edges.map(e => ({ ...e })),
    };
    renderGraph(currentGraph);
    return currentGraph;
}

/**
 * Kthen grafin aktual për ta përdorur gjeneratori.
 */
function getGraph() {
    return currentGraph;
}

export { initGraph, getGraph };