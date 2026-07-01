// src/engine/bstRenderer.js
// Pure rendering module — builds/rebuilds BST nodes & edges in SVG.
// Does NOT apply step states; animator.js owns all highlighting logic
// (applyBSTStep) and calls rerender() only when the tree structure changes.

const NODE_R   = 24;
const H_GAP    = 64;
const V_GAP    = 80;
const MARGIN   = { top: 40, left: 40 };

/**
 * Computes x/y for every node via in-order traversal (x) and depth (y).
 * @param {Object} node
 * @param {number} depth
 * @param {Object} state - shared counter { n, maxX, maxY }
 */
function computeLayout(node, depth, state) {
    if (!node) return;
    computeLayout(node.left, depth + 1, state);
    node.x = MARGIN.left + state.n * H_GAP;
    node.y = MARGIN.top + depth * V_GAP;
    state.maxX = Math.max(state.maxX, node.x);
    state.maxY = Math.max(state.maxY, node.y);
    state.n++;
    computeLayout(node.right, depth + 1, state);
}

function svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function setAttrs(el, map) {
    for (const [k, v] of Object.entries(map)) el.setAttribute(k, v);
}

/**
 * Full (re)render of the BST into the target SVG.
 * Called on initial load and whenever the tree structure mutates
 * (insert/delete) — see animator.js 'rerender' step type.
 *
 * @param {Object|null} tree  - root node { id, value, left, right }
 * @param {string} svgId
 */
function rerender(tree, svgId = 'main-svg') {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';

    if (!tree) return;

    const state = { n: 0, maxX: 0, maxY: 0 };
    computeLayout(tree, 0, state);

    const vw = Math.max(400, state.maxX + NODE_R + 40);
    const vh = Math.max(200, state.maxY + NODE_R + 40);
    svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);

    drawEdges(tree, svg);
    drawNodes(tree, svg);
}

function drawEdges(node, svg) {
    if (!node) return;
    if (node.left)  { drawEdge(node, node.left, svg);  drawEdges(node.left, svg); }
    if (node.right) { drawEdge(node, node.right, svg); drawEdges(node.right, svg); }
}

function drawEdge(parent, child, svg) {
    const line = svgEl('line');
    line.id = `bst-edge-${parent.id}-${child.id}`;
    setAttrs(line, {
        x1: parent.x, y1: parent.y,
        x2: child.x,  y2: child.y,
        class: 'bst-edge',
    });
    svg.appendChild(line);
}

function drawNodes(node, svg) {
    if (!node) return;
    drawNode(node, svg);
    drawNodes(node.left, svg);
    drawNodes(node.right, svg);
}

function drawNode(node, svg) {
    const g = svgEl('g');
    g.id = `bst-node-${node.id}`;
    g.setAttribute('class', 'bst-node');
    g.setAttribute('transform', `translate(${node.x},${node.y})`);

    const circle = svgEl('circle');
    setAttrs(circle, { r: NODE_R, class: 'bst-node-circle' });

    const text = svgEl('text');
    setAttrs(text, {
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        class: 'bst-node-label',
    });
    text.textContent = node.value;

    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
}

export { rerender };
