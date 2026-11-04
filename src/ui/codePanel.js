// src/ui/codePanel.js
// Menaxhon panelin e kodit Java në të djathtë.
// Highlight.js është ngarkuar globalisht nga vendor/.

/**
 * Shfaq kodin Java për algoritmin aktiv.
 * Thirret nga main.js kur zgjidhet algoritëm i ri.
 * @param {string} javaSource — kodi që do të shfaqet
 * @param {string} language — gjuha e Highlight.js ('java' | 'plaintext')
 */
function showCode(javaSource, language = 'java') {
    const el = document.getElementById('java-code-display');
    if (!el) return;
    el.replaceChildren();

    // Rifillo gjithmonë nga fillimi — një pozicion i vjetër scroll
    // horizontal s'duhet të mbetet "i mbërthyer" kur ngarkohet kod i ri.
    const container = el.closest('pre');
    if (container) {
        container.scrollLeft = 0;
        container.scrollTop = 0;
    }

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
        content.innerHTML = language === 'plaintext'
            ? escapeHtml(line || ' ')
            : hljs.highlight(line || ' ', { language, ignoreIllegals: true }).value;
        row.append(lineNumber, content);
        el.appendChild(row);
    });
}

function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
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

    // Scroll automatik VERTIKAL te rreshti aktiv — jo horizontal.
    // scrollIntoView() do të lëvizte edhe majtas/djathtas pa dashje, tani që
    // .code-line ka width:100% (i gjerë sa gjithë <code>, jo vetëm teksti).
    scrollLineIntoView(line, el.closest('pre'));
}

/**
 * Sjell rreshtin aktiv në pamje kur skeda "Kodi" bëhet e dukshme — nëse hapi
 * u ekzekutua ndërsa paneli ishte i fshehur, scroll-i s'ishte i mundur.
 */
function revealActiveLine() {
    const el = document.getElementById('java-code-display');
    const line = el?.querySelector('.code-line.active');
    if (line) scrollLineIntoView(line, el.closest('pre'), 'auto');
}

function scrollLineIntoView(line, container, behavior = 'smooth') {
    // Kur paneli është display:none, offsetTop/clientHeight janë 0 — mos llogarit
    if (container && container.clientHeight > 0) {
        const lineTop    = line.offsetTop;
        const lineBottom = lineTop + line.offsetHeight;
        const viewTop    = container.scrollTop;
        const viewBottom = viewTop + container.clientHeight;

        // left: 0 brenda të njëjtës scrollTo() — një `scrollLeft = 0` i veçantë
        // menjëherë pas scroll-it smooth e anulonte animacionin vertikal, dhe
        // paneli s'lëvizte kurrë te rreshtat poshtë pjesës së dukshme.
        let top = viewTop;
        if (lineTop < viewTop) {
            top = lineTop;
        } else if (lineBottom > viewBottom) {
            top = lineBottom - container.clientHeight;
        }

        if (top !== viewTop) {
            container.scrollTo({ top, left: 0, behavior });
        } else {
            container.scrollLeft = 0;
        }
    }
}

function clearLineHighlight() {
    const el = document.getElementById('java-code-display');
    if (!el) return;
    el.querySelectorAll('.code-line.active').forEach(line => line.classList.remove('active'));
}

export { showCode, highlightLine, revealActiveLine, clearLineHighlight };