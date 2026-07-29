// src/algorithms/sorting/quick.js

const JAVA_SOURCE =
`public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i     = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}`;

function* quickSort(array) {
    const arr = [...array];
    yield* quickSortHelper(arr, 0, arr.length - 1);
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'sorted', index: i, message: `arr[${i}]=${arr[i]} është pjesë e rezultatit të renditur.` };
    }
}

function* quickSortHelper(arr, low, high) {
    if (low >= high) {
        if (low === high) yield { type: 'sorted', index: low, message: `arr[${low}]=${arr[low]} — element i vetëm, tashmë i renditur.` };
        return;
    }
    const pi = yield* partition(arr, low, high);
    yield* quickSortHelper(arr, low, pi - 1);
    yield* quickSortHelper(arr, pi + 1, high);
}

function* partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    // Thekso pivot-in
    yield { type: 'pivot', index: high, javaLine: 11, message: `Pivot = arr[${high}] = ${pivot}.` };

    for (let j = low; j < high; j++) {
        yield {
            type: 'compare', indices: [j, high], javaLine: 13,
            message: `Krahasojmë arr[${j}]=${arr[j]} me pivot=${pivot}.`
        };
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            yield {
                type: 'swap', indices: [i, j], state: [...arr], javaLine: 15,
                message: `${arr[j]} ≤ pivot — ndërrojmë arr[${i}] me arr[${j}].`
            };
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    yield {
        type: 'swap', indices: [i + 1, high], state: [...arr], javaLine: 18,
        message: `Vendosim pivot-in ${arr[i + 1]} në pozicionin e tij final ${i + 1}.`
    };
    yield { type: 'sorted', index: i + 1, message: `arr[${i + 1}]=${arr[i + 1]} (pivot) është në vendin përfundimtar.` };

    return i + 1;
}

export { quickSort, JAVA_SOURCE };