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

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        yield { type: 'compare', indices: [mid], javaLine: 5 };

        if (arr[mid] === target) {
            yield { type: 'found', indices: [mid], javaLine: 6 };
            return;
        }

        if (arr[mid] < target) {
            yield { type: 'compare', indices: [mid], javaLine: 7 };
            low = mid + 1;
        } else {
            yield { type: 'compare', indices: [mid], javaLine: 8 };
            high = mid - 1;
        }
    }

    yield { type: 'compare', indices: [], javaLine: 10, message: `${target} nuk u gjet.` };
}

export { binarySearch, JAVA_SOURCE };