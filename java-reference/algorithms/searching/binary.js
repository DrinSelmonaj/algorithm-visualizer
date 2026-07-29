// src/algorithms/searching/binary.js

const JAVA_SOURCE =
`public class BinarySearch {
    public static int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target)  low  = mid + 1;
            else                    high = mid - 1;
        }
        return -1;
    }
}`;

function* binarySearch(array, target) {
    const arr = [...array];
    let low = 0, high = arr.length - 1;

    yield { type: 'info', message: `Kërkojmë: ${target}` };

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        yield { type: 'compare', indices: [mid], javaLine: 5, message: `mid=${mid}. Krahasojmë arr[${mid}]=${arr[mid]} me ${target}.` };

        if (arr[mid] === target) {
            yield { type: 'found', indices: [mid], javaLine: 6, message: `${target} u gjet në indeksin ${mid}.` };
            return;
        }

        if (arr[mid] < target) {
            yield { type: 'compare', indices: [mid], javaLine: 7, message: `${arr[mid]} < ${target} — kërkojmë në gjysmën e djathtë.` };
            low = mid + 1;
        } else {
            yield { type: 'compare', indices: [mid], javaLine: 8, message: `${arr[mid]} > ${target} — kërkojmë në gjysmën e majtë.` };
            high = mid - 1;
        }
    }

    yield { type: 'compare', indices: [], javaLine: 10, message: `${target} nuk u gjet.` };
}

export { binarySearch, JAVA_SOURCE };