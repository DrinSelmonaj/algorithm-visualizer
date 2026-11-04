// src/ui/algoSearch.js
// Kërkim funksional mbi listën e algoritmeve (sidebar) — filtron .algo-btn
// sipas tekstit të shkruar, fsheh grupet <details> pa asnjë rezultat, dhe i
// hap automatikisht grupet që kanë rezultate gjatë kërkimit (rikthehen te
// gjendja e tyre origjinale open/closed kur kërkimi pastrohet).

function initAlgoSearch() {
    const input = document.getElementById('algo-search-input');
    const emptyMsg = document.getElementById('algo-search-empty');
    const clearButton = document.getElementById('algo-search-clear');
    if (!input) return;

    const groups = [...document.querySelectorAll('.algo-group')];
    // Gjendja open/closed e grupeve ruhet në çastin kur fillon kërkimi (jo vetëm kur
    // ngarkohet faqja), që rubrikat që përdoruesi i ka hapur vetë të rikthehen ashtu.
    let savedOpenState = null;

    input.addEventListener('input', () => {
        const query = normalize(input.value.trim());
        let anyVisible = false;

        if (query && !savedOpenState) savedOpenState = new Map(groups.map(g => [g, g.open]));

        groups.forEach(group => {
            const buttons = [...group.querySelectorAll('.algo-btn')];
            const groupLabel = normalize(group.querySelector('.algo-group-title span')?.textContent || '');
            let groupHasMatch = false;

            buttons.forEach(btn => {
                const searchableText = normalize([
                    btn.querySelector('span')?.textContent || '',
                    btn.dataset.algorithm || '',
                    btn.dataset.category || '',
                    groupLabel,
                ].join(' '));
                const matches = !query || searchableText.includes(query);
                btn.classList.toggle('algo-btn--hidden', !matches);
                if (matches) groupHasMatch = true;
            });

            group.classList.toggle('algo-group--hidden', !groupHasMatch);
            if (groupHasMatch) anyVisible = true;

            if (query) {
                if (groupHasMatch) group.open = true;
            } else {
                group.open = savedOpenState?.get(group) ?? group.open;
            }
        });
        if (!query) savedOpenState = null;

        if (emptyMsg) {
            emptyMsg.classList.toggle('algo-search-empty--visible', query !== '' && !anyVisible);
        }
        if (clearButton) clearButton.hidden = query === '';
    });

    const clearSearch = () => {
        input.value = '';
        input.dispatchEvent(new Event('input'));
        input.focus();
    };

    clearButton?.addEventListener('click', clearSearch);

    // Escape brenda fushës — pastron kërkimin shpejt
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearSearch();
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
