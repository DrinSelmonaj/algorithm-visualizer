// src/ui/learningData.en.js — English counterpart of BASE and OPERATIONS from learningData.js.
// Same keys and same row layout: [title, summary, use, best, average, worst, space, traits].
// The complexity values (O(...)) are identical to the Albanian rows.

const BASE_EN = {
    bubble: ['Bubble Sort', 'Compares neighbors and swaps them until the largest element moves to the end.', 'Good for learning and for very small lists.', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', ['Stable', 'In-place']],
    insertion: ['Insertion Sort', 'Builds a sorted part by inserting each element into its correct position.', 'Shines with small or nearly sorted data.', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', ['Stable', 'In-place', 'Adaptive']],
    selection: ['Selection Sort', 'Finds the minimum of the unsorted part and places it in the next position.', 'Useful when writes to memory must be minimized.', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', ['In-place']],
    merge: ['Merge Sort', 'Splits the array, sorts the halves and merges them in order.', 'A safe choice for large data and for stable sorting.', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', ['Stable', 'Divide & conquer']],
    quick: ['Quick Sort', 'Picks a pivot and splits the elements into smaller and larger ones around it.', 'Very fast in practice for in-memory arrays.', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)', ['In-place', 'Divide & conquer']],
    shell: ['Shell Sort', 'Improves Insertion Sort by first comparing elements that are a gap apart.', 'Suitable for medium-sized arrays without extra memory.', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(1)', ['In-place', 'Adaptive']],
    heap: ['Heap Sort', 'Builds a max-heap and extracts the maximum one by one.', 'When O(n log n) worst-case time with O(1) space is required.', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', ['In-place']],
    radix: ['Radix Sort', 'Sorts numbers digit by digit, from the least to the most significant.', 'For integers with a bounded number of digits.', 'O(nk)', 'O(nk)', 'O(nk)', 'O(n+k)', ['Stable', 'Non-comparative']],
    linear: ['Linear Search', 'Checks elements one by one from the start until the target is found.', 'When the data is small or unsorted.', 'O(1)', 'O(n)', 'O(n)', 'O(1)', ['Works on unsorted data']],
    binary: ['Binary Search', 'Halves the search range after every comparison.', 'For sorted arrays and frequent searches.', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)', ['Requires a sorted array']],
    bst: ['Binary Search Tree', 'Keeps smaller values on the left and larger values on the right.', 'For dynamic search, insertion and deletion in sorted order.', 'O(1)', 'O(log n)', 'O(n)', 'O(n)', ['Hierarchical structure']],
    dijkstra: ['Dijkstra', 'Expands the node with the smallest distance and relaxes its edges.', 'For the shortest path with non-negative weights.', 'O(V²)', 'O(V²)', 'O(V²)', 'O(V)', ['Greedy', 'No negative weights']],
    kruskal: ['Kruskal', 'Sorts the edges by weight and adds them without creating a cycle.', 'For the minimum spanning tree of connected graphs.', 'O(E log E)', 'O(E log E)', 'O(E log E)', 'O(V)', ['Greedy', 'Union-Find']],
    stack: ['Stack', 'A LIFO structure: the last element added is the first to leave.', 'Call stack, undo, parsing and DFS.', 'O(1)', 'O(1)', 'O(1)', 'O(n)', ['LIFO']],
    queue: ['Queue', 'A FIFO structure: the first element added is the first to leave.', 'Scheduling, buffering and BFS.', 'O(1)', 'O(1)', 'O(1)', 'O(n)', ['FIFO']],
    linkedlist: ['Linked List', 'Nodes are connected by references instead of contiguous memory.', 'When insertions and deletions are more frequent than access.', 'O(1)', 'O(n)', 'O(n)', 'O(n)', ['Dynamic memory']],
    hashmap: ['HashMap', 'A hash function routes every key to a bucket.', 'Fast key-value lookup, caches and indexing.', 'O(1)', 'O(1)', 'O(n)', 'O(n)', ['Key-value', 'Collision handling']],
};

const OPERATIONS_EN = {
    bst: [['Search', 'O(log n)', 'O(n)'], ['Insert', 'O(log n)', 'O(n)'], ['Delete', 'O(log n)', 'O(n)']],
    stack: [['Push', 'O(1)', 'O(1)'], ['Pop', 'O(1)', 'O(1)'], ['Peek', 'O(1)', 'O(1)']],
    queue: [['Enqueue', 'O(1)', 'O(1)'], ['Dequeue', 'O(1)', 'O(1)'], ['Peek', 'O(1)', 'O(1)']],
    linkedlist: [['Access', 'O(n)', 'O(n)'], ['Insert at head', 'O(1)', 'O(1)'], ['Search', 'O(n)', 'O(n)']],
    hashmap: [['Get', 'O(1)', 'O(n)'], ['Put', 'O(1)', 'O(n)'], ['Remove', 'O(1)', 'O(n)']],
};

export { BASE_EN, OPERATIONS_EN };
