// src/algorithms/searching/linear.js

const JAVA_SOURCE =
`public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }
}`;

function* linearSearch(array, target) {
    const arr = [...array];

    yield { type: 'info', message: `Kërkojmë: ${target}` };

    for (let i = 0; i < arr.length; i++) {
        yield { type: 'compare', indices: [i], javaLine: 3 };
        if (arr[i] === target) {
            yield { type: 'found', indices: [i], javaLine: 4, message: `${target} u gjet në indeksin ${i}.` };
            return;
        }
    }

    yield { type: 'compare', indices: [], javaLine: 6, message: `${target} nuk u gjet.` };
}

export { linearSearch, JAVA_SOURCE };