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
    el.replaceChildren();

    javaSource.split('\n').forEach((line, index) => {
        const row = document.createElement('span');
        row.className = 'code-line';

        const lineNumber = document.createElement('span');
        lineNumber.className = 'line-number';
        lineNumber.textContent = String(index + 1);

        const content = document.createElement('span');
        content.className = 'line-content';
        // Highlight.js prodhon markup të sigurt nga teksti i kodit; struktura
        // mbetet e izoluar për çdo rresht, ndaj s'kemi më regex mbi HTML.
        content.innerHTML = hljs.highlight(line || ' ', { language: 'java', ignoreIllegals: true }).value;
        row.append(lineNumber, content);
        el.appendChild(row);
    });
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

    const line = el.querySelector(`.code-line:nth-child(${lineNumber})`);
    if (!line) return;
    line.classList.add('active');

    // Scroll automatik te rreshti aktiv
    line.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function clearLineHighlight() {
    const el = document.getElementById('java-code-display');
    if (!el) return;
    el.querySelectorAll('.code-line.active').forEach(line => line.classList.remove('active'));
}

export { showCode, highlightLine, clearLineHighlight };
