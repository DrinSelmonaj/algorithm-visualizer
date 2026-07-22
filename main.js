// main.js — Pika e hyrjes së aplikacionit
// Importon të gjitha modulet dhe lidh UI me engine.

import { render as renderBars, markAllSorted, generateArray, generateSortedArray, resetSortRenderer, onResizeRerender } from './src/engine/sortRenderer.js';
import { initGraph, getGraph, addNode, addEdge } from './src/ui/graphBuilder.js';
import { cloneGraph } from './src/graph/model.js';

import { run, stepOnce, pause, resume, stop, getState } from './src/engine/scheduler.js';
import { applyStep, resetStats } from './src/engine/animator.js';

import { bindControls, showDSPanel, showGraphPanel, hideDSPanel } from './src/ui/controls.js'
import { showCode, highlightLine } from './src/ui/codePanel.js';
import { showComplexity } from './src/ui/complexity.js';
import { hideDistancePanel } from './src/ui/distancePanel.js';

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
import { bstAlgorithm, bstInsert, bstSearch, bstDelete, bstTraverse, init as initBST,
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
    bubble:    { gen: (arr) => bubbleSort(arr),    java: JAVA_BUBBLE,    category: 'sorting',   name: 'Bubble Sort',    statType: 'swap'  },
    insertion: { gen: (arr) => insertionSort(arr), java: JAVA_INSERTION, category: 'sorting',   name: 'Insertion Sort', statType: 'write' },
    selection: { gen: (arr) => selectionSort(arr), java: JAVA_SELECTION, category: 'sorting',   name: 'Selection Sort', statType: 'swap'  },
    merge:     { gen: (arr) => mergeSort(arr),     java: JAVA_MERGE,     category: 'sorting',   name: 'Merge Sort',     statType: 'write' },
    quick:     { gen: (arr) => quickSort(arr),     java: JAVA_QUICK,     category: 'sorting',   name: 'Quick Sort',     statType: 'swap'  },
    shell:     { gen: (arr) => shellSort(arr),     java: JAVA_SHELL,     category: 'sorting',   name: 'Shell Sort',     statType: 'write' },
    heap:      { gen: (arr) => heapSort(arr),      java: JAVA_HEAP,      category: 'sorting',   name: 'Heap Sort',      statType: 'swap'  },
    radix:     { gen: (arr) => radixSort(arr),     java: JAVA_RADIX,     category: 'sorting',   name: 'Radix Sort',     statType: 'write' },
    // Searching
    linear:    { gen: (arr, target) => linearSearch(arr, target), java: JAVA_LINEAR, category: 'searching', name: 'Linear Search' },
    binary:    { gen: (arr, target) => binarySearch(arr, target), java: JAVA_BINARY, category: 'searching', name: 'Binary Search' },

    // Trees
    bst:       { gen: () => bstAlgorithm(), java: JAVA_BST, category: 'bst', name: 'BST' },

   // Graphs
    dijkstra:  { gen: (g, src) => dijkstra(g, src), java: JAVA_DIJKSTRA, category: 'graph', name: 'Dijkstra', needsSourceNode: true },
    kruskal:   { gen: (g) => kruskal(g),  java: JAVA_KRUSKAL,  category: 'graph', name: 'Kruskal'  },

    // Data Structures
    stack:      { java: JAVA_STACK, category: 'datastructures', name: 'Stack'       },
    queue:      { java: JAVA_QUEUE, category: 'datastructures', name: 'Queue'       },
    linkedlist: { java: JAVA_LL,    category: 'datastructures', name: 'Linked List' },
    hashmap:    { java: JAVA_HM,    category: 'datastructures', name: 'HashMap'     },
};

// ─── Gjendja globale ──────────────────────────────────────────────
let currentAlgo    = null;   // çelësi i ALGORITHMS
let customArray    = null;   // array-i manual i përdoruesit — null = përdor gjenerim random
let currentBars    = [];     // referencat SVG të shufrave (sort/search)
let currentArray   = [];     // array aktual
let currentGen     = null;   // gjeneratori aktual
let speedValue     = 2;      // 1 | 2 | 3

