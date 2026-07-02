// src/algorithms/sorting/insertion.js

const JAVA_SOURCE =
`public class InsertionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j   = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`;

function* insertionSort(array) {
    const arr = [...array];
    const n   = arr.length;

    // Elementi i parë konsiderohet i renditur
    yield { type: 'sorted', index: 0, javaLine: 3 };

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        yield { type: 'compare', indices: [i, j], javaLine: 5 };

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            yield { type: 'overwrite', index: j + 1, value: arr[j], state: [...arr], javaLine: 8 };
            j--;
            if (j >= 0) yield { type: 'compare', indices: [i, j], javaLine: 7 };
        }

        arr[j + 1] = key;
        yield { type: 'overwrite', index: j + 1, value: key, state: [...arr], javaLine: 10 };
        yield { type: 'sorted', index: i, javaLine: 10 };
    }
}

export { insertionSort, JAVA_SOURCE };