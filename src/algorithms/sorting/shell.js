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
                message: `gap=${gap}. Krahasojmë arr[${j}]=${arr[j]} me arr[${j - gap}]=${arr[j - gap]}.`
            };

            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                yield {
                    type: 'overwrite', index: j, value: arr[j], state: [...arr], javaLine: 9,
                    message: `arr[${j - gap}]=${arr[j]} > ${temp} — zhvendosim te arr[${j}].`
                };
                j -= gap;
                if (j >= gap) yield {
                    type: 'compare', indices: [j, j - gap], javaLine: 8,
                    message: `gap=${gap}. Krahasojmë temp=${temp} me arr[${j - gap}]=${arr[j - gap]}.`
                };
            }

            arr[j] = temp;
            yield {
                type: 'overwrite', index: j, value: temp, state: [...arr], javaLine: 11,
                message: `Vendosim temp=${temp} te arr[${j}].`
            };
        }
    }

    for (let i = 0; i < n; i++) yield { type: 'sorted', index: i, message: `arr[${i}]=${arr[i]} është pjesë e rezultatit të renditur.` };
}

export { shellSort, JAVA_SOURCE };