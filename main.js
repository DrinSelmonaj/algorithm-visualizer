// main.js — Pika e hyrjes së aplikacionit
// Importon të gjitha modulet dhe lidh UI me engine.

import { render as renderBars, markAllSorted, generateArray, generateSortedArray } from './src/engine/sortRenderer.js';
import { rerender as rerenderBST } from './src/engine/bstRenderer.js';
import { initGraph, getGraph, addNode, addEdge } from './src/ui/graphBuilder.js';

import { run, stepOnce, pause, resume, stop, getState } from './src/engine/scheduler.js';
import { applyStep, resetStats } from './src/engine/animator.js';

import { bindControls, showDSPanel, showGraphPanel, hideDSPanel } from './src/ui/controls.js'
import { showCode, highlightLine } from './src/ui/codePanel.js';
import { showComplexity } from './src/ui/complexity.js';

// ── Sorting algorithms ────────────────────────────────────────────
import { bubbleSort,    JAVA_SOURCE as JAVA_BUBBLE    } from './src/algorithms/sorting/bubble.js';
import { insertionSort, JAVA_SOURCE as JAVA_INSERTION } from './src/algorithms/sorting/insertion.js';
import { selectionSort, JAVA_SOURCE as JAVA_SELECTION } from './src/algorithms/sorting/selection.js';
import { mergeSort,     JAVA_SOURCE as JAVA_MERGE     } from './src/algorithms/sorting/merge.js';
import { quickSort,     JAVA_SOURCE as JAVA_QUICK     } from './src/algorithms/sorting/quick.js';
import { shellSort,     JAVA_SOURCE as JAVA_SHELL     } from './src/algorithms/sorting/shell.js';
import { heapSort,      JAVA_SOURCE as JAVA_HEAP      } from './src/algorithms/sorting/heap.js';
import { radixSort,     JAVA_SOURCE as JAVA_RADIX     } from './src/algorithms/sorting/radix.js';

// ── Searching algorithms ──────────────────────────────────────────
import { linearSearch, JAVA_SOURCE as JAVA_LINEAR } from './src/algorithms/searching/linear.js';
import { binarySearch, JAVA_SOURCE as JAVA_BINARY } from './src/algorithms/searching/binary.js';

// ── Trees ─────────────────────────────────────────────────────────
import { bstAlgorithm, bstSearch,
         JAVA_SOURCE as JAVA_BST } from './src/algorithms/bst.js'
// ── Graphs ────────────────────────────────────────────────────────
import { dijkstra, JAVA_SOURCE as JAVA_DIJKSTRA } from './src/algorithms/graph/dijkstra.js';
import { kruskal,  JAVA_SOURCE as JAVA_KRUSKAL  } from './src/algorithms/graph/kruskal.js';

// ── Data Structures ───────────────────────────────────────────────
import { init as initStack,  push, pop, peek as peekStack, isEmpty, JAVA_SOURCE as JAVA_STACK }
    from './src/algorithms/datastructures/stack/index.js';
import { init as initQueue,  enqueue, dequeue, peek as peekQueue, JAVA_SOURCE as JAVA_QUEUE }
    from './src/algorithms/datastructures/queue/index.js';
import { init as initLL, insertAtHead, insertAtTail, insertAfterValue,
         deleteLL, searchLL, JAVA_SOURCE as JAVA_LL }
    from './src/algorithms/datastructures/linkedlist/index.js';
import { init as initHM, put, get, remove, JAVA_SOURCE as JAVA_HM }
    from './src/algorithms/datastructures/hashmap/index.js';

