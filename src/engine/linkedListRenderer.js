// src/engine/linkedListRenderer.js
// Pure rendering module — vizaton zinxhirin e nyjeve me shigjeta SVG.

const NODE_W  = 90;
const NODE_H  = 56;
const START_X = 50;
const CENTER_Y = 180;
const GAP     = 56;
const MAX_VIS = 6;

function svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function setAttrs(el, map) {
    for (const [k, v] of Object.entries(map)) el.setAttribute(k, v);
}

/**
 * Rindërton linked list nga head pointer.
 * Çdo nyje ka id = `ll-node-${node.id}` për highlight nga animator.
 *
 * @param {Object|null} head   - nyja e parë { id, value, next }
 * @param {string}      svgId
 */
function render(head, svgId = 'main-svg') {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 700 320');

    addArrowDefs(svg);

    const nodes = [];
    let cur = head;
    while (cur && nodes.length < MAX_VIS) { nodes.push(cur); cur = cur.next; }

    // reachedEnd = arritëm null-in real brenda MAX_VIS — nyja e fundit e
    // dukshme ËSHTË tail-i i vërtetë (jo thjesht e fundit para "+N more")
    const reachedEnd = !cur;

    nodes.forEach((node, i) => {
        const x = START_X + i * (NODE_W + GAP);
        const isTail = reachedEnd && i === nodes.length - 1;
        drawNode(svg, node, x, i === 0, isTail);
        if (i < nodes.length - 1) drawArrow(svg, x + NODE_W, CENTER_Y, x + NODE_W + GAP, CENTER_Y);
    });

    if (nodes.length > 0) {
        const lastX = START_X + (nodes.length - 1) * (NODE_W + GAP);
        drawArrow(svg, lastX + NODE_W, CENTER_Y, lastX + NODE_W + 40, CENTER_Y);
        drawNull(svg, lastX + NODE_W + 46, CENTER_Y);
        // Nyje e vetme = head DHE tail njëkohësisht — një etiketë e kombinuar
        // në vend që HEAD/TAIL të mbivendosen mbi njëra-tjetrën
        const singleNode = reachedEnd && nodes.length === 1;
        drawHeadLabel(svg, START_X + NODE_W / 2, singleNode ? 'HEAD / TAIL' : 'HEAD');
        if (reachedEnd && !singleNode) drawTailLabel(svg, lastX + NODE_W / 2);
    } else {
        drawNull(svg, START_X, CENTER_Y);
    }

    // Trego sa nyje janë fshehur
    if (cur) {
        let hidden = 0;
        while (cur) { hidden++; cur = cur.next; }
        drawOverflow(svg, hidden);
    }
}

function drawNode(svg, node, x, isHead, isTail = false) {
    const g = svgEl('g');
    g.id = `ll-node-${node.id}`;
    g.setAttribute('class', 'ds-node ll-node' +
        (isHead ? ' ll-node-head' : '') + (isTail ? ' ll-node-tail' : ''));

    const rect = svgEl('rect');
    setAttrs(rect, { x, y: CENTER_Y - NODE_H / 2, width: NODE_W, height: NODE_H, rx: 6 });

    const divider = svgEl('line');
    setAttrs(divider, {
        x1: x + NODE_W * 0.65, y1: CENTER_Y - NODE_H / 2,
        x2: x + NODE_W * 0.65, y2: CENTER_Y + NODE_H / 2,
        class: 'ds-divider',
    });

    const text = svgEl('text');
    setAttrs(text, { x: x + NODE_W * 0.325, y: CENTER_Y, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'ds-node-label' });
    text.textContent = node.value;

    g.appendChild(rect);
    g.appendChild(divider);
    g.appendChild(text);
    svg.appendChild(g);
}

function drawArrow(svg, x1, y1, x2, y2) {
    const line = svgEl('line');
    setAttrs(line, { x1, y1, x2, y2, class: 'll-arrow', 'marker-end': 'url(#ll-arrow-head)' });
    svg.appendChild(line);
}

function drawNull(svg, x, y) {
    const text = svgEl('text');
    setAttrs(text, { x, y, 'text-anchor': 'start', 'dominant-baseline': 'central', class: 'ds-null-label' });
    text.textContent = 'null';
    svg.appendChild(text);
}

function drawHeadLabel(svg, x, label = 'HEAD') {
    const text = svgEl('text');
    setAttrs(text, { x, y: CENTER_Y - NODE_H / 2 - 14, 'text-anchor': 'middle', class: 'ds-pointer-label ds-pointer-label--head' });
    text.textContent = label;
    svg.appendChild(text);
}

function drawTailLabel(svg, x) {
    const text = svgEl('text');
    setAttrs(text, { x, y: CENTER_Y - NODE_H / 2 - 14, 'text-anchor': 'middle', class: 'ds-pointer-label ds-pointer-label--tail' });
    text.textContent = 'TAIL';
    svg.appendChild(text);
}

function drawOverflow(svg, count) {
    const x = START_X + MAX_VIS * (NODE_W + GAP) + 10;
    const text = svgEl('text');
    setAttrs(text, { x, y: CENTER_Y, 'text-anchor': 'start', 'dominant-baseline': 'central', class: 'ds-overflow-label' });
    text.textContent = `+${count} more →`;
    svg.appendChild(text);
}

function addArrowDefs(svg) {
    const defs   = svgEl('defs');
    const marker = svgEl('marker');
    setAttrs(marker, { id: 'll-arrow-head', viewBox: '0 -5 10 10', refX: 9, refY: 0, markerWidth: 6, markerHeight: 6, orient: 'auto' });
    const path = svgEl('path');
    setAttrs(path, { d: 'M0,-5L10,0L0,5', class: 'll-arrowhead' });
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);
}

export { render };