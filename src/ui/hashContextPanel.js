// src/ui/hashContextPanel.js
// HashMap Kontekst Ekzekutimi — panel i vogël që shfaq Key/Shumën e hash-it/
// Bucket-in gjatë ekzekutimit të put/get/remove. Njësoj në frymë si
// distancePanel.js për Dijkstra — thirret nga animator.js te rasti 'hash'.

function renderHashContext({ key, hashSum, bucketIndex, bucketCount }) {
    const panel = document.getElementById('hashmap-context-panel');
    if (!panel) return;

    panel.hidden = false;
    panel.innerHTML = `
        <h3>Konteksti i Hash-it</h3>
        <div class="hash-context-row">
            <span class="hash-context-label">Key</span>
            <span class="hash-context-value">"${escapeHtml(key)}"</span>
        </div>
        <div class="hash-context-row">
            <span class="hash-context-label">Shuma e karaktereve</span>
            <span class="hash-context-value">${hashSum}</span>
        </div>
        <div class="hash-context-row hash-context-row--result">
            <span class="hash-context-label">% ${bucketCount} (bucket)</span>
            <span class="hash-context-value hash-context-value--index">${bucketIndex}</span>
        </div>
    `;
}

function hideHashContext() {
    const panel = document.getElementById('hashmap-context-panel');
    if (!panel) return;
    panel.hidden = true;
    panel.innerHTML = '';
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
}

export { renderHashContext, hideHashContext };