// ─── Regjistri i algoritmeve ──────────────────────────────────────
// Çdo hyrje mban: gjeneratorin, kodin Java, dhe kategorinë.
const ALGORITHMS = {
    // Sorting
    bubble:    { gen: (arr) => bubbleSort(arr),    java: JAVA_BUBBLE,    category: 'sorting',   name: 'Bubble Sort'    },
    insertion: { gen: (arr) => insertionSort(arr), java: JAVA_INSERTION, category: 'sorting',   name: 'Insertion Sort' },
    selection: { gen: (arr) => selectionSort(arr), java: JAVA_SELECTION, category: 'sorting',   name: 'Selection Sort' },
    merge:     { gen: (arr) => mergeSort(arr),     java: JAVA_MERGE,     category: 'sorting',   name: 'Merge Sort'     },
    quick:     { gen: (arr) => quickSort(arr),     java: JAVA_QUICK,     category: 'sorting',   name: 'Quick Sort'     },
    shell:     { gen: (arr) => shellSort(arr),     java: JAVA_SHELL,     category: 'sorting',   name: 'Shell Sort'     },
    heap:      { gen: (arr) => heapSort(arr),      java: JAVA_HEAP,      category: 'sorting',   name: 'Heap Sort'      },
    radix:     { gen: (arr) => radixSort(arr),     java: JAVA_RADIX,     category: 'sorting',   name: 'Radix Sort'     },

    // Searching
    linear:    { gen: (arr, target) => linearSearch(arr, target), java: JAVA_LINEAR, category: 'searching', name: 'Linear Search' },
    binary:    { gen: (arr, target) => binarySearch(arr, target), java: JAVA_BINARY, category: 'searching', name: 'Binary Search' },

    // Trees
    bst:       { gen: () => bstAlgorithm(), java: JAVA_BST, category: 'bst', name: 'BST' },

   // Graphs
    dijkstra:  { gen: (g, src) => dijkstra(g, src), java: JAVA_DIJKSTRA, category: 'graph', name: 'Dijkstra' },
    kruskal:   { gen: (g) => kruskal(g),  java: JAVA_KRUSKAL,  category: 'graph', name: 'Kruskal'  },

    // Data Structures
    stack:      { java: JAVA_STACK, category: 'datastructures', name: 'Stack'       },
    queue:      { java: JAVA_QUEUE, category: 'datastructures', name: 'Queue'       },
    linkedlist: { java: JAVA_LL,    category: 'datastructures', name: 'Linked List' },
    hashmap:    { java: JAVA_HM,    category: 'datastructures', name: 'HashMap'     },
};

// ─── Gjendja globale ──────────────────────────────────────────────
let currentAlgo    = null;   // çelësi i ALGORITHMS
let currentBars    = [];     // referencat SVG të shufrave (sort/search)
let currentArray   = [];     // array aktual
let currentGen     = null;   // gjeneratori aktual
let speedValue     = 2;      // 1 | 2 | 3

// ─── Kur klikohet një buton algoritmi ────────────────────────────
function selectAlgorithm(algoKey) {
    stop();
    currentAlgo = algoKey;
    const algo = ALGORITHMS[algoKey];

    // Emri dhe kompleksiteti
    document.getElementById('active-algo-name').textContent = algo.name;
    showComplexity(algoKey);
    showCode(algo.java);

    resetStats();
    resetButtons();

    // Inicializo varësisht nga kategoria
    const cat = algo.category;
    if (cat === 'sorting' || cat === 'searching') {
        hideDSPanel();
        document.getElementById('bst-input-group').style.display = 'none';
        document.querySelector('.size-control').style.display = '';
        const size = parseInt(document.getElementById('size-slider').value);
        currentArray = cat === 'searching'
            ? generateSortedArray(size)
            : generateArray(size);
        currentBars = renderBars(currentArray);
        enableButtons(['run', 'step', 'reset']);

    } else if (cat === 'bst') {
        hideDSPanel();
        document.getElementById('bst-input-group').style.display = 'flex';
        document.querySelector('.size-control').style.display = 'none';
        rerenderBST(null);
        enableButtons(['reset']);

    } else if (cat === 'graph') {
        hideDSPanel();
        document.getElementById('bst-input-group').style.display = 'none';
        document.querySelector('.size-control').style.display = 'none';
        initGraph();
        showGraphPanel((op, ...args) => runGraphOperation(op, ...args));
        document.getElementById('btn-run').disabled = false;
        document.getElementById('btn-reset').disabled = false;

    } else if (cat === 'datastructures') {
        hideDSPanel();
        showDSPanel(algoKey, (op, ...args) => runDSOperation(op, ...args));
        document.getElementById('bst-input-group').style.display = 'none';
        document.querySelector('.size-control').style.display = 'none';
        initDataStructure(algoKey);
        enableButtons(['reset']);
    }
}

// ─── Inicializo Data Structure ────────────────────────────────────
function initDataStructure(key) {
    if (key === 'stack')      initStack();
    if (key === 'queue')      initQueue();
    if (key === 'linkedlist') initLL();
    if (key === 'hashmap')    initHM();
}

