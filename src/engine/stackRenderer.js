// src/engine/stackRenderer.js
// Pure rendering module — rindërton vizualizimin e Stack në SVG.
// animator.js (applyDataStructureStep) aplikon CSS highlight classes.
// Algoritmi (src/algorithms/datastructures/stack/index.js) prodhon
// generator-in e hapave me yield { type, nodeId, render, message }.

const CELL_W  = 120;
const CELL_H  = 50;
const CELL_X  = 140;
const BASE_Y  = 420;
const GAP     = 8;
const MAX_VIS = 7;

function svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function setAttrs(el, map) {
    for (const [k, v] of Object.entries(map)) el.setAttribute(k, v);
}

/**
 * Rindërton pamjen e stack-ut bazuar në array-in aktual.
 * Çdo qelizë ka id = `stack-cell-${index}` për highlight nga animator.
 *
 * @param {any[]}  items  - elementet e stack-ut (index 0 = fund, last = majë)
 * @param {string} svgId
 */
function render(items, svgId = 'main-svg') {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';
    svg.setAttribute('viewBox', '0 0 400 480');

    const visible = items.slice(-MAX_VIS);
    const offset  = items.length - visible.length;

    visible.forEach((val, i) => {
        const realIndex = offset + i;
        const y = BASE_Y - i * (CELL_H + GAP);
        drawCell(svg, val, y, realIndex, realIndex === items.length - 1);
    });

    if (items.length > 0) {
        drawTopLabel(svg, BASE_Y - (Math.min(items.length, MAX_VIS) - 1) * (CELL_H + GAP));
    }

    drawBase(svg);

    if (items.length > MAX_VIS) {
        drawOverflow(svg, items.length - MAX_VIS);
    }

    visible.forEach((_, i) => {
        const realIndex = offset + i;
        const y = BASE_Y - i * (CELL_H + GAP);
        drawIndexLabel(svg, realIndex, y);
    });
}

function drawCell(svg, value, y, index, isTop) {
    const g = svgEl('g');
    g.id = `stack-cell-${index}`;
    g.setAttribute('class', 'ds-cell stack-cell' + (isTop ? ' stack-top' : ''));

    const rect = svgEl('rect');
    setAttrs(rect, { x: CELL_X, y: y - CELL_H / 2, width: CELL_W, height: CELL_H, rx: 6 });

    const text = svgEl('text');
    setAttrs(text, { x: CELL_X + CELL_W / 2, y, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
    text.textContent = value;

    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
}

function drawTopLabel(svg, topY) {
    const text = svgEl('text');
    setAttrs(text, { x: CELL_X - 16, y: topY, 'text-anchor': 'end', 'dominant-baseline': 'central', class: 'ds-pointer-label' });
    text.textContent = 'TOP';
    svg.appendChild(text);
}

function drawBase(svg) {
    const line = svgEl('line');
    setAttrs(line, { x1: CELL_X - 10, y1: BASE_Y + CELL_H / 2 + 6, x2: CELL_X + CELL_W + 10, y2: BASE_Y + CELL_H / 2 + 6, class: 'ds-base-line' });
    svg.appendChild(line);
}

function drawOverflow(svg, count) {
    const text = svgEl('text');
    setAttrs(text, { x: CELL_X + CELL_W / 2, y: BASE_Y - MAX_VIS * (CELL_H + GAP) - 20, 'text-anchor': 'middle', class: 'ds-overflow-label' });
    text.textContent = `+ ${count} more`;
    svg.appendChild(text);
}

function drawIndexLabel(svg, index, y) {
    const text = svgEl('text');
    setAttrs(text, { x: CELL_X + CELL_W + 12, y, 'text-anchor': 'start', 'dominant-baseline': 'central', class: 'ds-index-label' });
    text.textContent = `[${index}]`;
    svg.appendChild(text);
}

export { render };
