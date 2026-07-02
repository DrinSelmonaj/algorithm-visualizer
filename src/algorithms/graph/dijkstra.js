// src/algorithms/graph/dijkstra.js

const JAVA_SOURCE =
`public class Dijkstra {
    public static int[] dijkstra(int[][] graph, int src) {
        int n    = graph.length;
        int[] dist    = new int[n];
        boolean[] vis = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        for (int i = 0; i < n - 1; i++) {
            int u = minDist(dist, vis);
            vis[u] = true;
            for (int v = 0; v < n; v++) {
                if (!vis[v] && graph[u][v] != 0
                    && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                }
            }
        }
        return dist;
    }
}`;

const DEFAULT_GRAPH = {
    nodes: [
        { id: 'A' }, { id: 'B' }, { id: 'C' },
        { id: 'D' }, { id: 'E' }, { id: 'F' },
    ],
    edges: [
        { source: 'A', target: 'B', weight: 4 },
        { source: 'A', target: 'C', weight: 2 },
        { source: 'B', target: 'C', weight: 5 },
        { source: 'B', target: 'D', weight: 10 },
        { source: 'C', target: 'E', weight: 3 },
        { source: 'D', target: 'F', weight: 11 },
        { source: 'E', target: 'D', weight: 4 },
        { source: 'E', target: 'F', weight: 8 },
    ],
};

function* dijkstra(graph = DEFAULT_GRAPH, sourceId = 'A') {
    const nodes = graph.nodes.map(n => n.id);
    const dist  = {};
    const visited = new Set();

    // Inicializo të gjitha distancat si infinit
    nodes.forEach(id => dist[id] = Infinity);
    dist[sourceId] = 0;

    const snap = () => {
        const d = {};
        nodes.forEach(id => { d[id] = dist[id] === Infinity ? '∞' : dist[id]; });
        return d;
    };

    yield { type: 'current', nodeId: `graph-node-${sourceId}`, distances: snap(), javaLine: 8, message: `Nisim nga ${sourceId}. Të gjitha distancat = ∞.` };

    while (visited.size < nodes.length) {
        // Gjej nyjen e pa-vizituar me distancën më të vogël
        let u = null;
        nodes.forEach(id => {
            if (!visited.has(id) && (u === null || dist[id] < dist[u])) u = id;
        });

        if (dist[u] === Infinity) break;
        visited.add(u);

        yield { type: 'visit', nodeId: `graph-node-${u}`, distances: snap(), javaLine: 11, message: `Procesojmë ${u} (dist = ${dist[u]}).` };

        // Relakso skajet dalëse
        graph.edges
            .filter(e => {
                const src = typeof e.source === 'object' ? e.source.id : e.source;
                return src === u;
            })
            .forEach(function*(e) {
                const v   = typeof e.target === 'object' ? e.target.id : e.target;
                const eid = `graph-edge-${u}-${v}`;

                if (visited.has(v)) return;

                yield { type: 'edge-consider', edgeId: eid, javaLine: 13, message: `Shqyrtojmë skajin ${u}→${v} (peshë ${e.weight}).` };

                const candidate = dist[u] + e.weight;
                if (candidate < dist[v]) {
                    dist[v] = candidate;
                    yield { type: 'edge-accept', edgeId: eid, distances: snap(), javaLine: 15, message: `Përditësojmë dist[${v}] = ${candidate}.` };
                } else {
                    yield { type: 'edge-reject', edgeId: eid, javaLine: 15, message: `${candidate} ≥ dist[${v}] = ${dist[v]}. Pa ndryshim.` };
                }
            });
    }

    yield { type: 'visit', distances: snap(), javaLine: 18, message: `Dijkstra përfundoi.` };
}

export { dijkstra, DEFAULT_GRAPH, JAVA_SOURCE };