// src/ui/pseudocode.en.js — English counterpart of PSEUDO from pseudocode.js.
// Same keys and the same code; only the comments (IDEA, INVARIANT, COMPLEXITY…) are English.
// General pseudocode: it is not tied line by line to the animation.

const PSEUDO_EN = {
    bubble: `ALGORITHM BubbleSort(A[0..n-1])
  // IDEA: large elements "bubble up" toward the end
  // INVARIANT: after pass k, the k largest elements are in their final positions
  FOR pass ← 0 TO n-2 DO
      swapped ← FALSE
      FOR j ← 0 TO n-2-pass DO          // the tail is already sorted
          IF A[j] > A[j+1] THEN         // ">" (not "≥") keeps the sort STABLE
              SWAP A[j], A[j+1]
              swapped ← TRUE
          END IF
      END FOR
      IF swapped = FALSE THEN BREAK     // no swap → the list is sorted
  END FOR
END ALGORITHM

// COMPLEXITY
//   Best    : O(n)    — sorted list, one pass with no swaps
//   Average : O(n²)   — about n²/4 swaps and n²/2 comparisons
//   Worst   : O(n²)   — reversed list
//   Space   : O(1)    — in-place and stable`,

    insertion: `ALGORITHM InsertionSort(A[0..n-1])
  // IDEA: A[0..i-1] is sorted; insert A[i] into its place
  // INVARIANT: before each iteration, A[0..i-1] holds the same elements, sorted
  FOR i ← 1 TO n-1 DO
      key ← A[i]
      j ← i - 1
      WHILE j ≥ 0 AND A[j] > key DO
          A[j+1] ← A[j]                 // shift right (a write, not a swap)
          j ← j - 1
      END WHILE
      A[j+1] ← key                      // the correct position of key
  END FOR
END ALGORITHM

// COMPLEXITY
//   Best    : O(n)    — sorted list: the WHILE never runs
//   Average : O(n²)
//   Worst   : O(n²)   — reversed list: each element crosses the whole sorted part
//   Space   : O(1)    — in-place, stable and adaptive (fast on nearly sorted lists)`,

    selection: `ALGORITHM SelectionSort(A[0..n-1])
  // IDEA: at each step pick the minimum of the unsorted part and put it at its start
  // INVARIANT: A[0..i-1] holds the i smallest elements, already in their final positions
  FOR i ← 0 TO n-2 DO
      minIdx ← i
      FOR j ← i+1 TO n-1 DO
          IF A[j] < A[minIdx] THEN
              minIdx ← j                // remember only the INDEX, no swap yet
          END IF
      END FOR
      IF minIdx ≠ i THEN
          SWAP A[i], A[minIdx]          // at most n-1 swaps in total
      END IF
  END FOR
END ALGORITHM

// COMPLEXITY
//   Comparisons : always n(n-1)/2 → O(n²) in every case (even on a sorted list)
//   Swaps       : at most n-1 → good when writing to memory is expensive
//   Space       : O(1) — in-place, but NOT stable (a swap can jump over equal elements)`,

    merge: `ALGORITHM MergeSort(A, lo, hi)
  // IDEA: divide → sort each half → merge
  // INVARIANT: after the call, A[lo..hi] is sorted
  IF lo ≥ hi THEN RETURN                // 0 or 1 element: the recursion base case
  mid ← ⌊(lo + hi) / 2⌋
  MergeSort(A, lo, mid)
  MergeSort(A, mid+1, hi)
  Merge(A, lo, mid, hi)
END ALGORITHM

PROCEDURE Merge(A, lo, mid, hi)
  L ← copy of A[lo..mid]
  R ← copy of A[mid+1..hi]
  i ← 0;  j ← 0;  k ← lo
  WHILE i < |L| AND j < |R| DO
      IF L[i] ≤ R[j] THEN              // "≤" keeps the order of equal elements → STABLE
          A[k] ← L[i];  i ← i + 1
      ELSE
          A[k] ← R[j];  j ← j + 1
      END IF
      k ← k + 1
  END WHILE
  copy whatever is left of L or R into A
END PROCEDURE

// COMPLEXITY
//   Time  : T(n) = 2·T(n/2) + O(n) → O(n log n) in every case (log n levels × O(n) merge)
//   Space : O(n) for the merge copies; stable, but NOT in-place`,

    quick: `ALGORITHM QuickSort(A, lo, hi)
  // IDEA: pick a pivot, put it in its final place, then repeat left and right
  // INVARIANT: after Partition, every element left of the pivot ≤ pivot < every element right of it
  IF lo < hi THEN
      p ← Partition(A, lo, hi)
      QuickSort(A, lo, p - 1)
      QuickSort(A, p + 1, hi)
  END IF
END ALGORITHM

FUNCTION Partition(A, lo, hi)           // Lomuto scheme
  pivot ← A[hi]                         // better choice: the middle or a random element
  i ← lo - 1
  FOR j ← lo TO hi - 1 DO
      IF A[j] ≤ pivot THEN
          i ← i + 1
          SWAP A[i], A[j]
      END IF
  END FOR
  SWAP A[i+1], A[hi]                    // the pivot goes to its final position
  RETURN i + 1
END FUNCTION

// COMPLEXITY
//   Average : O(n log n) — the pivot splits the list roughly in the middle
//   Worst   : O(n²) — the pivot is always the min/max (e.g. a sorted list with the last element as pivot)
//   Space   : O(log n) for the recursion stack; in-place, NOT stable`,

    shell: `ALGORITHM ShellSort(A[0..n-1])
  // IDEA: Insertion Sort over elements "gap" apart; the gap shrinks down to 1
  // INVARIANT: after each phase with gap = g, every g-th element is sorted relative to its neighbors
  gap ← ⌊n / 2⌋                          // classic sequence: n/2, n/4, …, 1
  WHILE gap ≥ 1 DO
      FOR i ← gap TO n-1 DO
          temp ← A[i]
          j ← i
          WHILE j ≥ gap AND A[j - gap] > temp DO
              A[j] ← A[j - gap]         // shift by "gap", not by 1
              j ← j - gap
          END WHILE
          A[j] ← temp
      END FOR
      gap ← ⌊gap / 2⌋
  END WHILE
END ALGORITHM

// COMPLEXITY
//   Depends on the gap sequence: classic → O(n²) worst case; Sedgewick → ~O(n^(4/3))
//   The last phase (gap = 1) is Insertion Sort, but on an already nearly sorted list
//   Space : O(1) — in-place, NOT stable`,

    heap: `ALGORITHM HeapSort(A[0..n-1])
  // IDEA: build a max-heap, then move the maximum to the end one by one
  // INVARIANT: A[0..end] is a max-heap; A[end+1..n-1] holds the largest elements, sorted
  FOR i ← ⌊n/2⌋ - 1 DOWNTO 0 DO        // building the heap: O(n)
      SiftDown(A, i, n)
  END FOR
  FOR end ← n-1 DOWNTO 1 DO
      SWAP A[0], A[end]                 // the root (maximum) goes to its final position
      SiftDown(A, 0, end)               // repair the heap in the remaining part
  END FOR
END ALGORITHM

PROCEDURE SiftDown(A, i, size)
  LOOP
      largest ← i;  l ← 2i + 1;  r ← 2i + 2
      IF l < size AND A[l] > A[largest] THEN largest ← l
      IF r < size AND A[r] > A[largest] THEN largest ← r
      IF largest = i THEN RETURN        // the parent is already ≥ both children
      SWAP A[i], A[largest]
      i ← largest
  END LOOP
END PROCEDURE

// COMPLEXITY
//   Build O(n) + n extractions × O(log n) → O(n log n) in every case, even the worst
//   Space : O(1) — in-place, NOT stable; scattered memory access makes it slower than Quick in practice`,

    radix: `ALGORITHM RadixSort(A[0..n-1])        // LSD, for non-negative integers
  // IDEA: sort by the least significant digit, then step by step toward the most significant
  // INVARIANT: after the pass for digit d, A is sorted by the last d digits
  max ← MAX(A)
  exp ← 1                                // 1 = ones, 10 = tens, …
  WHILE ⌊max / exp⌋ > 0 DO
      CountingSort(A, exp)
      exp ← exp × 10
  END WHILE
END ALGORITHM

PROCEDURE CountingSort(A, exp)           // a STABLE pass by one digit
  count[0..9] ← 0
  FOR EACH x IN A DO  count[⌊x / exp⌋ MOD 10] ← count[…] + 1
  FOR d ← 1 TO 9 DO   count[d] ← count[d] + count[d-1]   // last position of the bucket
  FOR i ← n-1 DOWNTO 0 DO                // backwards: keeps stability
      d ← ⌊A[i] / exp⌋ MOD 10
      count[d] ← count[d] - 1
      out[count[d]] ← A[i]
  END FOR
  A ← out
END PROCEDURE

// COMPLEXITY
//   O(n·k) where k = number of digits of the maximum; space O(n + 10)
//   It does not compare elements; the stability of each pass is essential for correctness`,

    linear: `ALGORITHM LinearSearch(A[0..n-1], target)
  // IDEA: check every element in turn until it is found
  // INVARIANT: before iteration i, target is not in A[0..i-1]
  FOR i ← 0 TO n-1 DO
      IF A[i] = target THEN
          RETURN i                      // found: return the first position
      END IF
  END FOR
  RETURN -1                             // does not exist
END ALGORITHM

// COMPLEXITY
//   Best    : O(1)  — the first element
//   Average : O(n)  — about n/2 comparisons if the element exists
//   Worst   : O(n)  — at the end, or missing
//   Space   : O(1) — no prior sorting required`,

    binary: `ALGORITHM BinarySearch(A[0..n-1], target)   // REQUIRES A sorted in ascending order
  // IDEA: compare with the middle and discard the half where target cannot be
  // INVARIANT: if target exists, it is in A[low..high]
  low ← 0;  high ← n - 1
  WHILE low ≤ high DO
      mid ← low + ⌊(high - low) / 2⌋     // avoids overflow of (low + high)
      IF A[mid] = target THEN
          RETURN mid
      ELSE IF A[mid] < target THEN
          low ← mid + 1                  // continue in the right half
      ELSE
          high ← mid - 1                 // continue in the left half
      END IF
  END WHILE
  RETURN -1                              // the range emptied: it does not exist
END ALGORITHM

// COMPLEXITY
//   Each step halves the range → at most ⌊log₂ n⌋ + 1 comparisons (1 million elements ≈ 20 steps)
//   Time O(log n), space O(1). On an unsorted list the result is unreliable (usually wrong)`,

    bst: `STRUCTURE BSTNode { value, left, right }
// INVARIANT: for every node x: all values in x.left < x.value < all values in x.right

FUNCTION Insert(node, v)
  IF node = NULL THEN RETURN NewNode(v)
  IF v < node.value THEN node.left ← Insert(node.left, v)
  ELSE IF v > node.value THEN node.right ← Insert(node.right, v)
  // v = node.value → duplicate: ignored
  RETURN node

FUNCTION Search(node, v)
  WHILE node ≠ NULL AND node.value ≠ v DO
      node ← (v < node.value) ? node.left : node.right
  RETURN node                            // NULL if it does not exist

FUNCTION Delete(node, v)
  IF node = NULL THEN RETURN NULL
  IF v < node.value THEN node.left ← Delete(node.left, v)
  ELSE IF v > node.value THEN node.right ← Delete(node.right, v)
  ELSE                                   // found the node to delete
      IF node.left = NULL THEN RETURN node.right       // 0 or 1 child
      IF node.right = NULL THEN RETURN node.left
      succ ← MIN(node.right)             // in-order successor (2 children)
      node.value ← succ.value
      node.right ← Delete(node.right, succ.value)
  RETURN node

// TRAVERSAL: In-order (L, Root, R) gives the values sorted; Pre-order: Root, L, R; Post-order: L, R, Root
// COMPLEXITY: O(h), h = height → O(log n) for a balanced tree, O(n) when it degenerates into a list`,

    dijkstra: `ALGORITHM Dijkstra(G, source)         // non-negative weights!
  // IDEA: always expand the unvisited node with the smallest distance (greedy)
  // INVARIANT: when a node is visited, its dist[] is the correct shortest distance
  FOR EACH v IN G.nodes DO
      dist[v] ← ∞;  prev[v] ← NULL
  END FOR
  dist[source] ← 0
  visited ← {}
  WHILE there is an unvisited node with dist < ∞ DO
      u ← the unvisited node with the smallest dist[u]
      visited ← visited ∪ {u}
      FOR EACH (u, v, w) IN G.edges(u) DO          // w = edge weight
          IF dist[u] + w < dist[v] THEN            // RELAXATION
              dist[v] ← dist[u] + w
              prev[v] ← u
          END IF
      END FOR
  END WHILE
  RETURN dist, prev
END ALGORITHM

// PATH to node t: follow prev[t], prev[prev[t]], … up to source and reverse it
// COMPLEXITY: O(V²) with an array; O((V + E) log V) with a priority queue (heap); space O(V)`,

    kruskal: `ALGORITHM Kruskal(G)                   // minimum spanning tree (MST)
  // IDEA: take edges from the cheapest, accept one only if it creates no cycle
  // INVARIANT: the accepted edges form a cycle-free forest with minimum weight
  mst ← {}
  FOR EACH v IN G.nodes DO MakeSet(v)             // every node in its own group
  SORT G.edges by weight ascending
  FOR EACH (u, v, w) IN G.edges DO
      IF Find(u) ≠ Find(v) THEN                   // nodes in different components
          mst ← mst ∪ {(u, v, w)}
          Union(u, v)                             // merge the two components
      ELSE
          // Find(u) = Find(v): the edge would create a cycle → rejected
      END IF
      IF |mst| = |G.nodes| - 1 THEN BREAK         // the tree is complete
  END FOR
  RETURN mst
END ALGORITHM

// UNION-FIND: Find with path compression, Union by rank → almost O(1) amortized
// COMPLEXITY: O(E log E) — sorting dominates; if the graph is not connected, the result is a forest`,

    stack: `STRUCTURE Stack { items[], top }       // LIFO: last in, first out
// INVARIANT: top points to the last element added; top = -1 when the stack is empty

PROCEDURE Push(x)
  IF top = capacity - 1 THEN ERROR "stack overflow"   // only in the fixed-size array implementation
  top ← top + 1
  items[top] ← x

FUNCTION Pop()
  IF IsEmpty() THEN ERROR "stack underflow"          // the most common mistake
  x ← items[top]
  top ← top - 1
  RETURN x

FUNCTION Peek()
  IF IsEmpty() THEN ERROR "empty stack"
  RETURN items[top]                     // look without removing

FUNCTION IsEmpty()
  RETURN top = -1

// COMPLEXITY: Push, Pop, Peek, IsEmpty — all O(1); space O(n)
// USE: balanced parentheses → Push for "(", Pop for ")"; empty at the end = balanced`,

    queue: `STRUCTURE Queue { items[], head, tail, size }   // FIFO: first in, first out
// INVARIANT: the elements are at items[head .. head+size-1] (modulo capacity)

PROCEDURE Enqueue(x)
  IF size = capacity THEN ERROR "queue full"
  items[(head + size) MOD capacity] ← x       // add at the END
  size ← size + 1

FUNCTION Dequeue()
  IF size = 0 THEN ERROR "queue empty"
  x ← items[head]
  head ← (head + 1) MOD capacity              // circular: moves no elements
  size ← size - 1
  RETURN x

FUNCTION Peek()
  IF size = 0 THEN ERROR "queue empty"
  RETURN items[head]

// COMPLEXITY: O(1) for all three; space O(n)
// CAUTION: with a plain array and removal from index 0, Dequeue would shift everything → O(n)
//   That is why a circular buffer (as above) or a linked list with head/tail pointers is used`,

    linkedlist: `STRUCTURE Node { value, next }
STRUCTURE LinkedList { head }           // empty list: head = NULL
// IDEA: each node holds a value and a reference to the next node; no contiguous memory
// INVARIANT: from head, following next, every node is reached exactly once and the chain ends with NULL

PROCEDURE InsertAtHead(v)               // O(1)
  n ← NewNode(v);  n.next ← head;  head ← n

PROCEDURE InsertAtTail(v)               // O(n) without a tail pointer
  n ← NewNode(v)
  IF head = NULL THEN head ← n; RETURN
  cur ← head
  WHILE cur.next ≠ NULL DO cur ← cur.next
  cur.next ← n

FUNCTION Search(v)                      // O(n)
  cur ← head
  WHILE cur ≠ NULL AND cur.value ≠ v DO cur ← cur.next
  RETURN cur                            // NULL if it does not exist

PROCEDURE Delete(v)
  IF head = NULL THEN RETURN
  IF head.value = v THEN head ← head.next; RETURN
  prev ← head
  WHILE prev.next ≠ NULL AND prev.next.value ≠ v DO prev ← prev.next
  IF prev.next ≠ NULL THEN prev.next ← prev.next.next   // skip the node
  // CAUTION: change prev.next BEFORE you lose the reference to the next node

// COMPLEXITY: insert at head O(1); search/delete/insert at the end O(n); space O(n)
// Unlike an array: no direct access to the i-th position`,

    hashmap: `STRUCTURE HashMap { buckets[0..m-1] }  // each bucket = linked list (chain)
// INVARIANT: the pair (key, value) is always in the bucket buckets[Hash(key)]

FUNCTION Hash(key)
  sum ← 0
  FOR EACH ch IN key DO sum ← sum + code(ch)
  RETURN sum MOD m                      // the bucket index

PROCEDURE Put(key, value)
  b ← Hash(key)
  FOR EACH entry IN buckets[b] DO
      IF entry.key = key THEN entry.value ← value; RETURN   // update the existing one
  END FOR
  buckets[b].addFirst((key, value))     // new key: inserted at the front of the chain

FUNCTION Get(key)
  FOR EACH entry IN buckets[Hash(key)] DO
      IF entry.key = key THEN RETURN entry.value
  RETURN NULL

PROCEDURE Remove(key)
  remove the entry with key = key from buckets[Hash(key)]

// COLLISION: two keys → the same bucket; the chain holds both (a search walks the chain)
// COMPLEXITY: average O(1) when chains are short (small load factor n/m);
//   worst O(n) when everything falls into one bucket; usually rehashed when n/m passes ~0.75`,
};

export { PSEUDO_EN };
