// ── Sort Renderer — vizaton shufrat në SVG ──

const SVG_PADDING    = 24;
const BAR_GAP        = 4;
const LABEL_OFFSET   = 18;

let lastArray = null;
let lastSvgId = null;
let resizeObserverAttached = false;
let onResizeRerenderCb = null;

// main.js e thërret këtë një herë, që të mësojë kur sortRenderer.js
// rindërton bar-at vetë (për shkak resize) dhe të rifreskojë referencat
// e veta (currentBars) — përndryshe applyStep() vazhdon të prekë
// elementë të shkëputur nga DOM-i pas çdo resize gjatë një xhirimi aktiv.
function onResizeRerender(callback) {
    onResizeRerenderCb = callback;
}

// Thirret nga animator.js pas çdo hapi 'swap'/'overwrite' (të cilët
// bashkangjisin gjithmonë step.state — pamjen e plotë aktuale të array-it).
// PA këtë, lastArray mbetet përgjithmonë array-i origjinal para-xhirimit,
// dhe çdo resize (mes ose PAS xhirimit) e rikthen pamjen te ai origjinal,
// edhe pse stats tregojnë xhirim të kryer/në vazhdim — bug-u i "krahasimeve
// që rriten por shufrave që s'lëvizin", raportuar nga Drin 16 korrik.
function syncArrayState(newArray) {
    if (lastArray) lastArray = newArray;
}

function generateArray(size, min = 5, max = 100) {
    return Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

function render(array, svgId = 'main-svg') {
    const svg = document.getElementById(svgId);
    const rect = svg.getBoundingClientRect();

    if (rect.width < 20 || rect.height < 20) {
        requestAnimationFrame(() => render(array, svgId));
        return [];
    }

    // KRITIKE: stack/queue/linkedList/hashMap/bst vendosin viewBox FIKS të vetin
    // (p.sh. stackRenderer "0 0 400 480") mbi #main-svg dhe s'e heqin kurrë.
    // sortRenderer nuk e prek viewBox-in fare, ndaj trashëgon shkallëzimin e
    // gabuar të renderer-it të fundit që ka xhiruar — kjo shkakton shufrat e
    // shtrembëruara pas Stack/Queue/LinkedList/HashMap → Sorting. E rivendosim
    // vetë, saktësisht si bën tashmë graphRenderer.js, në mënyrë që 1 unit të
    // barazohet gjithmonë me 1px real.
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);

    lastArray = array;
    lastSvgId = svgId;
    attachResizeObserver(svg);

    const width  = rect.width  - SVG_PADDING * 2;
    const height = rect.height - SVG_PADDING * 2 - LABEL_OFFSET;
    const maxVal = Math.max(...array);
    const n      = array.length;

    svg.innerHTML = '';

    // Kapitulli 3: efekt glass+glow — box-shadow s'aplikohet mbi <rect> SVG,
    // ndaj përdorim <filter> real. feGaussianBlur turbullon një kopje të
    // vetë formës (SourceGraphic, që tashmë ka ngjyrën e gjendjes — blu/
    // portokalli/kuq/gjelbër/vjollcë), feMerge e vendos atë kopje të
    // turbulluar POSHTË origjinalit të mprehtë → glow që përshtatet
    // automatikisht me çdo ngjyrë gjendjeje, pa filtra të veçantë për secilën.
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <filter id="bar-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
            <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <linearGradient id="bar-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stop-color="#ffffff" stop-opacity="0.22"/>
            <stop offset="55%" stop-color="#ffffff" stop-opacity="0.04"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>`;
    svg.appendChild(defs);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${SVG_PADDING}, ${SVG_PADDING})`);
    svg.appendChild(g);

    const barWidth = (width - BAR_GAP * (n - 1)) / n;
    const bars     = [];

    array.forEach((value, i) => {
        const barHeight = (value / maxVal) * height;
        const x         = i * (barWidth + BAR_GAP);
        const y         = height - barHeight;

        const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        barGroup.setAttribute('class', 'sort-bar');
        barGroup.setAttribute('transform', `translate(${x}, 0)`);

        const barRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        barRect.setAttribute('x',      0);
        barRect.setAttribute('y',      y);
        barRect.setAttribute('width',  barWidth);
        barRect.setAttribute('height', barHeight);
        barRect.setAttribute('rx',     3);
        barRect.setAttribute('filter', 'url(#bar-glow)');
        barRect.classList.add('bar-default');

        // Sheen "xhami" — rect e dytë, e njëjta madhësi, gradient i bardhë
        // gjysmë-transparent nga lart-poshtë. pointer-events:none që të mos
        // ndërhyjë me asnjë interaksion; s'ka classList gjendjeje, ndaj
        // mbetet e pandryshuar pavarësisht ngjyrës aktuale të barRect.
        const barSheen = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        barSheen.setAttribute('x',      0);
        barSheen.setAttribute('y',      y);
        barSheen.setAttribute('width',  barWidth);
        barSheen.setAttribute('height', barHeight);
        barSheen.setAttribute('rx',     3);
        barSheen.classList.add('bar-sheen');
        barSheen.setAttribute('fill',   'url(#bar-glass)');
        barSheen.setAttribute('pointer-events', 'none');

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', barWidth / 2);
        label.setAttribute('y', y - 4);
        label.textContent = barWidth >= 14 ? value : '';

        barGroup.appendChild(barRect);
        barGroup.appendChild(barSheen);
        barGroup.appendChild(label);
        g.appendChild(barGroup);
        bars.push(barGroup);
    });

    return bars;
}

function attachResizeObserver(svg) {
    if (resizeObserverAttached) return;
    resizeObserverAttached = true;

    let debounceTimer = null;
    const observer = new ResizeObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (lastArray && document.getElementById(lastSvgId)) {
                const newBars = render(lastArray, lastSvgId);
                if (onResizeRerenderCb) onResizeRerenderCb(newBars);
            }
        }, 80);
    });
    observer.observe(svg);
}

function resetSortRenderer() {
    lastArray = null;
}

function markAllSorted(bars) {
    bars.forEach((bar, i) => {
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

// Njësoj si generateArray() (vlera random 5-100), por i renditur —
// binary search kërkon array të renditur. Më parë ishte formulë deterministike
// e varur vetëm nga 'size' — prodhonte TË NJËJTIN array çdo herë, prandaj
// "✕ Random" te Kërkimi dukej sikur s'bënte asgjë.
function generateSortedArray(size, min = 5, max = 100) {
    const arr = Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
    return arr.sort((a, b) => a - b);
}

export { render, markAllSorted, generateArray, generateSortedArray, resetSortRenderer, onResizeRerender, syncArrayState };
