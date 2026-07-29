// src/algorithms/sorting/bubble.js

const JAVA_SOURCE =
`public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j]     = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`;

function* bubbleSort(array) {
    const arr = [...array];
    const n   = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Krahasim — animator e ngjyros çiftin
            yield {
                type: 'compare', indices: [j, j + 1], javaLine: 6,
                message: `Krahasojmë arr[${j}]=${arr[j]} me arr[${j + 1}]=${arr[j + 1]}.`
            };

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                // Ndërrrim — animator e bën swap-in vizual
                yield {
                    type: 'swap', indices: [j, j + 1], state: [...arr], javaLine: 9,
                    message: `${arr[j + 1]} > ${arr[j]} — ndërrojmë arr[${j}] me arr[${j + 1}].`
                };
            }
        }
        // Elementi i fundit i pasit është në pozicionin e tij final
        yield {
            type: 'sorted', index: n - i - 1, javaLine: 4,
            message: `arr[${n - i - 1}]=${arr[n - i - 1]} është në vendin përfundimtar.`
        };
    }

    yield { type: 'sorted', index: 0, message: `arr[0]=${arr[0]} është në vendin përfundimtar. Renditja përfundoi.` };
}

export { bubbleSort, JAVA_SOURCE };