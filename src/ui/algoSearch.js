// src/ui/algoSearch.js
// Kërkim funksional mbi listën e algoritmeve (sidebar) — filtron .algo-btn
// sipas tekstit të shkruar, fsheh grupet <details> pa asnjë rezultat, dhe i
// hap automatikisht grupet që kanë rezultate gjatë kërkimit (rikthehen te
// gjendja e tyre origjinale open/closed kur kërkimi pastrohet).

function initAlgoSearch() {
    const input = document.getElementById('algo-search-input');
    const emptyMsg = document.getElementById('algo-search-empty');
    if (!input) return;

    const groups = [...document.querySelectorAll('.algo-group')];
    // Ruajmë gjendjen origjinale open/closed e çdo grupi (Kërkim mbyllur,
    // Renditje hapur, etj.) — rikthehet kur kërkimi pastrohet.
    const originalOpenState = new Map(groups.map(g => [g, g.open]));

    input.addEventListener('input', () => {
        const query = normalize(input.value.trim());
        let anyVisible = false;

        groups.forEach(group => {
            const buttons = [...group.querySelectorAll('.algo-btn')];
            let groupHasMatch = false;

            buttons.forEach(btn => {
                const label = normalize(btn.querySelector('span')?.textContent || '');
                const matches = !query || label.includes(query);
                btn.classList.toggle('algo-btn--hidden', !matches);
                if (matches) groupHasMatch = true;
            });

            group.classList.toggle('algo-group--hidden', !groupHasMatch);
            if (groupHasMatch) anyVisible = true;

            if (query) {
                if (groupHasMatch) group.open = true;
            } else {
                group.open = originalOpenState.get(group);
            }
        });

        if (emptyMsg) {
            emptyMsg.classList.toggle('algo-search-empty--visible', query !== '' && !anyVisible);
        }
    });

    // Escape brenda fushës — pastron kërkimin shpejt
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            input.value = '';
            input.dispatchEvent(new Event('input'));
            input.blur();
        }
    });
}

// Normalizim i thjeshtë — lowercase + heqje e diakritikave shqipe bazike (ë,
// ç), që kërkimi të punojë pavarësisht si i shkruan përdoruesi (p.sh. "kerko"
// gjen "Binary Search" edhe pa germën ë të tastierës shqip).
function normalize(str) {
    return str
        .toLowerCase()
        .replace(/ë/g, 'e')
        .replace(/ç/g, 'c');
}

export { initAlgoSearch };
