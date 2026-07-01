// src/engine/graphRenderer.js
// Pure rendering module using D3 force layout.
// animator.js (applyGraphStep) manipulates highlight classes directly via
// getElementById('graph-node-${id}') / getElementById('graph-edge-${id}'),
// so this module's only job is to build those DOM elements with matching ids
// and keep their positions updated via D3's simulation tick.

let simulation = null;

function svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function setAttrs(el, map) {
    for (const [k, v] of Object.entries(map)) el.setAttribute(k, v);
}

/**
 * Edge id convention: `${source}-${target}` (undirected — algorithms must
 * yield edgeId matching the order edges were defined in the graph object).
 */
function edgeId(edge) {
    const s = typeof edge.source === 'object' ? edge.source.id : edge.source;
    const t = typeof edge.target === 'object' ? edge.target.id : edge.target;
    return `${s}-${t}`;
}

/**
 * Renders a graph { nodes: [{id}], edges: [{source,target,weight}] }
 * into the target SVG using a D3 force simulation for layout.
 *
 * @param {Object} graph
 * @param {string} svgId
 * @returns {Object} the D3 simulation (caller may stop() it on reset)
 */
function render(graph, svgId = 'main-svg') {
    if (simulation) simulation.stop();

    const svg = document.getElementById(svgId);
    if (!svg) return null;
    svg.innerHTML = '';

    const rect = svg.getBoundingClientRect();
    const width  = rect.width  || 700;
    const height = rect.height || 420;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const d3svg = d3.select(svg);

    const edgeGroup   = d3svg.append('g').attr('class', 'graph-edges');
    const nodeGroup   = d3svg.append('g').attr('class', 'graph-nodes');
    const weightGroup = d3svg.append('g').attr('class', 'graph-weights');

    const edgeSel = edgeGroup.selectAll('line')
        .data(graph.edges)
        .join('line')
        .attr('id', d => `graph-edge-${edgeId(d)}`)
        .attr('class', 'graph-edge');

    const weightSel = weightGroup.selectAll('text')
        .data(graph.edges)
        .join('text')
        .attr('class', 'graph-weight')
        .text(d => d.weight ?? '');

    const nodeSel = nodeGroup.selectAll('g')
        .data(graph.nodes)
        .join('g')
        .attr('id', d => `graph-node-${d.id}`)
        .attr('class', 'graph-node')
        .call(d3.drag()
            .on('start', dragStart)
            .on('drag', dragging)
            .on('end', dragEnd));

    nodeSel.append('circle').attr('r', 20);
    nodeSel.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .text(d => d.id);
    nodeSel.append('text')
        .attr('class', 'graph-dist-label')
        .attr('text-anchor', 'middle')
        .attr('dy', -26)
        .text('');

    simulation = d3.forceSimulation(graph.nodes)
        .force('link', d3.forceLink(graph.edges).id(d => d.id).distance(110))
        .force('charge', d3.forceManyBody().strength(-350))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide(36))
        .on('tick', () => {
            edgeSel
                .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
            weightSel
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2 - 6);
            nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
        });

    function dragStart(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
    }
    function dragging(event, d) { d.fx = event.x; d.fy = event.y; }
    function dragEnd(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
    }

    return simulation;
}

function stop() {
    if (simulation) simulation.stop();
}

export { render, stop, edgeId };
