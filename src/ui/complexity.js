// src/ui/complexity.js
// Shfaq complexity badges (Time/Space) për algoritmin aktiv.

const COMPLEXITY = {
    bubble:     { time: 'O(n²)',      space: 'O(1)'    },
    insertion:  { time: 'O(n²)',      space: 'O(1)'    },
    selection:  { time: 'O(n²)',      space: 'O(1)'    },
    merge:      { time: 'O(n log n)', space: 'O(n)'    },
    quick:      { time: 'O(n log n)', space: 'O(log n)'},
    shell:      { time: 'O(n log n)', space: 'O(1)'    },
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
    if (timeEl)  timeEl.textContent  = `Time: ${data.time}`;
    if (spaceEl) spaceEl.textContent = `Space: ${data.space}`;
}

export { showComplexity };