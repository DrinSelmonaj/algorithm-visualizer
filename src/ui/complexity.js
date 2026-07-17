// src/ui/complexity.js
// Shfaq complexity badges (Time/Space) për algoritmin aktiv.

const COMPLEXITY = {
    bubble:     { time: 'O(n²)',      space: 'O(1)'    },
    insertion:  { time: 'O(n²)',      space: 'O(1)'    },
    selection:  { time: 'O(n²)',      space: 'O(1)'    },
    merge:      { time: 'O(n log n)', space: 'O(n)'    },
    quick:      { time: 'O(n log n)', space: 'O(log n)', timeNote: 'Mesatarja: O(n log n). Rasti më i keq (pivot i keq, p.sh. array tashmë i renditur): O(n²).' },
    shell:      { time: 'O(n log n)', space: 'O(1)',     timeNote: 'Varet nga sekuenca e gap-eve. Me gap-e klasike (n/2, n/4...): rasti më i keq O(n²).' },
    heap:       { time: 'O(n log n)', space: 'O(1)'    },
    radix:      { time: 'O(nk)',      space: 'O(n+k)'  },
    linear:     { time: 'O(n)',       space: 'O(1)'    },
    binary:     { time: 'O(log n)',   space: 'O(1)'    },
    bst:        { time: 'O(log n)',   space: 'O(n)'    },
    dijkstra:   { time: 'O(V²)',      space: 'O(V)'    },
    kruskal:    { time: 'O(E log E)', space: 'O(V)'    },
    stack:      { time: 'O(1)',       space: 'O(n)'    },
    queue:      { time: 'O(1)',       space: 'O(n)'    },
    linkedlist: { time: 'O(n)',       space: 'O(n)'    },
    hashmap:    { time: 'O(1)',       space: 'O(n)'    },
};

/**
 * Përditëson badge-t Time/Space për algoritmin aktiv.
 * @param {string} algoKey — çelësi i ALGORITHMS në main.js
 */
function showComplexity(algoKey) {
    const data = COMPLEXITY[algoKey] || { time: '—', space: '—' };
    const timeEl  = document.getElementById('badge-time');
    const spaceEl = document.getElementById('badge-space');

    // timeNote: rasti i rastit-mesatar ndryshon dukshëm nga rasti më i keq (Quick/
    // Shell) — badge-i mbetet kompakt, tregohet '*' + hover tooltip me shpjegimin,
    // në vend që të zgjerojmë vetë pilulën (do thyente stilin Ch.0-3 ekzistues).
    if (timeEl) {
        timeEl.textContent = `Time: ${data.time}${data.timeNote ? ' *' : ''}`;
        if (data.timeNote) timeEl.title = data.timeNote;
        else timeEl.removeAttribute('title');
    }
    if (spaceEl) spaceEl.textContent = `Space: ${data.space}`;
}

export { showComplexity };