// ─── Run ──────────────────────────────────────────────────────────
function runAlgorithm() {
    if (!currentAlgo) return;

    const { isRunning, isPaused } = getState();

    // Nëse është në pauzë, vazhdo — mos fillo run të ri
    if (isPaused) { resume(); return; }

    // Nëse po ekzekutohet, ndaloje së pari
    if (isRunning) stop();

    // Reset stats para çdo run të ri
    resetStats();
    currentGen = null;

    const algo = ALGORITHMS[currentAlgo];
    const cat  = algo.category;

    if (cat === 'sorting') {
        currentGen = algo.gen([...currentArray]);
    } else if (cat === 'searching') {
        const target = parseInt(prompt('Shkruaj numrin për të kërkuar:') || '0');
        currentGen = algo.gen([...currentArray], target);
    } else if (cat === 'graph') {
    const graph = getGraph();
    if (!graph) return;
    const sourceInput = document.getElementById('graph-source-node');
    const sourceId = (sourceInput?.value.trim()) || 'A';
    currentGen = algo.gen(graph, sourceId);

    } else if (cat === 'datastructures') {
        return;
    }

    if (!currentGen) return;

    setButtonState('pause', false);
    setButtonState('run', true);

    run(
        currentGen,
        (step) => {
            applyStep(step, currentBars, cat);
            if (step.javaLine) highlightLine(step.javaLine);
        },
        () => {
            if (cat === 'sorting') markAllSorted(currentBars);
            setButtonState('run', false);
            setButtonState('pause', true);
        },
        speedValue
    );
}

// ─── Step (hap manual) ────────────────────────────────────────────
function stepAlgorithm() {
    if (!currentAlgo) return;
    const algo = ALGORITHMS[currentAlgo];
    const cat  = algo.category;

    if (!currentGen) {
        if (cat === 'sorting') currentGen = algo.gen([...currentArray]);
        else return;
    }

    stepOnce(
        currentGen,
        (step) => {
            applyStep(step, currentBars, cat);
            if (step.javaLine) highlightLine(step.javaLine);
        },
        () => {
            if (cat === 'sorting') markAllSorted(currentBars);
        }
    );
}

// ─── Reset ────────────────────────────────────────────────────────
function resetAlgorithm() {
    stop();
    currentGen = null;
    resetStats();

    if (!currentAlgo) return;
    const algo = ALGORITHMS[currentAlgo];
    const cat  = algo.category;

    if (cat === 'sorting' || cat === 'searching') {
        const size = parseInt(document.getElementById('size-slider').value);
        currentArray = cat === 'searching'
            ? generateSortedArray(size)
            : generateArray(size);
        currentBars = renderBars(currentArray);
    } else if (cat === 'bst') {
        rerenderBST(null);
    } else if (cat === 'graph') {
        initGraph();
    } else if (cat === 'datastructures') {
        initDataStructure(currentAlgo);
    }

    resetButtons();
    enableButtons(['run', 'step', 'reset']);
}

// ─── Lidhja me Data Structure operations (nga UI) ─────────────────
function runDSOperation(operation, ...args) {
    if (!currentAlgo) return;
    const cat = ALGORITHMS[currentAlgo].category;
    if (cat !== 'datastructures') return;

    let gen;
    if (currentAlgo === 'stack') {
        if (operation === 'push')    gen = push(args[0]);
        if (operation === 'pop')     gen = pop();
        if (operation === 'peek')    gen = peekStack();
        if (operation === 'isEmpty') gen = isEmpty();
    } else if (currentAlgo === 'queue') {
        if (operation === 'enqueue') gen = enqueue(args[0]);
        if (operation === 'dequeue') gen = dequeue();
        if (operation === 'peek')    gen = peekQueue();
    } else if (currentAlgo === 'linkedlist') {
        if (operation === 'insertHead')  gen = insertAtHead(parseInt(args[0]));
        if (operation === 'insertTail')  gen = insertAtTail(parseInt(args[0]));
        if (operation === 'insertAfter') gen = insertAfterValue(parseInt(args[0]), parseInt(args[1]));
        if (operation === 'delete')      gen = deleteLL(parseInt(args[0]));
        if (operation === 'search')      gen = searchLL(parseInt(args[0]));
    } else if (currentAlgo === 'hashmap') {
        if (operation === 'put')    gen = put(args[0], args[1]);
        if (operation === 'get')    gen = get(args[0]);
        if (operation === 'remove') gen = remove(args[0]);
    }

    if (!gen) return;

    run(
        gen,
        (step) => {
            applyStep(step, [], 'datastructures');
            if (step.javaLine) highlightLine(step.javaLine);
        },
        () => {},
        speedValue
    );
}

