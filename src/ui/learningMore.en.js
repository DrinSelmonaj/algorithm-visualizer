// src/ui/learningMore.en.js — English counterpart of MORE, REAL and TECH from learningMore.js.
// Same keys; word-count limits are the same (checked by a unit test).

const MORE_EN = {
    bubble: [
        'Bubble Sort makes several passes over the list. In each pass it compares two adjacent elements and swaps them if they are in the wrong order. After the first pass the largest element ends up at the end, after the second pass the second largest, and so on, so every pass needs one comparison fewer.',
        'In the optimized version, if a pass makes no swap the list is already sorted and the algorithm stops; this makes it O(n) on a list that is already sorted. In the average and worst case it makes about n²/2 comparisons, so it is slow for large lists. It is stable, because equal elements keep their order. It is mostly used for teaching.',
    ],
    insertion: [
        'Insertion Sort works like sorting playing cards in your hand. The left part of the list is always sorted. It takes the next element, compares it with the ones on its left and shifts the larger ones to the right until it finds the right spot, and inserts it there.',
        'When the list is nearly sorted, each element moves only a little or not at all, so the cost approaches O(n). In the worst case, e.g. a reversed list, each element travels through the whole sorted part and the cost is O(n²). It is stable and works in place, with no extra memory. That is why it is used for small lists, or as the last step inside faster algorithms.',
    ],
    selection: [
        'Selection Sort splits the list into two parts: the sorted one at the start and the unsorted one after it. In every step it looks for the smallest element in the unsorted part and swaps it with the first element of that part. The sorted part grows by one element each time.',
        'Finding the minimum always requires looking at all remaining elements, so the number of comparisons is about n²/2 in every case, even when the list is sorted. But it makes very few swaps, at most n−1. That makes it useful when writing to memory is expensive. It is not stable, because a swap can move an element past another one with an equal value.',
    ],
    merge: [
        'Merge Sort uses the "divide and conquer" strategy. It splits the list into two halves, sorts each half the same way, and then merges the two sorted halves. The splitting continues until only one element is left, which is trivially sorted.',
        'Merging compares the first elements of each half and takes the smaller one, building the new list step by step. The list is split into about log n levels and every level needs O(n) work, so the time is O(n log n) in every case, even the worst. The price is O(n) extra memory for the merge. It is stable, so it is a good choice for large data and for sorting by several keys.',
    ],
    quick: [
        'Quick Sort picks an element as the pivot and rearranges the list: smaller elements go before the pivot, larger ones after it. After that the pivot is in its final position. Then the same process is repeated on the left and right parts.',
        'If the pivot splits the list roughly in the middle, there are about log n levels and the time is O(n log n). If the pivot is always the smallest or largest element, e.g. a sorted list with the first element as pivot, the splits are very unbalanced and the time becomes O(n²). It works in place and is very fast in practice because it uses fast memory well. It is not stable. Choosing the pivot well (middle, random) reduces the risk of the worst case.',
    ],
    shell: [
        'Shell Sort is an improvement of Insertion Sort. Insertion Sort is slow because it moves elements only one position at a time. Shell Sort starts by comparing elements that are far apart, called the gap, and sorts them, then reduces the gap until it becomes 1.',
        'With a gap of 1 the algorithm is ordinary Insertion Sort, but by then the list is almost sorted, so it runs fast. The speed depends on the gap sequence: with the classic sequence n/2, n/4, … the worst case is O(n²), while better sequences give about O(n log² n). It works in place with no extra memory but is not stable. It is a simple compromise for medium-sized lists.',
    ],
    heap: [
        'Heap Sort uses a structure called a max-heap: a binary tree in which every parent is larger than its children, stored inside the array itself. First it builds the heap from the data. Then it repeats: swap the root, which is the largest, with the last element, add it to the sorted part, and repair the heap for the remaining elements.',
        'Repairing the heap costs O(log n) and is done for every element, so the total time is O(n log n) in every case, even the worst. It works in place with O(1) extra memory, which Merge Sort does not. It is not stable and in practice it is usually slower than Quick Sort, because it accesses memory in scattered positions.',
    ],
    radix: [
        'Radix Sort does not compare elements with each other. It sorts numbers by digits, starting with the least significant digit (the ones), then the tens, the hundreds, and so on. For each digit it places the numbers into buckets from 0 to 9 and reads them back in bucket order.',
        'Because every pass keeps the order from the previous pass (stability), the list is sorted after the last pass. If the numbers have at most k digits, the time is O(n·k) and the extra memory O(n+k). When k is small this can be faster than O(n log n). But it only works for integers or data that can be turned into digits, and it needs care with negative numbers.',
    ],
    linear: [
        'Linear Search is the simplest search. It starts at the first element and compares them one by one with the value you are looking for. When it finds a match it returns the position; if it reaches the end without finding one, it reports that the value does not exist.',
        'It does not require the list to be sorted, so it works with any data. In the best case the value is the first one and a single comparison is enough, O(1). In the average and worst case many or all elements are checked, O(n). For small lists or rare searches it is a good choice because there is no preparation cost. For large sorted lists, Binary Search is much faster.',
    ],
    binary: [
        'Binary Search looks for a value in a sorted list by halving the search range. It compares the value with the middle element. If they are equal, it has found it. If the value is smaller, it continues only in the left half; if it is larger, only in the right half.',
        'Every comparison removes half of the remaining elements, so for a million elements about 20 comparisons are enough. This gives O(log n) time and O(1) memory. The key condition is that the list must be sorted; on an unsorted list the result is wrong. A tip for the code: low + (high − low) / 2 avoids integer overflow when computing the middle.',
    ],
    bst: [
        'A binary search tree (BST) stores values in nodes, with one rule: every value in the left subtree is smaller than the node, every value in the right subtree is larger. To search or insert a value, you start at the root and go left or right according to the comparison until you find the place.',
        'Deletion has three cases: a node with no children is removed directly; with one child, the child takes its place; with two children, it is replaced by its in-order successor (the smallest node in the right subtree). If the tree is balanced, search, insertion and deletion are O(log n). If sorted values are inserted, the tree becomes like a list and the cost goes to O(n). An in-order traversal gives the values sorted.',
    ],
    dijkstra: [
        'Dijkstra finds the shortest path from a start node to all other nodes in a graph with non-negative weights. It starts with distance 0 for the start node and infinity for the others. In every step it picks the unvisited node with the smallest distance and marks it as visited.',
        'Then it checks each of its neighbors: if the path through this node is shorter than the known distance, it updates the distance and remembers the predecessor. This is called relaxation. With a plain array for the distances the time is O(V²); with a priority queue it becomes O((V+E) log V). It is a greedy algorithm and works correctly only when there are no negative weights. The final path is rebuilt by following the predecessors backwards.',
    ],
    kruskal: [
        'Kruskal builds the minimum spanning tree (MST): a subset of edges that connects all nodes of the graph with the smallest possible total weight and no cycle. It starts by sorting all edges by weight, from the smallest.',
        'Then it examines them one by one. If an edge joins two nodes that are not yet connected, it accepts it; if it would create a cycle, it rejects it. To detect this quickly it uses the Union-Find structure, which keeps track of which nodes belong to the same component. The time is O(E log E), mostly for sorting. The algorithm stops when the tree has V−1 edges. It is used, for example, to plan networks with minimum cost.',
    ],
    stack: [
        'A stack is a LIFO structure: "last in, first out". Think of a pile of plates: you add and remove only from the top. The main operations are push (add on top), pop (remove and return the top), peek (look at the top without removing it) and isEmpty.',
        'All of them cost O(1), because they only touch the top. Be careful with pop or peek on an empty stack: this is the common "stack underflow" error. It is used for the call stack of programs, for the Undo button, for checking balanced parentheses, for evaluating expressions and for depth-first search (DFS). It can be built with an array or a linked list.',
    ],
    queue: [
        'A queue is a FIFO structure: "first in, first out", like a line at a checkout. A new element is added at the end with enqueue, and the element at the front is removed with dequeue. Peek shows the first element without removing it.',
        'With a good implementation, all three operations cost O(1). If you build it with an array and remove from the front, every dequeue shifts all the elements and becomes O(n); that is why two pointers (front and rear) or a linked list are used. A queue is used for task scheduling in the operating system, for network buffers, for printing and for breadth-first search (BFS) in graphs.',
    ],
    linkedlist: [
        'A linked list stores elements in separate nodes, where each node holds a value and a reference to the next node. It does not need contiguous memory like an array. The first node is called the head, and the last one points to null.',
        'Inserting at the front only requires changing two references, so it is O(1). Searching, or inserting in the middle, requires walking from the head to the position, so it is O(n); you cannot jump straight to the i-th position as with an array. When deleting, you must keep the previous node so the link is not lost. It is used when insertions and deletions are frequent and the number of elements changes a lot.',
    ],
    hashmap: [
        'A HashMap stores key–value pairs and finds them very fast. A hash function turns the key into a number, and that number (with the remainder after dividing by the number of buckets) tells which bucket the pair is stored in. This way get, put and remove do not search through all the data.',
        'Two different keys can fall into the same bucket, which is called a collision. Here every bucket holds a chain of elements; searching in a bucket walks through the chain. With a good hash function and short chains, the average time is O(1). If many keys collide in one bucket, it drops to O(n). It is used for caches, counting frequencies and indexes.',
    ],
};

