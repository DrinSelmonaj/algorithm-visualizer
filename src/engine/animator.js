// src/engine/animator.js

import { updateStats } from '../ui/controls.js';
import { syncArrayState } from './sortRenderer.js';

const stats = {
    comparisons: 0,
    swaps:       0,
    writes:      0,
    step:        0
};

function resetStats() {
    stats.comparisons = 0;
    stats.swaps       = 0;
    stats.writes      = 0;
    stats.step        = 0;
    updateStats(stats);
}
function applyStep(step, bars, category) {
    // Rrit hapin për çdo step — por JO për 'sorted' dhe 'rerender'
    // sepse ato janë efekte vizuale, jo hapa logjike
    if (step.type !== 'sorted' && step.type !== 'rerender') {
        stats.step++;
    }

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

function applySortStep(step, bars) {
    clearBarStates(bars);

    switch (step.type) {

        case 'compare':
            // Radix NUK ka krahasime reale — step.real e tregon
            // Vetëm llogarisim krahasimin nëse step.real === true ose mungon
            if (step.real !== false) {
                stats.comparisons++;
            }
            if (step.indices && step.indices.length > 0) {
                step.indices.forEach(i => {
                    if (bars[i]) setBarState(bars[i], 'compare');
                });
            }
            break;

        case 'swap':
            stats.swaps++;
            step.indices.forEach(i => setBarState(bars[i], 'swap'));
            swapBarPositions(bars, step.indices[0], step.indices[1]);
            if (step.state) syncArrayState(step.state);
            break;

       case 'overwrite':
            // Overwrite nuk është swap — rrit 'writes', jo 'swaps'
            // Insertion/Shell (zhvendosje) + Merge/Radix (kopjim) e përdorin këtë
            stats.writes++;
            if (step.value != null && step.maxValue != null) {
                updateBarHeight(bars[step.index], step.value, step.maxValue);
            } else if (step.state) {
                // Merr maxValue nga array-i aktual
                const maxVal = Math.max(...step.state);
                updateBarHeight(bars[step.index], step.value, maxVal);
            }
            setBarState(bars[step.index], 'swap');
            if (step.state) syncArrayState(step.state);
            break;

        case 'sorted':
            if (Array.isArray(step.index)) {
                step.index.forEach(i => {
                    if (bars[i]) setBarState(bars[i], 'sorted');
                });
            } else if (step.index != null) {
                if (bars[step.index]) setBarState(bars[step.index], 'sorted');
            }
            break;

        case 'pivot':
            if (bars[step.index]) setBarState(bars[step.index], 'pivot');
            break;

        case 'found':
            if (step.indices) {
                step.indices.forEach(i => {
                    if (bars[i]) setBarState(bars[i], 'found');
                });
            } else if (step.index != null) {
                if (bars[step.index]) setBarState(bars[step.index], 'found');
            }
            break;

        case 'range':
            if (step.indices) {
                step.indices.forEach(i => {
                    if (bars[i]) setBarState(bars[i], 'compare');
                });
            }
            break;
    }
}

function setBarState(bar, state) {
    if (!bar) return;
    const rect = bar.querySelector('rect');
    if (!rect) return;
    rect.classList.remove('bar-default', 'bar-compare', 'bar-swap',
                          'bar-sorted',  'bar-pivot',   'bar-found', 'bar-search');
    rect.classList.add(`bar-${state}`);
}

function clearBarStates(bars) {
    bars.forEach(bar => {
        if (!bar) return;
        const rect = bar.querySelector('rect');
        if (!rect) return;
        if (!rect.classList.contains('bar-sorted')) {
            rect.classList.remove('bar-compare', 'bar-swap',
                                  'bar-pivot',   'bar-found', 'bar-search');
            rect.classList.add('bar-default');
        }
    });
}

function swapBarPositions(bars, i, j) {
    if (!bars[i] || !bars[j]) return;
    const xI = parseFloat(bars[i].getAttribute('transform').match(/translate\(([^,]+)/)[1]);
    const xJ = parseFloat(bars[j].getAttribute('transform').match(/translate\(([^,]+)/)[1]);
    bars[i].setAttribute('transform', `translate(${xJ}, 0)`);
    bars[j].setAttribute('transform', `translate(${xI}, 0)`);
    [bars[i], bars[j]] = [bars[j], bars[i]];
}

function updateBarHeight(bar, value, maxValue) {
    if (!bar || !maxValue) return;
    const rect  = bar.querySelector('rect');
    const label = bar.querySelector('text');
    const svgH  = document.getElementById('main-svg').getBoundingClientRect().height - 48;
    const newH  = (value / maxValue) * svgH;
    if (rect) {
        rect.setAttribute('height', newH);
        rect.setAttribute('y', svgH - newH);
    }
    if (label) {
        label.setAttribute('y', svgH - newH - 6);
        label.textContent = value;
    }
}

// ── BST ─────────────────────────────────────────────────────────

function applyBSTStep(step) {
    document.querySelectorAll('.bst-node').forEach(node => {
        node.classList.remove('visiting', 'found', 'inserting', 'deleting');
    });
    document.querySelectorAll('.bst-edge').forEach(edge => {
        edge.classList.remove('active');
    });

    switch (step.type) {
        case 'visit':
            if (step.nodeId) highlightBSTNode(step.nodeId, 'visiting');
            if (step.edgeId) highlightBSTEdge(step.edgeId);
            break;
        case 'found':
            if (step.nodeId) highlightBSTNode(step.nodeId, 'found');
            break;
        case 'insert':
            if (step.nodeId) highlightBSTNode(step.nodeId, 'inserting');
            break;
        case 'delete':
            if (step.nodeId) highlightBSTNode(step.nodeId, 'deleting');
            break;
        case 'rerender':
            if (step.render) step.render();
            break;
    }
}

function highlightBSTNode(nodeId, state) {
    const node = document.getElementById(nodeId);
    if (node) node.classList.add(state);
}

function highlightBSTEdge(edgeId) {
    const edge = document.getElementById(edgeId);
    if (edge) edge.classList.add('active');
}

// ── Graph ────────────────────────────────────────────────────────

function applyGraphStep(step) {
    switch (step.type) {
        case 'visit':
            if (step.nodeId) highlightGraphNode(step.nodeId, 'visited');
            break;
        case 'current':
            document.querySelectorAll('.graph-node.current')
                    .forEach(n => n.classList.remove('current'));
            if (step.nodeId) highlightGraphNode(step.nodeId, 'current');
            break;
        case 'edge-consider':
            if (step.edgeId) highlightGraphEdge(step.edgeId, 'considering');
            break;
        case 'edge-accept':
            if (step.edgeId) highlightGraphEdge(step.edgeId, 'in-tree');
            break;
        case 'edge-reject':
            if (step.edgeId) highlightGraphEdge(step.edgeId, '');
            break;
        case 'shortest':
            if (step.path)  step.path.forEach(id => highlightGraphNode(id, 'shortest'));
            if (step.edges) step.edges.forEach(id => highlightGraphEdge(id, 'in-tree'));
            break;
    }
}

function highlightGraphNode(nodeId, state) {
    const node = document.getElementById(nodeId);
    if (!node) return;
    node.classList.remove('visited', 'current', 'shortest');
    if (state) node.classList.add(state);
}

function highlightGraphEdge(edgeId, state) {
    const edge = document.getElementById(edgeId);
    if (!edge) return;
    edge.classList.remove('active', 'in-tree', 'considering');
    if (state) edge.classList.add(state);
}

// ── Data Structures ──────────────────────────────────────────────

function applyDataStructureStep(step) {
    document.querySelectorAll('.ds-node, .ds-cell, .ds-bucket, .ds-entry')
        .forEach(el => el.classList.remove(
            'active', 'inserting', 'deleting', 'found', 'comparing', 'hashing'
        ));

    switch (step.type) {
        case 'rerender':
            if (step.render) step.render();
            break;
        case 'push': case 'enqueue': case 'insert':
            if (step.nodeId) highlightDSNode(step.nodeId, 'inserting');
            break;
        case 'pop': case 'dequeue': case 'delete':
            if (step.nodeId) highlightDSNode(step.nodeId, 'deleting');
            break;
        case 'compare': case 'search':
            if (step.nodeId) highlightDSNode(step.nodeId, 'comparing');
            break;
        case 'found':
            if (step.nodeId) highlightDSNode(step.nodeId, 'found');
            break;
        case 'hash':
            if (step.bucketIndex != null) {
                const b = document.getElementById(`hm-bucket-${step.bucketIndex}`);
                if (b) b.classList.add('hashing');
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