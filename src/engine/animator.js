// ── Animator — aplikon çdo hap vizualisht në SVG ──

import { updateStats } from '../ui/controls.js';

// Gjurmon statistikat live
const stats = {
    comparisons: 0,
    swaps:       0,
    step:        0
};

/**
 * Resets statistikat në zero
 */
function resetStats() {
    stats.comparisons = 0;
    stats.swaps       = 0;
    stats.step        = 0;
    updateStats(stats);
}

/**
 * Proceson 1 hap nga algoritmi dhe e aplikon në SVG
 * Kjo funksion thirret nga scheduler për çdo hap
 *
 * @param {Object} step        - Hapi i ardhur nga generator-i
 * @param {Array}  bars        - Referencat SVG të shufrave (sort)
 * @param {string} category    - 'sorting' | 'searching' | 'bst' | 'graph'
 */
function applyStep(step, bars, category) {
    stats.step++;

    if (category === 'sorting' || category === 'searching') {
        applySortStep(step, bars);
    } else if (category === 'bst') {
        applyBSTStep(step);
    } else if (category === 'graph') {
        applyGraphStep(step);
    } else if (category === 'datastructures') {
        applyDataStructureStep(step);
    }

    updateStats(stats);
}

// ── Sorting & Searching ──────────────────────────────────────────

/**
 * Aplikon hapat e renditjes dhe kërkimit në shufra SVG
 * @param {Object} step
 * @param {Array}  bars
 */
function applySortStep(step, bars) {
    // Pastro gjendjet e mëparshme para çdo hapi
    clearBarStates(bars);

    switch (step.type) {

        case 'compare':
            stats.comparisons++;
            step.indices.forEach(i => setBarState(bars[i], 'compare'));
            break;

        case 'swap':
            stats.swaps++;
            step.indices.forEach(i => setBarState(bars[i], 'swap'));
            swapBarPositions(bars, step.indices[0], step.indices[1], step.state);
            break;

        case 'overwrite':
            // Radix dhe Merge përdorin overwrite në vend të swap
            updateBarHeight(bars[step.index], step.value, step.maxValue);
            setBarState(bars[step.index], 'swap');
            break;

        case 'sorted':
            // Ky element ka gjetur pozicionin final
            if (Array.isArray(step.index)) {
                step.index.forEach(i => setBarState(bars[i], 'sorted'));
            } else {
                setBarState(bars[step.index], 'sorted');
            }
            break;

        case 'pivot':
            setBarState(bars[step.index], 'pivot');
            break;

        case 'found':
            setBarState(bars[step.index], 'found');
            break;

        case 'range':
            // Binary Search — zona aktive e kërkimit
            step.indices.forEach(i => setBarState(bars[i], 'compare'));
            break;
    }
}

/**
 * Ndryshon klasën CSS të një shufre — CSS bën tranzicionin
 * @param {SVGElement} bar
 * @param {string}     state - 'compare' | 'swap' | 'sorted' | 'pivot' | 'found'
 */
function setBarState(bar, state) {
    if (!bar) return;
    const rect = bar.querySelector('rect');
    if (!rect) return;

    // Hiq të gjitha gjendjet e mëparshme
    rect.classList.remove('bar-default', 'bar-compare', 'bar-swap',
                          'bar-sorted',  'bar-pivot',   'bar-found',
                          'bar-search');

    rect.classList.add(`bar-${state}`);
}

/**
 * Heq gjendjet e të gjitha shufrave (kthehet në default)
 * @param {Array} bars
 */
function clearBarStates(bars) {
    bars.forEach(bar => {
        if (!bar) return;
        const rect = bar.querySelector('rect');
        if (!rect) return;

        // Mos pastro 'sorted' — ato mbeten jeshile përgjithmonë
        if (!rect.classList.contains('bar-sorted')) {
            rect.classList.remove('bar-compare', 'bar-swap',
                                  'bar-pivot',   'bar-found', 'bar-search');
            rect.classList.add('bar-default');
        }
    });
}

/**
 * Shkëmben pozicionet vizuale të dy shufrave
 * CSS transition e bën lëvizjen smooth automatikisht
 *
 * @param {Array}  bars
 * @param {number} i
 * @param {number} j
 * @param {Array}  newState - Array-i pas swap-it
 */