const REAL_EN = {
    bubble: [
        'It is mostly used in teaching, to understand comparing and swapping; in production it is replaced by faster algorithms.',
        'It makes sense in very small systems where the code must be minimal and the list has only a few elements.',
        'It quickly detects whether a list is already sorted: one pass without a single swap proves it.',
    ],
    insertion: [
        'Standard libraries (e.g. Timsort in Python and Java) use it for the small pieces of the list before merging them.',
        'Good when data arrives one by one and the list must always stay sorted, like a live leaderboard.',
        'Just like sorting playing cards in your hand during a game: put each new card in its place.',
    ],
    selection: [
        'When writing is expensive, e.g. in flash memory with a limited number of write cycles, because it makes very few swaps.',
        'To pick only the k smallest or largest elements when k is very small, e.g. the 3 cheapest products.',
        'In teaching, to show the idea of splitting a list into a sorted and an unsorted part.',
    ],
    merge: [
        'Sorting very large files that do not fit in RAM: databases sort chunks and merge them (external sorting).',
        'Timsort, the sorting algorithm in Python and in Java for objects, is based on merging sorted runs.',
        'Stable sorting of tables by several columns, e.g. first by city and then by name, without breaking the first order.',
    ],
    quick: [
        'The core of many sorts in C and C++ (introsort in std::sort) is Quick Sort with a safeguard against the worst case.',
        'Sorting in-memory lists in applications, such as products, contacts or search results, where average speed matters.',
        'The Quickselect variant finds the median or the k-th element without sorting the whole list, useful in statistics.',
    ],
    shell: [
        'Some small C libraries, e.g. uClibc, have used it in qsort because it is short and needs no recursion.',
        'In embedded systems with little memory, where a sort faster than Insertion Sort is needed with no extra memory.',
        'As a first step to bring the data nearly into order before a final pass of Insertion Sort.',
    ],
    heap: [
        'The Linux kernel uses it in its sort() function, because it has an O(n log n) guarantee and needs no extra memory.',
        'Introsort switches to Heap Sort when Quick Sort starts to degenerate, to keep the time under control.',
        'The heap itself is a priority queue: task schedulers, Dijkstra and event simulations use it.',
    ],
    radix: [
        'Sorting fixed-length numbers: postal codes, phone numbers, IDs or IP addresses converted into numbers.',
        'Sorting huge numbers of integers on GPUs and in big-data processing, where speed is a priority.',
        'Sorting dates and times (year, month, day) as digits, starting from the least significant part.',
    ],
    linear: [
        'Looking up a contact or name in a short list, e.g. Array.indexOf in JavaScript or "in" in Python.',
        'Reading a log file line by line to find an error, as grep does.',
        'When the data is not sorted and searched only once, this costs less than sorting it first.',
    ],
    binary: [
        'Looking up a word in a dictionary or a phone book: open in the middle and decide whether to continue left or right.',
        'git bisect finds the commit that broke the code by halving the history, often in just a few steps.',
        'Database indexes and functions such as Collections.binarySearch (Java) or bisect (Python).',
    ],
    bst: [
        'TreeMap and TreeSet in Java, and std::map in C++, are self-balancing search trees that keep keys sorted.',
        'Database indexes use similar trees (B-trees) to find rows without reading the whole table.',
        'Range queries, e.g. "all orders between two dates", because the values are kept in order.',
    ],
    dijkstra: [
        'GPS navigation and maps: the shortest or fastest route between two places (with variants like A*).',
        'Routing in computer networks: the OSPF protocol uses it to choose the best path for packets.',
        'Games and robots that find the cheapest route across a map where each step has a different cost.',
    ],
    kruskal: [
        'Planning low-cost networks: fiber cables, pipelines or a power grid connecting cities.',
        'Clustering in machine learning: the minimum spanning tree helps group similar points.',
        'Approximating hard problems, such as the traveling salesman problem, when a perfect solution is not needed.',
    ],
    stack: [
        'The Undo and Redo buttons in editors: every action is pushed onto a stack and popped in reverse order.',
        'The browser "Back" button: visited pages are kept on a stack, and going back pops the last one.',
        'The program call stack, and checking balanced parentheses in compilers and code editors.',
    ],
    queue: [
        'The print queue: documents print in the order they were sent; the first one sent is the first one printed.',
        'Messaging and request systems (such as RabbitMQ or Kafka) process tasks in order of arrival.',
        'Breadth-first search (BFS) in graphs, e.g. finding friends of friends in a social network.',
    ],
    linkedlist: [
        'Music playlists with "Next" and "Previous", where every song points to the next one.',
        'Memory management in operating systems, where free blocks are linked as a list.',
        'The base of other structures: stacks, queues and the collision chains in a HashMap are often built with linked lists.',
    ],
    hashmap: [
        'Caches like Redis and memcached store key–value pairs to find them instantly without recomputing.',
        'JSON objects, Python dictionaries and JavaScript Maps are hash tables under the hood.',
        'Counting word frequencies in a text, or finding duplicates in a list, in a single pass.',
    ],
};

