// src/algorithms/graph/kruskal.js

import { DEFAULT_GRAPH } from './dijkstra.js';

const JAVA_SOURCE =
`public class Kruskal {
    static int[] parent, rank;

    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    static void union(int x, int y) {
        int px = find(x), py = find(y);
        if (rank[px] < rank[py])      parent[px] = py;
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
    }

    public static void kruskal(int[][] edges, int n) {
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        Arrays.sort(edges, (a,b) -> a[2] - b[2]);
        for (int[] e : edges) {
            if (find(e[0]) != find(e[1])) {
                union(e[0], e[1]);
            }
        }
    }
}`;

function* kruskal(graph = DEFAULT_GRAPH) {
    const nodes  = graph.nodes.map(n => n.id);
    const sorted = [...graph.edges].sort((a, b) => a.weight - b.weight);

    // Union-Find me path compression
    const parent = {};
    const rank   = {};
    nodes.forEach(id => { parent[id] = id; rank[id] = 0; });

    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }

    function union(x, y) {
        const px = find(x), py = find(y);
        if (px === py) return false;
        if      (rank[px] < rank[py]) parent[px] = py;
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
        return true;
    }

    yield { type: 'visit', javaLine: 21, message: `Skajet e renditura: ${sorted.map(e => `${e.source}-${e.target}(${e.weight})`).join(', ')}.` };

    let totalWeight = 0;

    for (const edge of sorted) {
        const u   = typeof edge.source === 'object' ? edge.source.id : edge.source;
        const v   = typeof edge.target === 'object' ? edge.target.id : edge.target;
        const eid = `graph-edge-${u}-${v}`;

        yield { type: 'edge-consider', edgeId: eid, javaLine: 23, message: `Shqyrtojmë ${u}-${v} (peshë ${edge.weight}). Cikël? ${find(u) === find(v) ? 'Po — kapërcejmë.' : 'Jo — shtojmë.'}` };

        if (union(u, v)) {
            totalWeight += edge.weight;
            yield { type: 'edge-accept', edgeId: eid, javaLine: 24, message: `${u}-${v} u pranua. Peshë totale: ${totalWeight}.` };
        } else {
            yield { type: 'edge-reject', edgeId: eid, javaLine: 23, message: `${u}-${v} do formonte cikël — kapërcejmë.` };
        }
    }

    yield { type: 'visit', javaLine: 26, message: `MST i plotë. Peshë totale: ${totalWeight}.` };
}

export { kruskal, JAVA_SOURCE };