// KRITIKE: sortRenderer.js rindërton vetë bar-at (svg.innerHTML = '') kur
// dritarja ndryshon madhësi gjatë një xhirimi aktiv, prodhon elementë DOM
// të rinj — pa këtë, currentBars mbetet duke treguar te elementët e vjetër
// të shkëputur, dhe applyStep() vazhdon "punën" në heshtje mbi hiç (shufrat
// mbeten të ngrira në pamje, ndërsa comparisons/swaps vazhdojnë të rriten,
// sepse ato jetojnë të pavarura nga DOM-i, në animator.js).
onResizeRerender((newBars) => { currentBars = newBars; });

/**
 * Parson tekstin e Custom Input në array numrash.
 * Kthen null nëse input-i është i pavlefshëm (bosh, pa numra të vlefshëm, jashtë 5–45 elementeve).
 * Përndryshe kthen { values, filteredCount } — filteredCount numëron sa tokena
 * u shkruan nga përdoruesi por u refuzuan (jo numër, ose jashtë 0–999), në mënyrë
 * që thirrësi të mund t'i njoftojë përdoruesit saktësisht sa u injoruan.
 * @param {string} str
 * @returns {{values: number[], filteredCount: number}|null}
 */
function parseCustomArray(str) {
    if (!str || !str.trim()) return null;
    const rawTokens = str.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const nums = rawTokens
        .map(s => Number(s))
        .filter(n => Number.isInteger(n) && n >= 0 && n <= 999);
    if (nums.length < 5 || nums.length > 45) return null;
    return { values: nums, filteredCount: rawTokens.length - nums.length };
}

/**
 * Kthen array-in që duhet vizualizuar — custom nëse është aktiv, përndryshe random.
 * Qendërzon logjikën që më parë ishte e përsëritur 3 herë në main.js.
 * @param {number} size
 * @param {string} cat - 'sorting' ose 'searching'
 * @returns {number[]}
 */
function getWorkingArray(size, cat) {
    if (customArray) {
        // Binary Search kërkon array të renditur — sorting e ruan siç e fusi përdoruesi
        return cat === 'searching'
            ? [...customArray].sort((a, b) => a - b)
            : [...customArray];
    }
    return cat === 'searching'
        ? generateSortedArray(size)
        : generateArray(size);
}

/**
 * Shfaq mesazh te #custom-input-feedback dhe e fshin vetë pas 3.5s.
 * Zëvendëson qasjen e mëparshme (fshirje reaktive te Run/Step/Reset) me një
 * mekanizëm të vetëm, qendror — më e thjeshtë sepse s'duhet më të mendojmë
 * ku tjetër mund të mbetet "ngjitur" mesazhi, thjesht zhduket vetë.
 * @param {string} message
 * @param {'success'|'error'} type
 */
let feedbackTimer = null;
function showCustomFeedback(message, type) {
    const feedback = document.getElementById('custom-input-feedback');
    if (!feedback) return;
    clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedback.className = `custom-input-feedback ${type}`;
    feedbackTimer = setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'custom-input-feedback';
    }, 3500);
}

// ─── Kur klikohet një buton algoritmi ────────────────────────────

// Aktivizon/çaktivizon TË GJITHA input/button brenda një kontejneri (selector
// CSS). Përdoret te selectAlgorithm() dhe gjendja fillestare (para zgjedhjes
// së algoritmit) — përndryshe input-et e BST/Custom Input/Elementet mbeten
// gjithmonë të klikueshme, edhe kur s'ka kuptim (asnjë algoritëm aktiv, ose
// kategori tjetër aktive).
function setGroupEnabled(selector, enabled) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.querySelectorAll('input, button').forEach(el => { el.disabled = !enabled; });
}

