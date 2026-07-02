// src/algorithms/sorting/merge.js

const JAVA_SOURCE =
`public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = (l + r) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }

    static void merge(int[] arr, int l, int m, int r) {
        int[] left  = Arrays.copyOfRange(arr, l, m + 1);
        int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else                     arr[k++] = right[j++];
        }
        while (i < left.length)  arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
}`;

function* mergeSort(array) {
    const arr = [...array];
    yield* mergeSortHelper(arr, 0, arr.length - 1);
    // Shënoji të gjithë si të renditur në fund
    for (let i = 0; i < arr.length; i++) {
        yield { type: 'sorted', index: i };
    }
}

function* mergeSortHelper(arr, l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    yield* mergeSortHelper(arr, l, m);
    yield* mergeSortHelper(arr, m + 1, r);
    yield* merge(arr, l, m, r);
}

function* merge(arr, l, m, r) {
    const left  = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
        yield { type: 'compare', indices: [l + i, m + 1 + j], javaLine: 16 };
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
        yield { type: 'overwrite', index: k - 1, value: arr[k - 1], state: [...arr], javaLine: 16 };
    }

    while (i < left.length) {
        arr[k++] = left[i++];
        yield { type: 'overwrite', index: k - 1, value: arr[k - 1], state: [...arr], javaLine: 18 };
    }

    while (j < right.length) {
        arr[k++] = right[j++];
        yield { type: 'overwrite', index: k - 1, value: arr[k - 1], state: [...arr], javaLine: 19 };
    }
}

export { mergeSort, JAVA_SOURCE };