function swapBarPositions(bars, i, j, newState) {
    if (!bars[i] || !bars[j]) return;

    // Lexo pozicionet aktuale
    const xI = parseFloat(bars[i].getAttribute('transform').match(/translate\(([^,]+)/)[1]);
    const xJ = parseFloat(bars[j].getAttribute('transform').match(/translate\(([^,]+)/)[1]);

    // Shkëmbe pozicionet — CSS transition animon lëvizjen
    bars[i].setAttribute('transform', `translate(${xJ}, 0)`);
    bars[j].setAttribute('transform', `translate(${xI}, 0)`);

    // Shkëmbe referencat në array
    [bars[i], bars[j]] = [bars[j], bars[i]];
}

/**
 * Përditëson lartësinë e një shufre (për Radix / Merge overwrite)
 * @param {SVGElement} bar
 * @param {number}     value
 * @param {number}     maxValue
 */
function updateBarHeight(bar, value, maxValue) {
    if (!bar) return;
    const rect  = bar.querySelector('rect');
    const label = bar.querySelector('text');
    const svgH  = document.getElementById('main-svg').getBoundingClientRect().height - 48;
    const newH  = (value / maxValue) * svgH;

    rect.setAttribute('height', newH);
    rect.setAttribute('y', svgH - newH);

    if (label) {
        label.setAttribute('y', svgH - newH - 6);
        label.textContent = value;
    }
}

// ── BST ─────────────────────────────────────────────────────────

/**
 * Aplikon hapat e BST — shton/heq klasa në nyje SVG
 * @param {Object} step
 */
function applyBSTStep(step) {
    // Pastro gjendjet e mëparshme
    document.querySelectorAll('.bst-node').forEach(node => {
        node.classList.remove('visiting', 'found', 'inserting', 'deleting');
    });

    document.querySelectorAll('.bst-edge').forEach(edge => {
        edge.classList.remove('active');
    });

    switch (step.type) {

        case 'visit':
            highlightBSTNode(step.nodeId, 'visiting');
            if (step.edgeId) highlightBSTEdge(step.edgeId);
            break;

        case 'found':
            highlightBSTNode(step.nodeId, 'found');
            break;

        case 'insert':
            highlightBSTNode(step.nodeId, 'inserting');
            break;

        case 'delete':
            highlightBSTNode(step.nodeId, 'deleting');
            break;

        case 'rerender':
            // BST ndryshoi strukturë — bstRenderer e rindërton pemën
            import('./bstRenderer.js').then(m => m.rerender(step.tree));
            break;
    }
}

function highlightBSTNode(nodeId, state) {
    const node = document.getElementById(`bst-node-${nodeId}`);
    if (node) node.classList.add(state);
}

function highlightBSTEdge(edgeId) {
    const edge = document.getElementById(`bst-edge-${edgeId}`);
    if (edge) edge.classList.add('active');
}

// ── Graph ────────────────────────────────────────────────────────

/**
 * Aplikon hapat e Dijkstra / Kruskal në nyjet e grafit
 * @param {Object} step
 */
function applyGraphStep(step) {
    switch (step.type) {

        case 'visit':
            highlightGraphNode(step.nodeId, 'visited');
            break;

        case 'current':
            // Hiq 'current' nga nyja e mëparshme
            document.querySelectorAll('.graph-node.current')
                    .forEach(n => n.classList.remove('current'));
            highlightGraphNode(step.nodeId, 'current');
            break;

        case 'edge-consider':
            highlightGraphEdge(step.edgeId, 'considering');
            break;

        case 'edge-accept':
            // Kruskal: ky edge hyn në pemën minimale
            highlightGraphEdge(step.edgeId, 'in-tree');
            break;

        case 'edge-reject':
            highlightGraphEdge(step.edgeId, '');
            break;

        case 'shortest':
            // Dijkstra: rruga më e shkurtër u gjet
            step.path.forEach(nodeId => highlightGraphNode(nodeId, 'shortest'));
            step.edges.forEach(edgeId => highlightGraphEdge(edgeId, 'in-tree'));
            break;
    }
}

function highlightGraphNode(nodeId, state) {
    const node = document.getElementById(`graph-node-${nodeId}`);
    if (!node) return;
    node.classList.remove('visited', 'current', 'shortest');
    if (state) node.classList.add(state);
}

function highlightGraphEdge(edgeId, state) {
    const edge = document.getElementById(`graph-edge-${edgeId}`);
    if (!edge) return;
    edge.classList.remove('active', 'in-tree', 'considering');
    if (state) edge.classList.add(state);
}

// ── Data Structures ──────────────────────────────────────────────

/**
 * Aplikon hapat e Stack / Queue / LinkedList / HashMap
 * Çdo renderer eksporton render() — ky funksion e thërret
 * atë dhe aplikon klasat CSS për highlight.
 *
 * step.dsType  — 'stack' | 'queue' | 'linkedlist' | 'hashmap'
 * step.type    — 'push' | 'pop' | 'enqueue' | 'dequeue' |
 *                'insert' | 'delete' | 'search' | 'found' |
 *                'hash'  | 'compare' | 'rerender'
 */
function applyDataStructureStep(step) {
    // Pastro gjendjet e mëparshme
    document.querySelectorAll('.ds-node, .ds-cell, .ds-bucket, .ds-entry')
        .forEach(el => el.classList.remove('active', 'inserting', 'deleting',
                                            'found', 'comparing', 'hashing'));

    switch (step.type) {

        case 'rerender':
            // Renderer-i përkatës rindërton SVG-në plotësisht
            if (step.render) step.render();
            break;

        case 'push':
        case 'enqueue':
        case 'insert':
            if (step.nodeId) highlightDSNode(step.nodeId, 'inserting');
            break;

        case 'pop':
        case 'dequeue':
        case 'delete':
            if (step.nodeId) highlightDSNode(step.nodeId, 'deleting');
            break;

        case 'compare':
        case 'search':
            if (step.nodeId) highlightDSNode(step.nodeId, 'comparing');
            break;

        case 'found':
            if (step.nodeId) highlightDSNode(step.nodeId, 'found');
            break;

        case 'hash':
            // HashMap: thekso bucket-in ku shkon çelësi
            if (step.bucketIndex != null) {
                const bucket = document.getElementById(`hm-bucket-${step.bucketIndex}`);
                if (bucket) bucket.classList.add('hashing');
            }
            break;
    }

    if (step.message) {
        const el = document.getElementById('ds-message');
        if (el) el.textContent = step.message;
    }
}

function highlightDSNode(nodeId, state) {
    const el = document.getElementById(nodeId);
    if (el) el.classList.add(state);
}

export { applyStep, resetStats };