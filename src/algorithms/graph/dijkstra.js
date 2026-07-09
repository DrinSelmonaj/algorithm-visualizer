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
    const prev  = {};              // gjurmon nyjen paraardhëse për rindërtim rruge
    const visited = new Set();

    nodes.forEach(id => { dist[id] = Infinity; prev[id] = null; });
    dist[sourceId] = 0;

    const snap = () => {
        const d = {};
        nodes.forEach(id => { d[id] = dist[id] === Infinity ? '∞' : dist[id]; });
        return d;
    };

    yield { type: 'current', nodeId: `graph-node-${sourceId}`, distances: snap(), javaLine: 8, message: `Nisim nga ${sourceId}. Të gjitha distancat = ∞.` };

    while (visited.size < nodes.length) {
        let u = null;
        nodes.forEach(id => {
            if (!visited.has(id) && (u === null || dist[id] < dist[u])) u = id;
        });

        if (u === null || dist[u] === Infinity) break;
        visited.add(u);

        yield { type: 'visit', nodeId: `graph-node-${u}`, distances: snap(), javaLine: 11, message: `Procesojmë ${u} (dist = ${dist[u]}).` };

        // RREGULLIM: grafi është I PANDREJTUAR (undirected) vizualisht — një skaj
        // { source: 'A', target: 'D' } lejon lëvizje edhe A→D edhe D→A.
        // Prandaj marrim çdo skaj ku u shfaqet si source OSE si target,
        // dhe llogarisim 'v' si skajin tjetër të asaj lidhjeje (jo gjithmonë 'target').
        const outgoing = graph.edges
            .map(e => {
                const src = typeof e.source === 'object' ? e.source.id : e.source;
                const tgt = typeof e.target === 'object' ? e.target.id : e.target;
                if (src === u) return { edge: e, v: tgt, src, tgt };
                if (tgt === u) return { edge: e, v: src, src, tgt };
                return null;
            })
            .filter(x => x !== null);

        for (const { edge: e, v, src, tgt } of outgoing) {
            // ID e skajit përputhet gjithmonë me atë që gjeneroi graphRenderer.js:
            // graph-edge-${source origjinal}-${target origjinal} — pavarësisht
            // drejtimit në të cilin po e "ecim" tani (u→v ose v→u).
            const eid = `graph-edge-${src}-${tgt}`;

            if (visited.has(v)) continue;

            yield { type: 'edge-consider', edgeId: eid, javaLine: 13, message: `Shqyrtojmë skajin ${u}→${v} (peshë ${e.weight}).` };

            const candidate = dist[u] + e.weight;
            if (candidate < dist[v]) {
                dist[v] = candidate;
                prev[v] = u;        // ruaj paraardhësin për rindërtim rruge
                yield { type: 'edge-accept', edgeId: eid, distances: snap(), javaLine: 15, message: `Përditësojmë dist[${v}] = ${candidate}.` };
            } else {
                yield { type: 'edge-reject', edgeId: eid, javaLine: 15, message: `${candidate} ≥ dist[${v}] = ${dist[v]}. Pa ndryshim.` };
            }
        }
    }

    // rindërto pemën e rrugëve më të shkurtra nga prev[] dhe vizualizoje
    const shortestNodes = [];
    const shortestEdges = [];
    nodes.forEach(id => {
        if (prev[id] !== null) {
            shortestNodes.push(id);
            // gjej edge-in origjinal mes prev[id] dhe id (në cilëndo drejtim)
            const orig = graph.edges.find(e => {
                const src = typeof e.source === 'object' ? e.source.id : e.source;
                const tgt = typeof e.target === 'object' ? e.target.id : e.target;
                return (src === prev[id] && tgt === id) || (src === id && tgt === prev[id]);
            });
            if (orig) {
                const src = typeof orig.source === 'object' ? orig.source.id : orig.source;
                const tgt = typeof orig.target === 'object' ? orig.target.id : orig.target;
                shortestEdges.push(`graph-edge-${src}-${tgt}`);
            }
        }
    });
    shortestNodes.push(sourceId); // përfshi edhe burimin

    yield {
        type: 'shortest',
        path: shortestNodes.map(id => `graph-node-${id}`),
        edges: shortestEdges,
        distances: snap(),
        javaLine: 18,
        message: `Dijkstra përfundoi. Pema e rrugëve më të shkurtra theksohet në jeshile.`
    };
}

export { dijkstra, DEFAULT_GRAPH, JAVA_SOURCE };