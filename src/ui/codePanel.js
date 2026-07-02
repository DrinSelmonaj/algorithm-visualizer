// src/ui/codePanel.js
// Menaxhon panelin e kodit Java në të djathtë.
// Highlight.js është ngarkuar globalisht nga vendor/.

/**
 * Shfaq kodin Java për algoritmin aktiv.
 * Thirret nga main.js kur zgjidhet algoritëm i ri.
 * @param {string} javaSource — stringu i plotë Java
 */
function showCode(javaSource) {
    const el = document.getElementById('java-code-display');
    if (!el) return;
    el.textContent = javaSource;
    // Highlight.js ri-ngjyros elementin pas ndryshimit të tekstit
    hljs.highlightElement(el);
    // Fshi highlight-in e mëparshëm të rreshtit aktiv
    clearLineHighlight();
}

/**
 * Thekson rreshtin aktiv të kodit Java gjatë animimit.
 * Thirret nga main.js pas çdo hapi me step.javaLine.
 * @param {number} lineNumber — 1-indexed
 */
function highlightLine(lineNumber) {
    clearLineHighlight();
    const el = document.getElementById('java-code-display');
    if (!el || !lineNumber) return;

    // Ndajmë kodin në rreshta, ngjyrosim rreshtin e duhur
    const lines = el.innerHTML.split('\n');
    if (lineNumber < 1 || lineNumber > lines.length) return;

    lines[lineNumber - 1] =
        `<span class="code-line-active">${lines[lineNumber - 1]}</span>`;

    el.innerHTML = lines.join('\n');

    // Scroll automatik te rreshti aktiv
    const activeEl = el.querySelector('.code-line-active');
    if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function clearLineHighlight() {
    const el = document.getElementById('java-code-display');
    if (!el) return;
    // Hiq span-et e highlight-it pa prekur tekstin
    el.innerHTML = el.innerHTML.replace(
        /<span class="code-line-active">(.*?)<\/span>/g, '$1'
    );
}

export { showCode, highlightLine, clearLineHighlight };