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
    if (delta.swaps != null || delta.writes != null) {
        const el = document.getElementById('stat-swaps');
        // Vetëm njëri prej të dyve është >0 për çdo algoritëm — kombinimi është gjithmonë korrekt
        if (el) el.textContent = (delta.swaps || 0) + (delta.writes || 0);
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
            <input type="number" id="ds-input"
                   placeholder="Vlera" class="ds-input">
            <input type="number" id="ds-after"
                   placeholder="Pas vlerës..." class="ds-input ds-input--small">
            <button class="btn btn-primary"
                onclick="window.__dsOp('insertHead', document.getElementById('ds-input').value)">
                ↑ Head
            </button>
            <button class="btn btn-primary"
                onclick="window.__dsOp('insertTail', document.getElementById('ds-input').value)">
                ↓ Tail
            </button>
            <button class="btn btn-secondary"
                onclick="window.__dsOp('insertAfter', document.getElementById('ds-input').value, document.getElementById('ds-after').value)">
                → Pas vlerës
            </button>
            <input type="number" id="ds-delete-next"
                   placeholder="Pas saj (Fshi)" class="ds-input ds-input--small"
                   title="Opsionale: fshi vlerën që ndiqet menjëherë nga kjo vlerë">
            <label class="ds-null-next-option" title="Fshin vetëm nyjen e zgjedhur që është tail">
                <input type="checkbox" id="ds-delete-next-null"> Next = null
            </label>
            <button class="btn btn-secondary"
                onclick="window.__dsOp('delete', document.getElementById('ds-input').value, document.getElementById('ds-delete-next').value, document.getElementById('ds-delete-next-null').checked)">
                Fshi
            </button>
            <button class="btn btn-secondary"
                onclick="window.__dsOp('search', document.getElementById('ds-input').value)">
                Kërko
            </button>
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
// Paneli për shtim dinamik nyjesh/skajesh te grafet (Dijkstra/Kruskal) —
// pjesa bazë e përbashkët për të dy algoritmet.
const GRAPH_PANEL_BASE = `
    <div class="ds-ops" id="graph-panel">
        <div class="ds-input-row">
            <input type="text" id="graph-node-input" placeholder="ID nyje (p.sh. G)" class="ds-input ds-input--small">
            <button class="btn btn-primary" onclick="window.__graphOp('addNode', document.getElementById('graph-node-input').value)">Shto Nyje</button>
        </div>
        <div class="ds-input-row">
            <input type="text" id="graph-source-input" placeholder="Nga (p.sh. A)" class="ds-input ds-input--small">
            <input type="text" id="graph-target-input" placeholder="Tek (p.sh. B)" class="ds-input ds-input--small">
            <input type="number" id="graph-weight-input" placeholder="Pesha" class="ds-input ds-input--small">
            <button class="btn btn-primary" onclick="window.__graphOp('addEdge', document.getElementById('graph-source-input').value, document.getElementById('graph-target-input').value, document.getElementById('graph-weight-input').value)">Shto Lidhje</button>
        </div>
    </div>`;

// Rreshti "nyja fillestare" — VETËM Dijkstra e përdor kuptimplotë (ndikon
// rezultatin real). Kruskal punon mbi skaje globalisht të renditura + Union-
// Find, s'ka nocion "nisje" fare — MST-ja del identike pavarësisht nyjes.
// Mbaje jashtë GRAPH_PANEL_BASE, shtoje vetëm kur showGraphPanel() e kërkon.
const GRAPH_SOURCE_ROW = `
    <div class="ds-input-row">
    <input type="text" id="graph-source-node" placeholder="Nyja fillestare (default A)" class="ds-input ds-input--small">
</div>`;

/**
 * Shfaq panelin e editimit të grafit — thirret nga main.js kur cat === 'graph'.
 * Ndjek të njëjtin pattern si showDSPanel() për konsistencë.
 * @param {Function} graphOpCallback — window.__graphOp nga main.js
 * @param {boolean} showSourceNode — true vetëm për Dijkstra (Kruskal s'e ka nevojë)
 */
function showGraphPanel(graphOpCallback, showSourceNode = false) {
    window.__graphOp = graphOpCallback;
    const container = document.getElementById('ds-controls');
    if (!container) return;
    container.innerHTML = GRAPH_PANEL_BASE + (showSourceNode ? GRAPH_SOURCE_ROW : '');
    container.style.display = 'flex';
}
export { updateStats, resetStats, showDSPanel, hideDSPanel, showGraphPanel, bindControls };
