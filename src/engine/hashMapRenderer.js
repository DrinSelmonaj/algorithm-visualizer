// src/engine/hashMapRenderer.js
// Pure rendering module — vizaton bucket array + chaining.

const BUCKET_COUNT = 8;
const BUCKET_W   = 80;
const BUCKET_H   = 44;
const CHAIN_W    = 110;
const CHAIN_H    = 36;
const START_X    = 50;
const START_Y    = 40;
const ROW_GAP    = 70;
const CHAIN_GAP  = 14;

function svgEl(tag) {
    return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

function setAttrs(el, map) {
    for (const [k, v] of Object.entries(map)) el.setAttribute(k, v);
}

/**
 * Rindërton HashMap me të gjitha bucket-et dhe chain-et.
 * IDs:  bucket  → `hm-bucket-${i}`
 *       entry   → `hm-entry-${entry.id}`
 *
 * @param {Array[]} buckets - buckets[i] = [{id, key, value}, ...]
 * @param {string}  svgId
 */
function render(buckets, svgId = 'main-svg') {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    svg.innerHTML = '';

    // 700 njësi mjaftojnë vetëm për ~4 entries/bucket; nëse koliziona e
    // kalojnë këtë, zinxhiri del jashtë viewBox-it (bug i konfirmuar).
    // Gjejmë zinxhirin më të gjatë dhe zgjerojmë viewBox-in vetëm nëse duhet.
    const maxChainLen = Math.max(0, ...Array.from({ length: BUCKET_COUNT }, (_, i) => (buckets[i] || []).length));
    const chainStartX = START_X + BUCKET_W + 30;
    const neededWidth  = maxChainLen > 0
        ? chainStartX + maxChainLen * (CHAIN_W + CHAIN_GAP) + 40
        : chainStartX + 60;

    svg.setAttribute('viewBox', `0 0 ${Math.max(700, neededWidth)} ${START_Y + BUCKET_COUNT * ROW_GAP + 20}`);

    addArrowDefs(svg);

    for (let i = 0; i < BUCKET_COUNT; i++) {
        const y = START_Y + i * ROW_GAP;
        const entries = buckets[i] || [];
        drawBucket(svg, i, y, entries.length > 0);
        drawChain(svg, entries, y);
    }
}

function drawBucket(svg, index, y, occupied = false) {
    const g = svgEl('g');
    g.id = `hm-bucket-${index}`;
    g.setAttribute('class', 'ds-bucket hm-bucket' + (occupied ? ' hm-bucket-occupied' : ''));

    const rect = svgEl('rect');
    setAttrs(rect, { x: START_X, y: y - BUCKET_H / 2, width: BUCKET_W, height: BUCKET_H, rx: 6 });

    const text = svgEl('text');
    setAttrs(text, { x: START_X + BUCKET_W / 2, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'ds-index-label' });
    text.textContent = `[${index}]`;

    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
}

function drawChain(svg, entries, y) {
    let x = START_X + BUCKET_W + 30;

    if (entries.length === 0) {
        drawArrow(svg, START_X + BUCKET_W, y, x, y);
        drawNull(svg, x + 4, y);
        return;
    }

    entries.forEach((entry, i) => {
        const fromX = i === 0 ? START_X + BUCKET_W : x - CHAIN_GAP;
        drawArrow(svg, fromX, y, x, y);
        drawEntry(svg, entry, x, y);
        x += CHAIN_W + CHAIN_GAP;
    });

    drawArrow(svg, x - CHAIN_GAP, y, x, y);
    drawNull(svg, x + 4, y);
}

function drawEntry(svg, entry, x, y) {
    const g = svgEl('g');
    g.id = `hm-entry-${entry.id}`;
    g.setAttribute('class', 'ds-entry hm-entry');

    const rect = svgEl('rect');
    setAttrs(rect, { x, y: y - CHAIN_H / 2, width: CHAIN_W, height: CHAIN_H, rx: 5 });

    const div = svgEl('line');
    setAttrs(div, { x1: x + CHAIN_W * 0.5, y1: y - CHAIN_H / 2, x2: x + CHAIN_W * 0.5, y2: y + CHAIN_H / 2, class: 'ds-divider' });

    const keyT = svgEl('text');
    setAttrs(keyT, { x: x + CHAIN_W * 0.25, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'hm-key' });
    keyT.textContent = entry.key;

    const valT = svgEl('text');
    setAttrs(valT, { x: x + CHAIN_W * 0.75, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'hm-val' });
    valT.textContent = entry.value;

    g.appendChild(rect);
    g.appendChild(div);
    g.appendChild(keyT);
    g.appendChild(valT);
    svg.appendChild(g);
}

function drawArrow(svg, x1, y1, x2, y2) {
    const line = svgEl('line');
    setAttrs(line, { x1, y1, x2, y2, class: 'hm-arrow', 'marker-end': 'url(#hm-arrow-head)' });
    svg.appendChild(line);
}

function drawNull(svg, x, y) {
    const text = svgEl('text');
    setAttrs(text, { x, y, 'text-anchor': 'start', 'dominant-baseline': 'central', class: 'ds-null-label' });
    text.textContent = 'null';
    svg.appendChild(text);
}

function addArrowDefs(svg) {
    const defs   = svgEl('defs');
    const marker = svgEl('marker');
    setAttrs(marker, { id: 'hm-arrow-head', viewBox: '0 -5 10 10', refX: 9, refY: 0, markerWidth: 6, markerHeight: 6, orient: 'auto' });
    const path = svgEl('path');
    setAttrs(path, { d: 'M0,-5L10,0L0,5', class: 'll-arrowhead' });
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);
}

export { render, BUCKET_COUNT };