function selectAlgorithm(algoKey) {
    stop();
    hideDistancePanel();
    currentAlgo = algoKey;
    const algo = ALGORITHMS[algoKey];

    // Strukturat e të dhënave i nisin operacionet drejtpërdrejt nga paneli i
    // tyre; kontrollet globale Run/Pause/Step/Speed do të ishin të tepërta.
    document.querySelector('.controls-bar')?.classList.toggle(
        'controls-bar--datastructures',
        algo.category === 'datastructures'
    );
    document.querySelector('.controls-bar')?.classList.toggle(
        'controls-bar--bst',
        algoKey === 'bst'
    );

 // Emri dhe kompleksiteti
    document.getElementById('active-algo-name').textContent = algo.name;
    showComplexity(algoKey);
    showCode(algo.java);

    // Etiketa e statit "Ndërrime"/"Shkrime" ndryshon sipas mënyrës si punon algoritmi
    const swapsLabel = document.getElementById('stat-swaps-label');
   if (swapsLabel) {
        swapsLabel.textContent = algo.statType === 'write' ? 'Mbishkrime' : 'Ndërrime';
    }

    resetStats();
    resetButtons();

    // Inicializo varësisht nga kategoria
    const cat = algo.category;

    // Krahasime/Ndërrime/Hapi s'kanë kuptim algoritmik për Stack/Queue/
    // LinkedList/HashMap (s'janë operacione krahasimi apo renditjeje) —
    // fshihe krejt panelin në vend të shfaqjes së zerove pa kuptim.
    document.querySelector('.stats-bar')?.classList.toggle(
        'stats-bar--hidden',
        cat === 'datastructures'
    );

    if (cat === 'sorting' || cat === 'searching') {
        hideDSPanel();
        document.getElementById('bst-input-group').style.display = 'none';
        document.querySelector('.size-control').style.display = '';
        document.querySelector('.custom-input-group').style.display = '';
        setGroupEnabled('.size-control', true);
        setGroupEnabled('.custom-input-group', true);
        setGroupEnabled('#bst-input-group', false);
        const size = parseInt(document.getElementById('size-slider').value);
        currentArray = getWorkingArray(size, cat);
        currentBars = renderBars(currentArray);
        enableButtons(['run', 'step', 'reset']);

    } else if (cat === 'bst') {
        hideDSPanel();
        resetSortRenderer();
        document.getElementById('bst-input-group').style.display = 'flex';
        document.querySelector('.size-control').style.display = 'none';
        document.querySelector('.custom-input-group').style.display = 'none';
        setGroupEnabled('#bst-input-group', true);
        setGroupEnabled('.size-control', false);
        setGroupEnabled('.custom-input-group', false);
        initBST(); // pastron root+uidCount NË BST.JS, jo vetëm SVG-në (rerenderBST(null) i vjetër)
        enableButtons(['reset']);

    } else if (cat === 'graph') {
        hideDSPanel();
        resetSortRenderer();
        document.getElementById('bst-input-group').style.display = 'none';
        document.querySelector('.size-control').style.display = 'none';
        document.querySelector('.custom-input-group').style.display = 'none';
        setGroupEnabled('#bst-input-group', false);
        setGroupEnabled('.size-control', false);
        setGroupEnabled('.custom-input-group', false);
        initGraph();
        showGraphPanel((op, ...args) => runGraphOperation(op, ...args), !!algo.needsSourceNode);
        setGroupEnabled('#graph-panel', true);
        document.getElementById('btn-run').disabled = false;
        document.getElementById('btn-reset').disabled = false;

    } else if (cat === 'datastructures') {
        hideDSPanel();
        resetSortRenderer();
        showDSPanel(algoKey, (op, ...args) => runDSOperation(op, ...args));
        document.getElementById('bst-input-group').style.display = 'none';
        document.querySelector('.size-control').style.display = 'none';
        document.querySelector('.custom-input-group').style.display = 'none';
        setGroupEnabled('#bst-input-group', false);
        setGroupEnabled('.size-control', false);
        setGroupEnabled('.custom-input-group', false);
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
        const target = requestSearchTarget();
        if (target === null) return;
        currentGen = algo.gen([...currentArray], target);
    } else if (cat === 'graph') {
        const editableGraph = getGraph();
        if (!editableGraph) return;
        const graph = cloneGraph(editableGraph);
        let sourceId = 'A';
        if (algo.needsSourceNode) {
            const sourceInput = document.getElementById('graph-source-node');
            sourceId = (sourceInput?.value?.trim()) || 'A';
            const exists = graph.nodes.some(n => n.id === sourceId);
            if (!exists) {
                const validIds = graph.nodes.map(n => n.id).join(', ');
                alert(`Nyja "${sourceId}" s'ekziston në graf. Nyjet e vlefshme: ${validIds}`);
                return;
            }
        }
        currentGen = algo.gen(graph, sourceId);

    } else if (cat === 'datastructures') {
        return;
    }

    if (!currentGen) return;

    setButtonState('pause', false);
    setButtonState('run', true);
    setButtonState('step', true);
    if (cat === 'graph') setGroupEnabled('#graph-panel', false);

    run(
        currentGen,
        (step) => {
            applyStep(step, currentBars, cat);
            if (step.javaLine) highlightLine(step.javaLine);
        },
        () => {
            if (cat === 'sorting') markAllSorted(currentBars);
            if (cat === 'graph') setGroupEnabled('#graph-panel', true);
            setButtonState('run', false);
            setButtonState('pause', true);
            setButtonState('step', false);
        },
        speedValue,
        () => handleExecutionError(cat)
    );
}

