import { t } from '../../i18n/index.js';
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

    yield { type: 'info', message: t('m.binary.1', { p0: target }) };

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        yield { type: 'compare', indices: [mid], javaLine: 5, message: t('m.binary.2', { p0: mid, p1: mid, p2: arr[mid], p3: target }) };

        if (arr[mid] === target) {
            yield { type: 'found', indices: [mid], javaLine: 6, message: t('m.binary.3', { p0: target, p1: mid }) };
            return;
        }

        if (arr[mid] < target) {
            yield { type: 'compare', indices: [mid], javaLine: 7, message: t('m.binary.4', { p0: arr[mid], p1: target }) };
            low = mid + 1;
        } else {
            yield { type: 'compare', indices: [mid], javaLine: 8, message: t('m.binary.5', { p0: arr[mid], p1: target }) };
            high = mid - 1;
        }
    }

    yield { type: 'compare', indices: [], javaLine: 10, message: t('m.binary.6', { p0: target }) };
}

export { binarySearch, JAVA_SOURCE };