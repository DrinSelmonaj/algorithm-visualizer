// src/algorithms/sorting/radix.js

const JAVA_SOURCE =
`public class RadixSort {
    public static void sort(int[] arr) {
        int max = Arrays.stream(arr).max().getAsInt();
        for (int exp = 1; max/exp > 0; exp *= 10)
            countSort(arr, exp);
    }

    static void countSort(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];
        int[] count  = new int[10];
        for (int i = 0; i < n; i++)
            count[(arr[i]/exp)%10]++;
        for (int i = 1; i < 10; i++)
            count[i] += count[i-1];
        for (int i = n-1; i >= 0; i--)
            output[--count[(arr[i]/exp)%10]] = arr[i];
        for (int i = 0; i < n; i++)
            arr[i] = output[i];
    }
}`;

function* radixSort(array) {
    const arr = [...array];
    const max = Math.max(...arr);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        yield* countingSort(arr, exp);
    }

    for (let i = 0; i < arr.length; i++) {
        yield { type: 'sorted', index: i };
    }
}

function* countingSort(arr, exp) {
    const n      = arr.length;
    const output = new Array(n).fill(0);
    const count  = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
        // real: false — Radix nuk krahason, shfaq vetëm elementin aktiv
        yield { type: 'compare', real: false, indices: [i], javaLine: 11 };
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[--count[digit]] = arr[i];
        yield { type: 'compare', real: false, indices: [i], javaLine: 15 };
    }

    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        const maxVal = Math.max(...arr);
        yield { type: 'overwrite', index: i, value: arr[i],
                state: [...arr], maxValue: maxVal, javaLine: 17 };
    }
}

export { radixSort, JAVA_SOURCE };