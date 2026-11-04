import { t } from '../../i18n/index.js';
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

    yield { type: 'info', message: t('m.linear.1', { p0: target }) };

    for (let i = 0; i < arr.length; i++) {
        yield { type: 'compare', unit: true, indices: [i], javaLine: 3, message: t('m.linear.2', { p0: i, p1: arr[i], p2: target }) };
        if (arr[i] === target) {
            yield { type: 'found', indices: [i], javaLine: 4, message: t('m.linear.3', { p0: target, p1: i }) };
            return;
        }
    }

    yield { type: 'compare', indices: [], javaLine: 6, message: t('m.linear.4', { p0: target }) };
}

export { linearSearch, JAVA_SOURCE };