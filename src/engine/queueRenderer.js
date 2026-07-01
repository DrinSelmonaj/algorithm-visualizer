// src/engine/queueRenderer.js
// Pure rendering module — index 0 = front (dequeue), last = rear (enqueue).

const CELL_W  = 80;
const CELL_H  = 60;
const START_X = 40;
const CENTER_Y = 200;
const GAP     = 8;
const MAX_VIS = 6;

function svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function setAttrs(el, map) {
    for (const [k, v] of Object.entries(map)) el.setAttribute(k, v);
}

/**
 * Rindërton queue-n. Çdo qelizë ka id = `queue-cell-${index}`.
 * @param {any[]}  items
 * @param {string} svgId
 */
function render(items, svgId = 'main-svg') {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 620 400');

    const visible = items.slice(0, MAX_VIS);

    visible.forEach((val, i) => {
        const x = START_X + i * (CELL_W + GAP);
        drawCell(svg, val, x, i, i === 0, i === visible.length - 1);
    });

    if (items.length > MAX_VIS) drawOverflow(svg, items.length - MAX_VIS);

    if (items.length > 0) {
        drawPointerLabel(svg, 'FRONT', START_X + CELL_W / 2, CENTER_Y + CELL_H / 2 + 28);
        const rearX = START_X + (Math.min(items.length, MAX_VIS) - 1) * (CELL_W + GAP) + CELL_W / 2;
        drawPointerLabel(svg, 'REAR', rearX, CENTER_Y - CELL_H / 2 - 16);
        drawDirectionArrow(svg, items.length);
    }
}

function drawCell(svg, value, x, index, isFront, isRear) {
    const g = svgEl('g');
    g.id = `queue-cell-${index}`;
    g.setAttribute('class', 'ds-cell queue-cell' +
        (isFront ? ' queue-front' : '') + (isRear ? ' queue-rear' : ''));

    const rect = svgEl('rect');
    setAttrs(rect, { x, y: CENTER_Y - CELL_H / 2, width: CELL_W, height: CELL_H, rx: 6 });

    const text = svgEl('text');
    setAttrs(text, { x: x + CELL_W / 2, y: CENTER_Y, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    text.textContent = value;

    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
}

function drawPointerLabel(svg, label, x, y) {
    const text = svgEl('text');
    setAttrs(text, { x, y, 'text-anchor': 'middle', class: 'ds-pointer-label' });
    text.textContent = label;
    svg.appendChild(text);
}

function drawOverflow(svg, count) {
    const x = START_X + MAX_VIS * (CELL_W + GAP) + 10;
    const text = svgEl('text');
    setAttrs(text, { x, y: CENTER_Y, 'text-anchor': 'start', 'dominant-baseline': 'central', class: 'ds-overflow-label' });
    text.textContent = `+${count} more`;
    svg.appendChild(text);
}

function drawDirectionArrow(svg, count) {
    const y  = CENTER_Y + CELL_H / 2 + 50;
    const x1 = START_X;
    const x2 = START_X + Math.min(count, MAX_VIS) * (CELL_W + GAP) - GAP;
    const line = svgEl('line');
    setAttrs(line, { x1, y1: y, x2, y2: y, class: 'ds-direction-line' });
    svg.appendChild(line);

    const deq = svgEl('text');
    setAttrs(deq, { x: x1 - 4, y, 'text-anchor': 'end', 'dominant-baseline': 'central', class: 'ds-dir-label' });
    deq.textContent = '← dequeue';
    svg.appendChild(deq);

    const enq = svgEl('text');
    setAttrs(enq, { x: x2 + 4, y, 'text-anchor': 'start', 'dominant-baseline': 'central', class: 'ds-dir-label' });
    enq.textContent = 'enqueue →';
    svg.appendChild(enq);
}

export { render };
