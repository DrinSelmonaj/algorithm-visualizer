// ── Sort Renderer — vizaton shufrat në SVG ──

const SVG_PADDING    = 24;  // hapësira nga skajet
const BAR_GAP        = 4;   // hapësira mes shufrave
const LABEL_OFFSET   = 18;  // distanca e numrit mbi shufër

/**
 * Gjeneron array të rastësishëm
 * @param {number} size
 * @param {number} min
 * @param {number} max
 * @returns {number[]}
 */
function generateArray(size, min = 5, max = 100) {
    return Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

/**
 * Vizaton shufrat në SVG bazuar në array-in aktual
 * Kthën referencat SVG të çdo shufre për animator-in
 *
 * @param {number[]} array   - vlerat që do vizatohen
 * @param {string}   svgId   - id e elementit SVG
 * @returns {SVGElement[]}   - array i grupeve SVG [g > rect + text]
 */
function render(array, svgId = 'main-svg') {
    const svg    = document.getElementById(svgId);
    const width  = svg.getBoundingClientRect().width  - SVG_PADDING * 2;
    const height = svg.getBoundingClientRect().height - SVG_PADDING * 2 - LABEL_OFFSET;
    const maxVal = Math.max(...array);
    const n      = array.length;

    // Pastro SVG nga çdo gjë e mëparshme
    svg.innerHTML = '';

    // Grupi kryesor me padding
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${SVG_PADDING}, ${SVG_PADDING})`);
    svg.appendChild(g);

    const barWidth = (width - BAR_GAP * (n - 1)) / n;
    const bars     = [];

    array.forEach((value, i) => {
        const barHeight = (value / maxVal) * height;
        const x         = i * (barWidth + BAR_GAP);
        const y         = height - barHeight;

        // Grupi për shufër + etiketë
        const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        barGroup.setAttribute('class', 'sort-bar');
        barGroup.setAttribute('transform', `translate(${x}, 0)`);

        // Drejtkëndëshi (shufra)
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x',      0);
        rect.setAttribute('y',      y);
        rect.setAttribute('width',  barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('rx',     3);
        rect.classList.add('bar-default');

        // Etiketa e vlerës — shfaqet vetëm nëse ka hapësirë
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', barWidth / 2);
        label.setAttribute('y', y - 4);
        label.textContent = barWidth >= 14 ? value : '';

        barGroup.appendChild(rect);
        barGroup.appendChild(label);
        g.appendChild(barGroup);
        bars.push(barGroup);
    });

    return bars;
}

/**
 * Shënon të gjitha shufrat si të renditura (animacion final)
 * @param {SVGElement[]} bars
 */
function markAllSorted(bars) {
    bars.forEach((bar, i) => {
        // Vonesë progresive — bëhet si valë nga e majta
        setTimeout(() => {
            const rect = bar.querySelector('rect');
            if (rect) {
                rect.classList.remove('bar-default', 'bar-compare',
                                      'bar-swap', 'bar-pivot');
                rect.classList.add('bar-sorted');
            }
        }, i * 30);
    });
}

/**
 * Gjeneron shufra të renditura tashmë (për Binary Search)
 * Binary Search kërkon array të renditur paraprakisht
 * @param {number} size
 * @returns {number[]}
 */
function generateSortedArray(size) {
    return Array.from({ length: size }, (_, i) =>
        Math.floor((i / size) * 95) + 5
    );
}

export { render, markAllSorted, generateArray, generateSortedArray };