// Paneli i pavarur i distancave për Dijkstra. Nuk njeh D3 apo algoritmin;
// merr vetëm një snapshot të serializueshëm nga hapat e animimit.

function getPanel() {
    return document.getElementById('dijkstra-distance-panel');
}

function hideDistancePanel() {
    const panel = getPanel();
    if (panel) panel.hidden = true;
}

function renderDistancePanel({ distances, predecessors, sourceId, updatedNodeId }) {
    const panel = getPanel();
    const rows = document.getElementById('dijkstra-distance-rows');
    if (!panel || !rows) return;

    panel.hidden = false;
    rows.replaceChildren();

    Object.entries(distances).forEach(([nodeId, distance]) => {
        const row = document.createElement('div');
        row.className = 'distance-row';
        if (nodeId === sourceId) row.classList.add('distance-row--source');
        if (nodeId === updatedNodeId) row.classList.add('distance-row--updated');
        if (distance === '∞') row.classList.add('distance-row--unreached');

        const node = document.createElement('span');
        node.className = 'distance-node';
        node.textContent = `Nyja ${nodeId}`;

        const value = document.createElement('span');
        value.className = 'distance-value';
        value.textContent = String(distance);

        const origin = document.createElement('span');
        origin.className = 'distance-origin';
        if (nodeId === sourceId) origin.textContent = '(Src)';
        else if (predecessors[nodeId] != null) origin.textContent = `(nga ${predecessors[nodeId]})`;

        row.append(node, value, origin);
        rows.appendChild(row);
    });
}

export { renderDistancePanel, hideDistancePanel };