// ─── Lidhja me Graph operations (nga UI) ──────────────────────────
// Thirret nga controls.js kur përdoruesi shton nyje/skaj te grafi
function runGraphOperation(operation, ...args) {
    if (operation === 'addNode') addNode(args[0].trim());
    if (operation === 'addEdge') addEdge(args[0].trim(), args[1].trim(), args[2]);
}

// ─── Lidhja e butonave të sidebar-it ──────────────────────────────
document.querySelectorAll('.algo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectAlgorithm(btn.dataset.algorithm);
    });
});

// ─── Kontrolluesit kryesorë ───────────────────────────────────────
document.getElementById('btn-run').addEventListener('click', () => {
    const { isRunning, isPaused } = getState();
    if (isPaused) { resume(); return; }
    runAlgorithm();
});

document.getElementById('btn-pause').addEventListener('click', () => pause());
document.getElementById('btn-reset').addEventListener('click', resetAlgorithm);
document.getElementById('btn-step').addEventListener('click', stepAlgorithm);

// ─── BST Input Buttons ────────────────────────────────────────────
document.getElementById('btn-bst-run').addEventListener('click', () => {
    const input = document.getElementById('bst-values-input').value.trim() || '5,3,7,1,4';
    const vals  = input.split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n) && n > 0);

    if (vals.length === 0) return;
    resetStats();
    const gen = bstAlgorithm(vals);
    run(
        gen,
        (step) => { applyStep(step, [], 'bst'); if (step.javaLine) highlightLine(step.javaLine); },
        () => {},
        speedValue
    );
});

document.getElementById('btn-bst-search').addEventListener('click', () => {
    const target = parseInt(document.getElementById('bst-search-input').value);
    if (isNaN(target)) return;
    const gen = bstSearch(target);
    run(
        gen,
        (step) => { applyStep(step, [], 'bst'); if (step.javaLine) highlightLine(step.javaLine); },
        () => {},
        speedValue
    );
});

document.getElementById('speed-slider').addEventListener('input', (e) => {
    speedValue = parseInt(e.target.value);
});

document.getElementById('size-slider').addEventListener('input', (e) => {
    document.getElementById('size-value').textContent = e.target.value;

    stop();
    resetStats();
    currentGen = null;

    if (!currentAlgo) return;
    const cat = ALGORITHMS[currentAlgo].category;

    if (cat === 'sorting' || cat === 'searching') {
        const size = parseInt(e.target.value);
        currentArray = cat === 'searching'
            ? generateSortedArray(size)
            : generateArray(size);
        currentBars = renderBars(currentArray);
        resetButtons();
        enableButtons(['run', 'step', 'reset']);
    }
});

// ─── Helper funksione ─────────────────────────────────────────────
function enableButtons(ids)  { ids.forEach(id => document.getElementById(`btn-${id}`).disabled = false); }
function setButtonState(id, disabled) { document.getElementById(`btn-${id}`).disabled = disabled; }
function resetButtons() {
    ['run', 'pause', 'step', 'reset'].forEach(id => {
        document.getElementById(`btn-${id}`).disabled = true;
    });
}

// ─── Eksporto runDSOperation për controls.js ─────────────────────
export { runDSOperation };

// ── KAPITULLI 1: Buton Copy për Kodin Java ──────────────────────────
const btnCopyCode = document.getElementById('btn-copy-code');
if (btnCopyCode) {
    btnCopyCode.addEventListener('click', async () => {
        const codeEl = document.getElementById('java-code-display');
        try {
            await navigator.clipboard.writeText(codeEl.textContent);
            btnCopyCode.classList.add('copied');
            setTimeout(() => btnCopyCode.classList.remove('copied'), 1200);
        } catch (err) {
            console.error('Kopjimi dështoi:', err);
        }
    });
}