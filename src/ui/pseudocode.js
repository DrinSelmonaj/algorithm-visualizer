import { getLang } from '../i18n/index.js';
import { PSEUDO_EN } from './pseudocode.en.js';

// src/ui/pseudocode.js
// Pseudokod i thelluar për çdo algoritëm/strukturë: ideja, invarianti (çfarë
// mbetet gjithmonë e vërtetë), hapat me kushte reale dhe analiza e kompleksitetit.
// Është pseudokod i përgjithshëm (jo i lidhur rresht-për-rresht me animacionin).

const PSEUDO = {
    bubble: `ALGORITHM BubbleSort(A[0..n-1])
  // IDEJA: elementet e mëdha "ngjiten" drejt fundit si flluskat
  // INVARIANTI: pas kalimit k, k elementët më të mëdhenj janë në vendin final
  FOR pass ← 0 TO n-2 DO
      swapped ← FALSE
      FOR j ← 0 TO n-2-pass DO          // pjesa e fundit është tashmë e renditur
          IF A[j] > A[j+1] THEN         // ">" (jo "≥") e bën algoritmin STABIL
              SWAP A[j], A[j+1]
              swapped ← TRUE
          END IF
      END FOR
      IF swapped = FALSE THEN BREAK     // asnjë ndërrim → lista është e renditur
  END FOR
END ALGORITHM

// KOMPLEKSITETI
//   Më i miri : O(n)    — lista e renditur, një kalim pa ndërrime
//   Mesatar   : O(n²)   — rreth n²/4 ndërrime dhe n²/2 krahasime
//   Më i keqi : O(n²)   — lista e kundërt
//   Hapësira  : O(1)    — punon në vend (in-place), është stabil`,

    insertion: `ALGORITHM InsertionSort(A[0..n-1])
  // IDEJA: pjesa e majtë A[0..i-1] është e renditur; fut A[i] në vendin e saj
  // INVARIANTI: para çdo iteracioni, A[0..i-1] ka të njëjtat elemente, të renditura
  FOR i ← 1 TO n-1 DO
      key ← A[i]
      j ← i - 1
      WHILE j ≥ 0 AND A[j] > key DO
          A[j+1] ← A[j]                 // zhvendos djathtas (shkrim, jo ndërrim)
          j ← j - 1
      END WHILE
      A[j+1] ← key                      // vendi i saktë i key-t
  END FOR
END ALGORITHM

// KOMPLEKSITETI
//   Më i miri : O(n)    — lista e renditur: WHILE nuk ekzekutohet kurrë
//   Mesatar   : O(n²)
//   Më i keqi : O(n²)   — lista e kundërt: çdo element kalon gjithë pjesën e renditur
//   Hapësira  : O(1)    — in-place, stabil dhe adaptiv (shpejt për lista pothuajse të renditura)`,

    selection: `ALGORITHM SelectionSort(A[0..n-1])
  // IDEJA: në çdo hap zgjidh minimumin e pjesës së parenditur dhe e vendos në fillim të saj
  // INVARIANTI: A[0..i-1] përmban i më të voglit, tashmë në vendin përfundimtar
  FOR i ← 0 TO n-2 DO
      minIdx ← i
      FOR j ← i+1 TO n-1 DO
          IF A[j] < A[minIdx] THEN
              minIdx ← j                // mbaj mend vetëm INDEKSIN, pa ndërruar ende
          END IF
      END FOR
      IF minIdx ≠ i THEN
          SWAP A[i], A[minIdx]          // maksimumi n-1 ndërrime gjithsej
      END IF
  END FOR
END ALGORITHM

// KOMPLEKSITETI
//   Krahasime : n(n-1)/2 gjithmonë → O(n²) në çdo rast (edhe në listë të renditur)
//   Ndërrime  : në më të shumtën n-1 → i mirë kur shkrimi në memorie është i kushtueshëm
//   Hapësira  : O(1) — in-place, por NUK është stabil (ndërrimi mund të kalojë elementë të barabartë)`,

    merge: `ALGORITHM MergeSort(A, lo, hi)
  // IDEJA: ndaj → rendit secilën gjysmë → bashko
  // INVARIANTI: pas thirrjes, A[lo..hi] është e renditur
  IF lo ≥ hi THEN RETURN                // 0 ose 1 element: baza e rekursionit
  mid ← ⌊(lo + hi) / 2⌋
  MergeSort(A, lo, mid)
  MergeSort(A, mid+1, hi)
  Merge(A, lo, mid, hi)
END ALGORITHM

PROCEDURE Merge(A, lo, mid, hi)
  L ← kopje e A[lo..mid]
  R ← kopje e A[mid+1..hi]
  i ← 0;  j ← 0;  k ← lo
  WHILE i < |L| AND j < |R| DO
      IF L[i] ≤ R[j] THEN              // "≤" ruan rendin e barabartëve → STABIL
          A[k] ← L[i];  i ← i + 1
      ELSE
          A[k] ← R[j];  j ← j + 1
      END IF
      k ← k + 1
  END WHILE
  kopjo çfarëdo që ka mbetur nga L ose R në A
END PROCEDURE

// KOMPLEKSITETI
//   Koha     : T(n) = 2·T(n/2) + O(n) → O(n log n) në çdo rast (log n nivele × O(n) bashkim)
//   Hapësira : O(n) për kopjet e bashkimit; stabil, por JO in-place`,

    quick: `ALGORITHM QuickSort(A, lo, hi)
  // IDEJA: zgjidh pivot, vendose në vendin final, pastaj përsërit majtas dhe djathtas
  // INVARIANTI: pas Partition, çdo element majtas pivotit ≤ pivot < çdo element djathtas
  IF lo < hi THEN
      p ← Partition(A, lo, hi)
      QuickSort(A, lo, p - 1)
      QuickSort(A, p + 1, hi)
  END IF
END ALGORITHM

FUNCTION Partition(A, lo, hi)           // skema e Lomuto-s
  pivot ← A[hi]                         // zgjedhje më e mirë: mesi ose rastësor
  i ← lo - 1
  FOR j ← lo TO hi - 1 DO
      IF A[j] ≤ pivot THEN
          i ← i + 1
          SWAP A[i], A[j]
      END IF
  END FOR
  SWAP A[i+1], A[hi]                    // pivoti shkon në vendin përfundimtar
  RETURN i + 1
END FUNCTION

// KOMPLEKSITETI
//   Mesatar   : O(n log n) — pivoti ndan listën afërsisht në mes
//   Më i keqi : O(n²) — pivot gjithmonë minimumi/maksimumi (p.sh. listë e renditur me pivot të fundit)
//   Hapësira  : O(log n) për stekun e rekursionit; in-place, JO stabil`,

    shell: `ALGORITHM ShellSort(A[0..n-1])
  // IDEJA: Insertion Sort mbi elementë me largësi "gap"; gap-i zvogëlohet deri në 1
  // INVARIANTI: pas çdo faze me gap = g, çdo g-të element është i renditur ndaj fqinjëve të tij
  gap ← ⌊n / 2⌋                          // sekuencë klasike: n/2, n/4, …, 1
  WHILE gap ≥ 1 DO
      FOR i ← gap TO n-1 DO
          temp ← A[i]
          j ← i
          WHILE j ≥ gap AND A[j - gap] > temp DO
              A[j] ← A[j - gap]         // zhvendos me hap "gap", jo 1
              j ← j - gap
          END WHILE
          A[j] ← temp
      END FOR
      gap ← ⌊gap / 2⌋
  END WHILE
END ALGORITHM

// KOMPLEKSITETI
//   Varet nga sekuenca e gap-eve: klasike → O(n²) në më të keqen; Sedgewick → ~O(n^(4/3))
//   Faza e fundit (gap = 1) është Insertion Sort, por mbi listë tashmë pothuajse të renditur
//   Hapësira  : O(1) — in-place, JO stabil`,

    heap: `ALGORITHM HeapSort(A[0..n-1])
  // IDEJA: ndërto max-heap, pastaj nxirr maksimumin një nga një në fund të listës
  // INVARIANTI: A[0..end] është max-heap; A[end+1..n-1] përmban të mëdhenjtë, të renditur
  FOR i ← ⌊n/2⌋ - 1 DOWNTO 0 DO        // ndërtimi i heap-it: O(n)
      SiftDown(A, i, n)
  END FOR
  FOR end ← n-1 DOWNTO 1 DO
      SWAP A[0], A[end]                 // rrënja (maksimumi) shkon në vendin final
      SiftDown(A, 0, end)               // rregullo heap-in në pjesën e mbetur
  END FOR
END ALGORITHM

PROCEDURE SiftDown(A, i, size)
  LOOP
      largest ← i;  l ← 2i + 1;  r ← 2i + 2
      IF l < size AND A[l] > A[largest] THEN largest ← l
      IF r < size AND A[r] > A[largest] THEN largest ← r
      IF largest = i THEN RETURN        // prindi tashmë ≥ të dy fëmijët
      SWAP A[i], A[largest]
      i ← largest
  END LOOP
END PROCEDURE

// KOMPLEKSITETI
//   Ndërtimi O(n) + n nxjerrje × O(log n) → O(n log n) në çdo rast, madje edhe më të keqen
//   Hapësira  : O(1) — in-place, JO stabil; qasja e shpërndarë në memorie e bën më të ngadaltë se Quick`,

    radix: `ALGORITHM RadixSort(A[0..n-1])        // LSD, për numra të plotë jo-negativë
  // IDEJA: rendit sipas shifrës më pak të rëndësishme, pastaj radhazi drejt asaj më të rëndësishme
  // INVARIANTI: pas kalimit me shifrën d, A është e renditur sipas d-shifrave të fundit
  max ← MAX(A)
  exp ← 1                                // 1 = njëshet, 10 = dhjetëshet, …
  WHILE ⌊max / exp⌋ > 0 DO
      CountingSort(A, exp)
      exp ← exp × 10
  END WHILE
END ALGORITHM

PROCEDURE CountingSort(A, exp)           // kalim STABIL sipas një shifre
  count[0..9] ← 0
  FOR EACH x IN A DO  count[⌊x / exp⌋ MOD 10] ← count[…] + 1
  FOR d ← 1 TO 9 DO   count[d] ← count[d] + count[d-1]   // pozicioni i fundit i kovës
  FOR i ← n-1 DOWNTO 0 DO                // prapa: ruan stabilitetin
      d ← ⌊A[i] / exp⌋ MOD 10
      count[d] ← count[d] - 1
      out[count[d]] ← A[i]
  END FOR
  A ← out
END PROCEDURE

// KOMPLEKSITETI
//   O(n·k) ku k = numri i shifrave të maksimumit; hapësira O(n + 10)
//   Nuk krahason elementë; stabiliteti i çdo kalimi është i domosdoshëm për korrektësinë`,

    linear: `ALGORITHM LinearSearch(A[0..n-1], target)
  // IDEJA: kontrollo çdo element me radhë deri te gjetja
  // INVARIANTI: para iteracionit i, target nuk është te A[0..i-1]
  FOR i ← 0 TO n-1 DO
      IF A[i] = target THEN
          RETURN i                      // gjetur: kthe pozicionin e parë
      END IF
  END FOR
  RETURN -1                             // nuk ekziston
END ALGORITHM

// KOMPLEKSITETI
//   Më i miri : O(1)  — elementi i parë
//   Mesatar   : O(n)  — rreth n/2 krahasime nëse elementi ekziston
//   Më i keqi : O(n)  — në fund, ose mungon
//   Hapësira  : O(1) — nuk kërkon renditje paraprake`,

    binary: `ALGORITHM BinarySearch(A[0..n-1], target)   // KËRKON A të renditur rritës
  // IDEJA: krahaso me mesin dhe hidh poshtë gjysmën ku target s'mund të jetë
  // INVARIANTI: nëse target ekziston, ai është te A[low..high]
  low ← 0;  high ← n - 1
  WHILE low ≤ high DO
      mid ← low + ⌊(high - low) / 2⌋     // shmang tejmbushjen e (low + high)
      IF A[mid] = target THEN
          RETURN mid
      ELSE IF A[mid] < target THEN
          low ← mid + 1                  // vazhdo te gjysma e djathtë
      ELSE
          high ← mid - 1                 // vazhdo te gjysma e majtë
      END IF
  END WHILE
  RETURN -1                              // zona u zbraz: nuk ekziston
END ALGORITHM

// KOMPLEKSITETI
//   Çdo hap gjysmon zonën → ⌊log₂ n⌋ + 1 krahasime maksimumi (1 milion elementë ≈ 20 hapa)
//   Koha O(log n), hapësira O(1). Në listë të parenditur rezultati është i pasigurt (zakonisht i gabuar)`,

    bst: `STRUCTURE BSTNode { value, left, right }
// INVARIANTI: për çdo nyje x: gjithë vlerat në x.left < x.value < gjithë vlerat në x.right

FUNCTION Insert(node, v)
  IF node = NULL THEN RETURN NewNode(v)
  IF v < node.value THEN node.left ← Insert(node.left, v)
  ELSE IF v > node.value THEN node.right ← Insert(node.right, v)
  // v = node.value → dublikat: injorohet
  RETURN node

FUNCTION Search(node, v)
  WHILE node ≠ NULL AND node.value ≠ v DO
      node ← (v < node.value) ? node.left : node.right
  RETURN node                            // NULL nëse s'ekziston

FUNCTION Delete(node, v)
  IF node = NULL THEN RETURN NULL
  IF v < node.value THEN node.left ← Delete(node.left, v)
  ELSE IF v > node.value THEN node.right ← Delete(node.right, v)
  ELSE                                   // gjetëm nyjen për t'u fshirë
      IF node.left = NULL THEN RETURN node.right       // 0 ose 1 fëmijë
      IF node.right = NULL THEN RETURN node.left
      succ ← MIN(node.right)             // pasardhësi në renditje (2 fëmijë)
      node.value ← succ.value
      node.right ← Delete(node.right, succ.value)
  RETURN node

// TRAVERSIMI: In-order (L, Rrënja, R) jep vlerat të renditura; Pre-order: Rrënja, L, R; Post-order: L, R, Rrënja
// KOMPLEKSITETI: O(h), h = lartësia → O(log n) për pemë të balancuar, O(n) kur degjeneron në listë`,

    dijkstra: `ALGORITHM Dijkstra(G, source)         // pesha jo-negative!
  // IDEJA: zgjero gjithmonë nyjen e pavizituar me distancën më të vogël (lakmitar)
  // INVARIANTI: kur një nyje vizitohet, dist[] i saj është rruga më e shkurtër e saktë
  FOR EACH v IN G.nodes DO
      dist[v] ← ∞;  prev[v] ← NULL
  END FOR
  dist[source] ← 0
  visited ← {}
  WHILE ekziston nyje e pavizituar me dist < ∞ DO
      u ← nyja e pavizituar me dist[u] më të vogël
      visited ← visited ∪ {u}
      FOR EACH (u, v, w) IN G.edges(u) DO          // w = pesha e lidhjes
          IF dist[u] + w < dist[v] THEN            // RELAKSIM
              dist[v] ← dist[u] + w
              prev[v] ← u
          END IF
      END FOR
  END WHILE
  RETURN dist, prev
END ALGORITHM

// RRUGA drejt nyjes t: ndiq prev[t], prev[prev[t]], … deri te source dhe përmbysi
// KOMPLEKSITETI: O(V²) me varg; O((V + E) log V) me radhë prioriteti (heap); hapësira O(V)`,

    kruskal: `ALGORITHM Kruskal(G)                   // pema minimale shtrirëse (MST)
  // IDEJA: merr lidhjet nga më e lira, pranoje vetëm nëse nuk krijon cikël
  // INVARIANTI: lidhjet e pranuara formojnë një pyll pa cikle me peshë minimale
  mst ← {}
  FOR EACH v IN G.nodes DO MakeSet(v)             // çdo nyje në grupin e vet
  SORT G.edges sipas peshës rritës
  FOR EACH (u, v, w) IN G.edges DO
      IF Find(u) ≠ Find(v) THEN                   // nyje në komponentë të ndryshëm
          mst ← mst ∪ {(u, v, w)}
          Union(u, v)                             // bashko dy komponentët
      ELSE
          // Find(u) = Find(v): lidhja do të krijonte cikël → refuzohet
      END IF
      IF |mst| = |G.nodes| - 1 THEN BREAK         // pema është e plotë
  END FOR
  RETURN mst
END ALGORITHM

// UNION-FIND: Find me kompresim të shtegut, Union sipas rangut → pothuajse O(1) i amortizuar
// KOMPLEKSITETI: O(E log E) — mbizotëron renditja; nëse grafi s'është i lidhur, rezultati është pyll`,

    stack: `STRUCTURE Stack { items[], top }       // LIFO: i fundit që hyn, i pari që del
// INVARIANTI: top tregon elementin e fundit të futur; top = -1 kur stiva është boshe

PROCEDURE Push(x)
  IF top = capacity - 1 THEN ERROR "stack overflow"   // vetëm te implementimi me varg fiks
  top ← top + 1
  items[top] ← x

FUNCTION Pop()
  IF IsEmpty() THEN ERROR "stack underflow"          // gabimi më i zakonshëm
  x ← items[top]
  top ← top - 1
  RETURN x

FUNCTION Peek()
  IF IsEmpty() THEN ERROR "stack bosh"
  RETURN items[top]                     // shikon pa hequr

FUNCTION IsEmpty()
  RETURN top = -1

// KOMPLEKSITETI: Push, Pop, Peek, IsEmpty — të gjitha O(1); hapësira O(n)
// PËRDORIM: kllapat e balancuara → Push për "(", Pop për ")"; boshe në fund = e balancuar`,

    queue: `STRUCTURE Queue { items[], head, tail, size }   // FIFO: i pari që hyn, i pari që del
// INVARIANTI: elementët janë te items[head .. head+size-1] (modulo capacity)

PROCEDURE Enqueue(x)
  IF size = capacity THEN ERROR "radha e mbushur"
  items[(head + size) MOD capacity] ← x       // shto në FUND
  size ← size + 1

FUNCTION Dequeue()
  IF size = 0 THEN ERROR "radha bosh"
  x ← items[head]
  head ← (head + 1) MOD capacity              // qark: s'zhvendos asnjë element
  size ← size - 1
  RETURN x

FUNCTION Peek()
  IF size = 0 THEN ERROR "radha bosh"
  RETURN items[head]

// KOMPLEKSITETI: O(1) për të tria; hapësira O(n)
// KUJDES: me varg të thjeshtë dhe heqje nga indeksi 0, Dequeue do të zhvendoste gjithçka → O(n)
//   Prandaj përdoret buffer qarkor (si më sipër) ose listë e lidhur me tregues head/tail`,

    linkedlist: `STRUCTURE Node { value, next }
STRUCTURE LinkedList { head }           // lista bosh: head = NULL
// IDEJA: çdo nyje mban vlerën dhe një referencë te nyja tjetër; s'ka memorie të vazhdueshme
// INVARIANTI: nga head, duke ndjekur next, arrihen të gjitha nyjet një herë dhe mbarohet me NULL

PROCEDURE InsertAtHead(v)               // O(1)
  n ← NewNode(v);  n.next ← head;  head ← n

PROCEDURE InsertAtTail(v)               // O(n) pa tregues tail
  n ← NewNode(v)
  IF head = NULL THEN head ← n; RETURN
  cur ← head
  WHILE cur.next ≠ NULL DO cur ← cur.next
  cur.next ← n

FUNCTION Search(v)                      // O(n)
  cur ← head
  WHILE cur ≠ NULL AND cur.value ≠ v DO cur ← cur.next
  RETURN cur                            // NULL nëse s'ekziston

PROCEDURE Delete(v)
  IF head = NULL THEN RETURN
  IF head.value = v THEN head ← head.next; RETURN
  prev ← head
  WHILE prev.next ≠ NULL AND prev.next.value ≠ v DO prev ← prev.next
  IF prev.next ≠ NULL THEN prev.next ← prev.next.next   // anashkalo nyjen
  // KUJDES: ndrysho prev.next PARA se të humbasësh referencën te nyja tjetër

// KOMPLEKSITETI: futje në head O(1); kërkim/fshirje/futje në fund O(n); hapësira O(n)
// Ndryshe nga vargu: s'ka qasje direkte te pozicioni i-të`,

    hashmap: `STRUCTURE HashMap { buckets[0..m-1] }  // çdo kovë = listë e lidhur (zinxhir)
// INVARIANTI: çifti (key, value) ndodhet gjithmonë në kovën buckets[Hash(key)]

FUNCTION Hash(key)
  sum ← 0
  FOR EACH ch IN key DO sum ← sum + kodi(ch)
  RETURN sum MOD m                      // indeksi i kovës

PROCEDURE Put(key, value)
  b ← Hash(key)
  FOR EACH entry IN buckets[b] DO
      IF entry.key = key THEN entry.value ← value; RETURN   // përditëso ekzistuesin
  END FOR
  buckets[b].addFirst((key, value))     // çelës i ri: futet në fillim të zinxhirit

FUNCTION Get(key)
  FOR EACH entry IN buckets[Hash(key)] DO
      IF entry.key = key THEN RETURN entry.value
  RETURN NULL

PROCEDURE Remove(key)
  hiq entry-n me çelës = key nga buckets[Hash(key)]

// PËRPLASJA: dy çelësa → e njëjta kovë; zinxhiri i mban të dy (kërkimi kalon nëpër zinxhir)
// KOMPLEKSITETI: mesatar O(1) kur zinxhirët janë të shkurtër (load factor n/m i vogël);
//   më i keqi O(n) kur gjithçka bie në një kovë; zakonisht rihashohet kur n/m kalon ~0.75`,
};

/** Kthen pseudokodin e thelluar për një çelës, ose null nëse nuk ekziston. */
function getPseudocode(key) {
    return (getLang() === 'en' ? PSEUDO_EN : PSEUDO)[key] || null;
}

export { PSEUDO, getPseudocode };