// ─── Step (hap manual) ────────────────────────────────────────────
function stepAlgorithm() {
    if (!currentAlgo) return;
    const algo = ALGORITHMS[currentAlgo];
    const cat  = algo.category;

    if (!currentGen) {
        if (cat === 'sorting') {
            currentGen = algo.gen([...currentArray]);
        } else if (cat === 'searching') {
            const target = requestSearchTarget();
            if (target === null) return;
            currentGen = algo.gen([...currentArray], target);
        } else {
            return;
        }
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
// forceRegenerate=false (default, butoni "Rikthe"): ripërdor currentArray siç është.
// forceRegenerate=true ("Përdor"/"✕ Random"): rithirr getWorkingArray() sepse
// customArray sapo ndryshoi (u vendos ose u pastrua) — currentArray DUHET rifreskuar.
function resetAlgorithm(forceRegenerate = false) {
    stop();
    currentGen = null;
    resetStats();

    if (!currentAlgo) return;
    const algo = ALGORITHMS[currentAlgo];
    const cat  = algo.category;

    if (cat === 'sorting' || cat === 'searching') {
        // MOS rithirr getWorkingArray() këtu (përveç kur kërkohet eksplicit) —
        // do prodhonte array TË RI random. currentArray s'mutohet kurrë nga
        // xhirimi (gjeneratori merr [...currentArray], një kopje), ndaj tashmë
        // mban array-in origjinal të saktë. Rikthe = vetëm rivendos gjendjen
        // vizuale/animacionin, jo të dhënat.
        if (forceRegenerate) {
            const size = parseInt(document.getElementById('size-slider').value);
            currentArray = getWorkingArray(size, cat);
        }
        currentBars = renderBars(currentArray);
    } else if (cat === 'bst') {
        initBST(); // pastron root+uidCount NË BST.JS, jo vetëm SVG-në
        setGroupEnabled('#bst-input-group', true);
    } else if (cat === 'graph') {
        initGraph();
        hideDistancePanel();
        setGroupEnabled('#graph-panel', true);
    } else if (cat === 'datastructures') {
        initDataStructure(currentAlgo);
        setGroupEnabled('.ds-ops', true);   // Reset mund të ndërpresë një operacion në
                                             // ekzekutim (onFinish() s'thirret kur stopRequest=true)
    }

    resetButtons();
    if (cat === 'sorting' || cat === 'searching') {
        enableButtons(['run', 'step', 'reset']);
    } else if (cat === 'graph') {
        // Grafi s'ka "Step" — xhirohet vetëm plotësisht nga btn-run
        document.getElementById('btn-run').disabled = false;
        document.getElementById('btn-reset').disabled = false;
    } else {
        // bst | datastructures — xhirohen nga butonat e veçantë të panelit
        // (btn-bst-run/search, ose window.__dsOp), jo nga Run/Step globalë
        enableButtons(['reset']);
    }
}

/**
 * Parson një hyrje si numër i plotë i vlefshëm, ose null nëse është bosh/i pavlefshëm.
 * Number()+Number.isFinite() në vend të parseInt() — parseInt("12abc") kthen 12
 * (heshtazi e pranon "gabimin"), Number("12abc") kthen NaN (e refuzon saktë).
 * @param {string} str
 * @returns {number|null}
 */
function parseValidInt(str) {
    if (str == null || String(str).trim() === '') return null;
    const n = Number(str);
    return Number.isInteger(n) ? n : null;
}

function requestSearchTarget() {
    const raw = prompt('Shkruaj numrin e plotë për të kërkuar:');
    if (raw === null) return null;
    const target = parseValidInt(raw);
    if (target === null) {
        alert('Shkruaj një numër të plotë të vlefshëm.');
        return null;
    }
    return target;
}

function handleExecutionError(category) {
    console.error('Ekzekutimi dështoi.');
    const status = document.getElementById('algo-status');
    if (status) status.textContent = 'Ndodhi një gabim. Riprovo ose përdor Rikthe.';
    if (category === 'graph') setGroupEnabled('#graph-panel', true);
    setButtonState('run', false);
    setButtonState('pause', true);
    setButtonState('step', false);
    setButtonState('reset', false);
}

// ─── Lidhja me Data Structure operations (nga UI) ─────────────────
function runDSOperation(operation, ...args) {
    if (!currentAlgo) return;
    const cat = ALGORITHMS[currentAlgo].category;
    if (cat !== 'datastructures') return;

    let gen;
    if (currentAlgo === 'stack') {
        if (operation === 'push') {
            const val = parseValidInt(args[0]);
            if (val === null) { alert('Shkruaj një numër të plotë të vlefshëm për Push.'); return; }
            gen = push(val);
        }
        if (operation === 'pop')     gen = pop();
        if (operation === 'peek')    gen = peekStack();
        if (operation === 'isEmpty') gen = isEmpty();

    } else if (currentAlgo === 'queue') {
        if (operation === 'enqueue') {
            const val = parseValidInt(args[0]);
            if (val === null) { alert('Shkruaj një numër të plotë të vlefshëm për Enqueue.'); return; }
            gen = enqueue(val);
        }
        if (operation === 'dequeue') gen = dequeue();
        if (operation === 'peek')    gen = peekQueue();

    } else if (currentAlgo === 'linkedlist') {
        if (['insertHead', 'insertTail', 'delete', 'search'].includes(operation)) {
            const val = parseValidInt(args[0]);
            if (val === null) { alert('Shkruaj një numër të plotë të vlefshëm.'); return; }
            if (operation === 'insertHead') gen = insertAtHead(val);
            if (operation === 'insertTail') gen = insertAtTail(val);
            if (operation === 'delete') {
                const rawNext = String(args[1] ?? '').trim();
                const nextIsNull = args[2] === true;
                if (nextIsNull && rawNext !== '') {
                    alert('Përdor ose "Pas saj" ose "Next = null", jo të dyja.');
                    return;
                }
                const nextValue = rawNext === '' ? null : parseValidInt(rawNext);
                if (rawNext !== '' && nextValue === null) {
                    alert('"Pas saj" duhet të jetë një numër i plotë i vlefshëm.');
                    return;
                }
                gen = deleteLL(val, nextValue, nextIsNull);
            }
            if (operation === 'search')     gen = searchLL(val);
        } else if (operation === 'insertAfter') {
            const val   = parseValidInt(args[0]);
            const after = parseValidInt(args[1]);
            if (val === null || after === null) { alert('Të dyja fushat duhen numra të plotë të vlefshëm.'); return; }
            gen = insertAfterValue(val, after);
        }

    } else if (currentAlgo === 'hashmap') {
        const key = String(args[0] ?? '').trim();
        if (operation === 'put') {
            const value = parseValidInt(args[1]);
            if (!key || value === null) { alert('Kërkohen Key dhe një vlerë e plotë e vlefshme.'); return; }
            gen = put(key, value);
        }
        if (operation === 'get') {
            if (!key) { alert('Shkruaj një Key.'); return; }
            gen = get(key);
        }
        if (operation === 'remove') {
            if (!key) { alert('Shkruaj një Key.'); return; }
            gen = remove(key);
        }
    }

    if (!gen) return;

    setGroupEnabled('.ds-ops', false);   // mbyll panelin — parandalon operacion të dytë
                                          // të nisë mbi gjeneratorin ende aktiv

    run(
        gen,
        (step) => {
            applyStep(step, [], 'datastructures');
            if (step.javaLine) highlightLine(step.javaLine);
        },
        () => { setGroupEnabled('.ds-ops', true); },   // rihap kur mbaron natyrshëm
        speedValue,
        () => handleExecutionError('datastructures')
    );
}

// ─── Lidhja me Graph operations (nga UI) ──────────────────────────
// Thirret nga controls.js kur përdoruesi shton nyje/skaj te grafi
function runGraphOperation(operation, ...args) {
    if (getState().isRunning) return;
    const result = operation === 'addNode'
        ? addNode(args[0].trim())
        : operation === 'addEdge'
            ? addEdge(args[0].trim(), args[1].trim(), args[2])
            : null;
    if (result && !result.ok) alert(result.error);
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
    const { isPaused } = getState();
    if (isPaused) {
        resume();
        setButtonState('run', true);
        setButtonState('pause', false);
        return;
    }
    runAlgorithm();
});

document.getElementById('btn-pause').addEventListener('click', () => {
    pause();
    // btn-run u çaktivizua kur nisi xhirimi (runAlgorithm) — duhet riaktivizuar
    // që "Play" të mund të thirret sërish për resume(). Më parë mbetej i
    // çaktivizuar përgjithmonë pas pause, e vetmja rrugë ishte "Rikthe".
    setButtonState('run', false);
    setButtonState('pause', true);
});
document.getElementById('btn-reset').addEventListener('click', () => resetAlgorithm());
document.getElementById('btn-step').addEventListener('click', stepAlgorithm);

// ─── BST Operations ───────────────────────────────────────────────
function runBSTOperation(generator) {
    if (!generator) return;
    currentGen = generator;
    resetStats();
    document.querySelectorAll('.bst-node.traversed')
        .forEach(node => node.classList.remove('traversed'));
    setGroupEnabled('#bst-input-group', false);
    setButtonState('pause', false);
    setButtonState('run', true);
    setButtonState('step', true);

    run(
        currentGen,
        (step) => { applyStep(step, [], 'bst'); if (step.javaLine) highlightLine(step.javaLine); },
        () => {
            currentGen = null;
            setGroupEnabled('#bst-input-group', true);
            setButtonState('run', false);
            setButtonState('pause', true);
            setButtonState('step', true);
        },
        speedValue,
        () => {
            currentGen = null;
            setGroupEnabled('#bst-input-group', true);
            handleExecutionError('bst');
        }
    );
}

function getBSTOperationValue() {
    const value = parseValidInt(document.getElementById('bst-operation-input').value);
    if (value === null) {
        alert('Shkruaj një numër të plotë të vlefshëm.');
        return null;
    }
    return value;
}

document.getElementById('btn-bst-run').addEventListener('click', () => {
    const input = document.getElementById('bst-values-input').value.trim() || '5,3,7,1,4';
    const vals = input.split(',').map(s => parseValidInt(s.trim()));

    if (vals.some(n => n === null || n <= 0)) {
        alert('Vlerat e BST duhet të jenë numra të plotë pozitivë, të ndarë me presje.');
        return;
    }
    runBSTOperation(bstAlgorithm(vals));
});

document.getElementById('btn-bst-search').addEventListener('click', () => {
    const target = getBSTOperationValue();
    if (target !== null) runBSTOperation(bstSearch(target));
});

document.getElementById('btn-bst-insert').addEventListener('click', () => {
    const value = getBSTOperationValue();
    if (value !== null) runBSTOperation(bstInsert(value));
});

document.getElementById('btn-bst-delete').addEventListener('click', () => {
    const value = getBSTOperationValue();
    if (value !== null) runBSTOperation(bstDelete(value));
});

['inorder', 'preorder', 'postorder'].forEach(mode => {
    document.getElementById(`btn-bst-${mode}`).addEventListener('click', () => {
        runBSTOperation(bstTraverse(mode));
    });
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
        currentArray = getWorkingArray(size, cat);
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

// ── KAPITULLI 2: Custom Input — vlera manuale për sorting/searching ──
document.getElementById('btn-custom-apply').addEventListener('click', () => {
    const raw = document.getElementById('custom-array-input').value;
    const parsed = parseCustomArray(raw);

    if (!parsed) {
        showCustomFeedback('Duhen 5–45 numra (0–999), të ndarë me presje.', 'error');
        return;
    }

    customArray = parsed.values;
    showCustomFeedback(
        parsed.filteredCount > 0
            ? `${parsed.values.length} elemente u ngarkuan (${parsed.filteredCount} u injoruan — NaN ose jashtë 0–999).`
            : `${parsed.values.length} elemente u ngarkuan.`,
        'success'
    );

    document.getElementById('size-slider').disabled = true;
    document.getElementById('size-value').textContent = parsed.values.length;

    resetAlgorithm(true);
});

document.getElementById('btn-custom-clear').addEventListener('click', () => {
    clearTimeout(feedbackTimer);
    customArray = null;
    document.getElementById('custom-array-input').value = '';
    document.getElementById('custom-input-feedback').textContent = '';
    document.getElementById('custom-input-feedback').className = 'custom-input-feedback';

    const sizeSlider = document.getElementById('size-slider');
    const randomSize = Math.floor(Math.random() * 41) + 5; // 5–45 elemente
    sizeSlider.disabled = false;
    sizeSlider.value = randomSize;
    document.getElementById('size-value').textContent = randomSize;

    resetAlgorithm(true);
});

// ── KAPITULLI 2: Enter → kliko butonin primary përkatës ──────────────
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (e.target.tagName !== 'INPUT') return;

    // BST — 2 input-e specifike, secili me buton të vetin
    if (e.target.id === 'bst-values-input') {
        document.getElementById('btn-bst-run')?.click();
        return;
    }
    if (e.target.id === 'bst-operation-input') {
        document.getElementById('btn-bst-search')?.click();
        return;
    }
    if (e.target.id === 'custom-array-input') {
        document.getElementById('btn-custom-apply')?.click();
        return;
    }

    // DS panels (Stack/Queue/LinkedList/HashMap) + Graph panel —
    // kliko btn-primary e parë brenda të njëjtit rresht
    const row = e.target.closest('.ds-input-row');
    if (row) {
        row.querySelector('.btn-primary')?.click();
    }
});

// ─── Gjendja fillestare (asnjë algoritëm ende i zgjedhur) ─────────
// Ekrani "Zgjidh një algoritëm nga lista" duhet të mbetet thjesht orientues —
// asnjë input/buton s'ka kuptim funksional pa currentAlgo. selectAlgorithm()
// i aktivizon këto vetëm pasi përdoruesi klikon një algoritëm konkret.
setGroupEnabled('.custom-input-group', false);
setGroupEnabled('.size-control', false);
setGroupEnabled('#bst-input-group', false);
