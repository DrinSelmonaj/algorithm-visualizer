import { t } from '../../i18n/index.js';
// src/algorithms/sorting/shell.js

const JAVA_SOURCE =
`public class ShellSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int gap = n/2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = arr[i];
                int j    = i;
                while (j >= gap && arr[j - gap] > temp) {
                    arr[j] = arr[j - gap];
                    j     -= gap;
                }
                arr[j] = temp;
            }
        }
    }
}`;

function* shellSort(array) {
    const arr = [...array];
    const n   = arr.length;

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;

            yield {
                type: 'compare', indices: [j, j - gap], javaLine: 8,
                message: t('m.shell.1', { p0: gap, p1: j, p2: arr[j], p3: j - gap, p4: arr[j - gap] })
            };

            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                yield {
                    type: 'overwrite', index: j, value: arr[j], state: [...arr], javaLine: 9,
                    message: t('m.shell.2', { p0: j - gap, p1: arr[j], p2: temp, p3: j })
                };
                j -= gap;
                if (j >= gap) yield {
                    type: 'compare', indices: [j, j - gap], javaLine: 8,
                    message: t('m.shell.3', { p0: gap, p1: temp, p2: j - gap, p3: arr[j - gap] })
                };
            }

            arr[j] = temp;
            yield {
                type: 'overwrite', index: j, value: temp, state: [...arr], javaLine: 11,
                message: t('m.shell.4', { p0: temp, p1: j })
            };
        }
    }

    for (let i = 0; i < n; i++) yield { type: 'sorted', index: i, message: t('m.shell.5', { p0: i, p1: arr[i] }) };
}

export { shellSort, JAVA_SOURCE };