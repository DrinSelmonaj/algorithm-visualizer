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
            yield {
                type: 'compare', indices: [j, minIdx], javaLine: 7,
                message: `Krahasojmë arr[${j}]=${arr[j]} me minIdx aktual arr[${minIdx}]=${arr[minIdx]}.`
            };
            if (arr[j] < arr[minIdx]) minIdx = j;
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            yield {
                type: 'swap', indices: [i, minIdx], state: [...arr], javaLine: 12,
                message: `Minimumi ${arr[i]} u gjet te indeksi ${minIdx} — ndërrojmë me arr[${i}].`
            };
        }

        yield { type: 'sorted', index: i, javaLine: 4, message: `arr[${i}]=${arr[i]} është në vendin përfundimtar.` };
    }

    yield { type: 'sorted', index: n - 1, message: `arr[${n - 1}]=${arr[n - 1]} është në vendin përfundimtar. Renditja përfundoi.` };
}

export { selectionSort, JAVA_SOURCE };