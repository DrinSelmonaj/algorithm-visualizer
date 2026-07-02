// src/algorithms/sorting/selection.js

const JAVA_SOURCE =
`public class SelectionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            int temp      = arr[minIdx];
            arr[minIdx]   = arr[i];
            arr[i]        = temp;
        }
    }
}`;

function* selectionSort(array) {
    const arr = [...array];
    const n   = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
            yield { type: 'compare', indices: [j, minIdx], javaLine: 7 };
            if (arr[j] < arr[minIdx]) minIdx = j;
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield { type: 'swap', indices: [i, minIdx], state: [...arr], javaLine: 12 };
        }

        yield { type: 'sorted', index: i, javaLine: 4 };
    }

    yield { type: 'sorted', index: n - 1 };
}

export { selectionSort, JAVA_SOURCE };