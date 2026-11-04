const BASE = {
    bubble: ['Bubble Sort', 'Krahason fqinjët dhe i ndërron derisa elementi më i madh të lëvizë në fund.', 'I mirë për mësim dhe lista shumë të vogla.', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', ['Stable', 'In-place']],
    insertion: ['Insertion Sort', 'Ndërton një pjesë të renditur duke futur çdo element në pozicionin e duhur.', 'Shkëlqen me të dhëna të vogla ose pothuajse të renditura.', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', ['Stable', 'In-place', 'Adaptive']],
    selection: ['Selection Sort', 'Gjen minimumin e pjesës së parenditur dhe e vendos në pozicionin tjetër.', 'I dobishëm kur shkrimet në memorie duhet të minimizohen.', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', ['In-place']],
    merge: ['Merge Sort', 'Ndan vargun, rendit gjysmat dhe i bashkon në rend.', 'Zgjedhje e sigurt për të dhëna të mëdha dhe renditje stabile.', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', ['Stable', 'Divide & conquer']],
    quick: ['Quick Sort', 'Zgjedh një pivot dhe ndan elementet më të vegjël e më të mëdhenj rreth tij.', 'Shumë i shpejtë në praktikë për vargje në memorie.', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)', ['In-place', 'Divide & conquer']],
    shell: ['Shell Sort', 'Përmirëson Insertion Sort duke krahasuar fillimisht elemente me largësi gap.', 'I përshtatshëm për vargje mesatare pa memorie shtesë.', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(1)', ['In-place', 'Adaptive']],
    heap: ['Heap Sort', 'Ndërton max-heap dhe nxjerr maksimumin një nga një.', 'Kur kërkohet O(n log n) worst-case me O(1) hapësirë.', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', ['In-place']],
    radix: ['Radix Sort', 'Rendit numrat sipas shifrave, nga më pak e rëndësishmja te më e rëndësishmja.', 'Për numra të plotë me gjatësi të kufizuar.', 'O(nk)', 'O(nk)', 'O(nk)', 'O(n+k)', ['Stable', 'Non-comparative']],
    linear: ['Linear Search', 'Kontrollon elementet një nga një nga fillimi deri te gjetja e targetit.', 'Kur të dhënat janë të vogla ose të parenditura.', 'O(1)', 'O(n)', 'O(n)', 'O(1)', ['Punon pa renditje']],
    binary: ['Binary Search', 'Përgjysmon zonën e kërkimit pas çdo krahasimi.', 'Për vargje të renditura dhe kërkime të shpeshta.', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)', ['Kërkon varg të renditur']],
    bst: ['Binary Search Tree', 'Mban vlera më të vogla majtas dhe më të mëdha djathtas.', 'Për kërkim, futje dhe fshirje dinamike në rend.', 'O(1)', 'O(log n)', 'O(n)', 'O(n)', ['Strukturë hierarkike']],
    dijkstra: ['Dijkstra', 'Zgjeron nyjën me distancën më të vogël dhe relakson lidhjet e saj.', 'Për rrugën më të shkurtër me pesha jo-negative.', 'O(V²)', 'O(V²)', 'O(V²)', 'O(V)', ['Greedy', 'Pa pesha negative']],
    kruskal: ['Kruskal', 'Rendit lidhjet sipas peshës dhe i shton pa krijuar cikël.', 'Për minimum spanning tree në grafe të lidhura.', 'O(E log E)', 'O(E log E)', 'O(E log E)', 'O(V)', ['Greedy', 'Union-Find']],
    stack: ['Stack', 'Strukturë LIFO: elementi i fundit i futur del i pari.', 'Call stack, undo, parsing dhe DFS.', 'O(1)', 'O(1)', 'O(1)', 'O(n)', ['LIFO']],
    queue: ['Queue', 'Strukturë FIFO: elementi i parë i futur del i pari.', 'Scheduling, buffering dhe BFS.', 'O(1)', 'O(1)', 'O(1)', 'O(n)', ['FIFO']],
    linkedlist: ['Linked List', 'Nyjet lidhen me referenca në vend të memories së vazhdueshme.', 'Kur futjet dhe fshirjet janë më të shpeshta se access-i.', 'O(1)', 'O(n)', 'O(n)', 'O(n)', ['Memorie dinamike']],
    hashmap: ['HashMap', 'Hash function e drejton çdo key te një bucket.', 'Lookup i shpejtë key-value, cache dhe indeksim.', 'O(1)', 'O(1)', 'O(n)', 'O(n)', ['Key-value', 'Collision handling']],
};

const OPERATIONS = {
    bst: [['Kërkim', 'O(log n)', 'O(n)'], ['Futje', 'O(log n)', 'O(n)'], ['Fshirje', 'O(log n)', 'O(n)']],
    stack: [['Push', 'O(1)', 'O(1)'], ['Pop', 'O(1)', 'O(1)'], ['Peek', 'O(1)', 'O(1)']],
    queue: [['Enqueue', 'O(1)', 'O(1)'], ['Dequeue', 'O(1)', 'O(1)'], ['Peek', 'O(1)', 'O(1)']],
    linkedlist: [['Access', 'O(n)', 'O(n)'], ['Futje në head', 'O(1)', 'O(1)'], ['Kërkim', 'O(n)', 'O(n)']],
    hashmap: [['Get', 'O(1)', 'O(n)'], ['Put', 'O(1)', 'O(n)'], ['Remove', 'O(1)', 'O(n)']],
};

function getLearningData(key) {
    const row = BASE[key];
    if (!row) return null;
    return {
        title: row[0], summary: row[1], use: row[2],
        best: row[3], average: row[4], worst: row[5], space: row[6],
        traits: row[7], operations: OPERATIONS[key] || null,
        quiz: {
            question: `Cili është kompleksiteti mesatar i ${row[0]}?`,
            options: [row[4], row[3], row[6]].filter((v, i, a) => a.indexOf(v) === i),
            answer: row[4],
        },
    };
}

export { getLearningData, BASE };