const TECH_EN = {
    bubble: 'Technically, Bubble Sort makes sense when the list is very small, the code must be minimal and no extra memory is allowed, or when you need to quickly detect whether the data is already sorted (a pass without swaps). It is stable and in-place. For large lists its O(n²) cost makes it unsuitable, so in production it is replaced by Merge, Quick or Timsort; its main value is educational.',
    insertion: 'Technically, Insertion Sort is the best choice for small lists (roughly 10–50 elements) and for nearly sorted data, where the cost approaches O(n). Hybrid algorithms such as Timsort and introsort use it for the small pieces. It is online: it can sort data as it arrives, without waiting for the full list. It is stable and in-place, with small constants, so it often beats O(n log n) algorithms on short lists.',
    selection: 'Selection Sort is used when the number of memory writes matters more than the number of comparisons: it makes at most n−1 swaps, versus O(n²) for Bubble Sort. This makes sense in flash or EEPROM memory with limited write cycles. It is also useful for extracting only the k smallest elements without sorting everything. The cost is O(n²) comparisons in every case and it is not stable.',
    merge: 'Merge Sort is used when guaranteed O(n log n) time and stability are required: sorting by several criteria, or data that does not fit in RAM (external sorting: sort chunks, then merge them). It suits linked lists, where merging needs no extra memory, and parallelization, since the halves are sorted independently. For arrays it needs O(n) extra memory.',
    quick: 'Quick Sort is the usual choice for in-memory sorting, because it has small constants and uses the CPU cache well. Standard libraries combine it with other algorithms: introsort switches to Heap Sort when the recursion depth grows too much. It needs care with the pivot: a random pivot or "median of three" avoids the O(n²) case. It works in place but is not stable.',
    shell: 'Shell Sort is used when you need a sort faster than O(n²) but simple, without recursion and without extra memory: embedded systems and small C libraries. Performance depends on the gap sequence, so choosing it is the main technical decision. It is not stable and its exact time analysis is hard, which is why Quick or Heap Sort replace it when there is room for them.',
    heap: 'Heap Sort is used when an O(n log n) guarantee in every case with O(1) extra memory is needed, e.g. in kernels and real-time systems where the worst case matters. The heap structure is also used beyond sorting: priority queues, finding the k largest elements, task scheduling. It is not stable and its scattered memory access usually makes it slower than Quick Sort.',
    radix: 'Radix Sort is used when keys are integers or strings of bounded length and n is very large: O(n·k) time can beat O(n log n). It needs a stable sort for every digit (usually Counting Sort), O(n + b) extra memory and care with negative numbers and with the base b. It does not suit keys that are not easily turned into digits.',
    linear: 'Linear Search is used when the data is unsorted and the cost of sorting or building an index is not worth it: short lists, rare searches, or sources that can only be read sequentially, such as files and streams. It is O(n), but has a low cost per step and works with any structure that can be traversed, even a linked list.',
    binary: 'Binary Search is used when the data is sorted and searched often: a search is O(log n), after sorting once. It also applies as "search on the answer", e.g. finding the smallest value that satisfies a monotonic condition. Common mistakes are overflow in (low+high)/2, the low/high bounds and the loop condition. It works well with arrays, not with linked lists.',
    bst: 'A BST is used to keep a dynamic sorted set with search, insertion and deletion in O(log n) and in-order traversal. Plain trees can degenerate to O(n), so in practice self-balancing variants (AVL, red-black) are used, as in TreeMap or std::map. It also supports range queries and finding the successor and predecessor.',
    dijkstra: 'Dijkstra is used for the shortest path from one source when weights are non-negative: network routing, maps, planning. With a priority queue (heap) it costs O((V+E) log V), with an array O(V²), which is better for dense graphs. It fails with negative weights (Bellman-Ford is used there). For a single target, A* speeds it up by adding a heuristic.',
    kruskal: 'Kruskal is used to build the minimum spanning tree: edges with the minimum total cost that connect all nodes without a cycle. Technically it needs sorting the edges (O(E log E)) and Union-Find to detect cycles. It suits sparse graphs; for dense graphs, Prim\'s algorithm is often better. On a disconnected graph it produces a minimum spanning forest.',
    stack: 'A stack is used when you need to go back in reverse order: the function call stack, recursion, DFS, parsing expressions and parentheses, the Undo history. All operations are O(1). With a fixed-size array there is a risk of overflow, while pop on an empty stack is the underflow error. Very deep recursion can cause a real stack overflow.',
    queue: 'A queue is used when processing must follow the order of arrival: task scheduling, network buffers, messaging systems and BFS. Operations are O(1) with a circular buffer or a linked list. Variants: deque (two ends), priority queue (not FIFO) and bounded queues, which create backpressure when the producer is faster than the consumer.',
    linkedlist: 'A linked list is used when insertions and deletions at a known position are frequent and the number of elements changes: O(1) at the head or after a given node. The drawback: no direct access (O(n)) and worse cache behavior than an array. It is the base for stacks, queues, collision chains and the free lists of memory allocators.',
    hashmap: 'A HashMap is used when you need average O(1) access by key: caches, indexes, frequency counts, removing duplicates. Performance depends on the hash function, on collisions and on the load factor; when it passes a threshold (e.g. 0.75), the table grows and rehashes. It does not keep sorted order and in the worst case, with many collisions, it becomes O(n).',
};

export { MORE_EN, REAL_EN, TECH_EN };
