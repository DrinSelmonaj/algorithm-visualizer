import { t } from '../../i18n/index.js';
// src/algorithms/sorting/heap.js

const JAVA_SOURCE =
`public class HeapSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = n/2 - 1; i >= 0; i--)
            heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    static void heapify(int[] arr, int n, int i) {
        int largest = i, l = 2*i+1, r = 2*i+2;
        if (l < n && arr[l] > arr[largest]) largest = l;
        if (r < n && arr[r] > arr[largest]) largest = r;
        if (largest != i) {
            int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
            heapify(arr, n, largest);
        }
    }
}`;

function* heapSort(array) {
    const arr = [...array];
    const n   = arr.length;

    // Ndërtojmë max-heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i);
    }

    // Nxjerrim elementet një nga një nga heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        yield {
            type: 'swap', indices: [0, i], state: [...arr], javaLine: 7,
            message: t('m.heap.1', { p0: arr[i], p1: i })
        };
        yield { type: 'sorted', index: i, message: t('m.heap.2', { p0: i, p1: arr[i] }) };
        yield* heapify(arr, i, 0);
    }

    yield { type: 'sorted', index: 0, message: t('m.heap.3', { p0: arr[0] }) };
}

function* heapify(arr, n, i) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) yield {
        type: 'compare', indices: [l, largest], javaLine: 13,
        message: t('m.heap.4', { p0: l, p1: arr[l], p2: largest, p3: arr[largest] })
    };
    if (l < n && arr[l] > arr[largest]) largest = l;

    if (r < n) yield {
        type: 'compare', indices: [r, largest], javaLine: 14,
        message: t('m.heap.5', { p0: r, p1: arr[r], p2: largest, p3: arr[largest] })
    };
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield {
            type: 'swap', indices: [i, largest], state: [...arr], javaLine: 16,
            message: t('m.heap.6', { p0: largest, p1: i })
        };
        yield* heapify(arr, n, largest);
    }
}

export { heapSort, JAVA_SOURCE };