// src/ui/learningTraits.en.js — English explanations of the characteristics (keys = English
// trait names used in learningData.en.js).

const TRAIT_INFO_EN = {
    'Stable': 'A sort is stable when two elements with equal values keep their original order. Example: if students were sorted by name and you then sort them by grade, those with the same grade stay sorted by name. This matters when you sort by several criteria one after another.',
    'In-place': 'The algorithm works inside the array itself and uses only a very small amount of extra memory (usually O(1) or O(log n)). It does not create a full copy of the data, so it saves memory. By comparison, Merge Sort needs O(n) extra memory.',
    'Adaptive': 'The algorithm takes advantage of any order the data already has: the closer to sorted it is, the less work it does. Insertion Sort is O(n) on a sorted list and O(n²) on a reversed one.',
    'Divide & conquer': 'Splits the problem into smaller parts, solves each part (often recursively) and combines the results. Merge Sort splits the list in halves, Quick Sort splits it around a pivot. This often leads to O(n log n) time.',
    'Non-comparative': 'It does not decide the order by comparing elements with each other, but by using the values themselves, e.g. the digits of a number. That is why it can beat the O(n log n) limit of comparison sorts, but it only works for certain kinds of data, such as integers.',
    'Works on unsorted data': 'Linear Search does not require the list to be sorted; it is enough to walk through it from the start. The price is that in the worst case it checks every element, which is O(n).',
    'Requires a sorted array': 'Binary Search can halve the range only because the elements are sorted: if the value is smaller than the middle, it cannot be on the right. On an unsorted list the result is wrong.',
    'Hierarchical structure': 'The data is organized as a tree: one root and child nodes, with no cycles. Every node has a parent (except the root). This models relationships such as folders on a computer or a family tree.',
    'Greedy': 'A greedy algorithm picks the option that looks best right now at every step and never reconsiders it. Dijkstra picks the node with the smallest distance, Kruskal the cheapest edge. It only works when this strategy guarantees an optimal solution.',
    'No negative weights': 'Dijkstra assumes no edge has a negative weight. Then, once a node is finalized, no shorter path to it can be found through other nodes. With negative weights, the Bellman-Ford algorithm is used instead.',
    'Union-Find': 'A structure that keeps disjoint groups of nodes and answers quickly: "are these two nodes in the same group?" and "merge the two groups". Kruskal uses it to detect whether a new edge would create a cycle.',
    'LIFO': 'Last In, First Out: the last element added is the first to leave, like a pile of plates. You add and remove only at the top.',
    'FIFO': 'First In, First Out: the first element added is the first to leave, like a line at the checkout. You add at the end and remove from the front.',
    'Dynamic memory': 'Elements are allocated at run time and do not need a contiguous block of memory. The list grows or shrinks without copying everything, but every node also stores an extra reference.',
    'Key-value': 'Data is stored as pairs: a unique key and its value. The key is used to find the value quickly, like a name in a phone book.',
    'Collision handling': 'A collision happens when two different keys map to the same bucket. Two common approaches: chaining (each bucket holds a list, as this visualization shows) or open addressing (look for the next free bucket).',
};

export { TRAIT_INFO_EN };
