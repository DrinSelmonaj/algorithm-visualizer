// Funksione të pastra për modelin e grafit. Këto nuk varen nga D3 apo DOM-i.

const NODE_ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]{0,31}$/;

function isValidNodeId(id) {
    return typeof id === 'string' && NODE_ID_PATTERN.test(id);
}

function idOf(value) {
    return typeof value === 'object' && value !== null ? value.id : value;
}

// D3 e muton source/target në objekte nyjesh. Snapshot-i e normalizon modelin
// përsëri në string dhe e shkëput plotësisht nga grafi që përdor edituesi.
function cloneGraph(graph) {
    return {
        nodes: graph.nodes.map(({ id }) => ({ id })),
        edges: graph.edges.map(edge => ({
            source: idOf(edge.source),
            target: idOf(edge.target),
            weight: Number(edge.weight),
        })),
    };
}

export { isValidNodeId, idOf, cloneGraph };
