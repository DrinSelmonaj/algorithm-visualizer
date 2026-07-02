// src/ui/controls.js
// Menaxhon të gjitha ndërveprimet e UI:
// — butonin e operacioneve për Data Structures (push/pop/enqueue etj.)
// — statistikat live (krahasime, ndërrrime, hapi)
// — input-et për vlera




function updateStats(delta = {}) {
    if (delta.comparisons != null) {
        const el = document.getElementById('stat-comparisons');
        if (el) el.textContent = delta.comparisons;
    }
    if (delta.swaps != null) {
        const el = document.getElementById('stat-swaps');
        if (el) el.textContent = delta.swaps;
    }
    if (delta.step != null) {
        const el = document.getElementById('stat-step');
        if (el) el.textContent = delta.step;
    }
}

/**
 * Rivendos statistikat në zero.
 * Thirret nga main.js kur zgjidhet algoritëm i ri ose reset.
 */
function resetStats() {
    ['stat-comparisons', 'stat-swaps', 'stat-step'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
}
// ─── Paneli i operacioneve DS ─────────────────────────────────────
// Shfaqet vetëm kur kategoria aktive është 'datastructures'.
// Çdo strukturë ka butonat e vet — fshihen/shfaqen dinamikisht.

const DS_PANELS = {
    stack: `
        <div class="ds-ops" id="ds-panel-stack">
            <div class="ds-input-row">
                <input type="number" id="ds-input" placeholder="Vlera" class="ds-input">
                <button class="btn btn-primary" onclick="window.__dsOp('push', document.getElementById('ds-input').value)">Push</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('pop')">Pop</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('peek')">Peek</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('isEmpty')">isEmpty</button>
            </div>
        </div>`,

    queue: `
        <div class="ds-ops" id="ds-panel-queue">
            <div class="ds-input-row">
                <input type="number" id="ds-input" placeholder="Vlera" class="ds-input">
                <button class="btn btn-primary" onclick="window.__dsOp('enqueue', document.getElementById('ds-input').value)">Enqueue</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('dequeue')">Dequeue</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('peek')">Peek</button>
            </div>
        </div>`,

    linkedlist: `
        <div class="ds-ops" id="ds-panel-linkedlist">
            <div class="ds-input-row">
                <input type="number" id="ds-input" placeholder="Vlera" class="ds-input">
                <button class="btn btn-primary"   onclick="window.__dsOp('insertHead', document.getElementById('ds-input').value)">Insert Head</button>
                <button class="btn btn-primary"   onclick="window.__dsOp('insertTail', document.getElementById('ds-input').value)">Insert Tail</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('delete',     document.getElementById('ds-input').value)">Delete</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('search',     document.getElementById('ds-input').value)">Search</button>
            </div>
        </div>`,

    hashmap: `
        <div class="ds-ops" id="ds-panel-hashmap">
            <div class="ds-input-row">
                <input type="text"   id="ds-key"   placeholder="Çelës (key)"  class="ds-input ds-input--small">
                <input type="number" id="ds-value" placeholder="Vlera (value)" class="ds-input ds-input--small">
                <button class="btn btn-primary"   onclick="window.__dsOp('put',    document.getElementById('ds-key').value, document.getElementById('ds-value').value)">Put</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('get',    document.getElementById('ds-key').value)">Get</button>
                <button class="btn btn-secondary" onclick="window.__dsOp('remove', document.getElementById('ds-key').value)">Remove</button>
            </div>
        </div>`,
};

/**
 * Shfaq panelit e operacioneve për strukturën aktive.
 * Thirret nga main.js kur zgjidhet një Data Structure.
 * @param {string} key — 'stack' | 'queue' | 'linkedlist' | 'hashmap'
 * @param {Function} dsOpCallback — window.__dsOp nga main.js
 */
function showDSPanel(key, dsOpCallback) {
    // Regjistro callback globalisht që ta thërrasë onclick inline
    window.__dsOp = dsOpCallback;

    const container = document.getElementById('ds-controls');
    if (!container) return;

    container.innerHTML = DS_PANELS[key] || '';
    container.style.display = 'flex';
}

/**
 * Fsheh panelit e DS kur zgjidhet algoritëm tjetër (jo DS).
 */
function hideDSPanel() {
    const container = document.getElementById('ds-controls');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

/**
 * Lidhja me main.js — thirret një herë pas DOMContentLoaded.
 * main.js e importon dhe e thërret me callback-un e vet.
 */
function bindControls(onDSOp) {
    // window.__dsOp vendoset dinamikisht nga showDSPanel()
    // bindControls ruhet për lidhje shtesë nëse nevojitet
    window.__dsOpMain = onDSOp;
}

export { updateStats, resetStats, showDSPanel, hideDSPanel, bindControls };