import { t } from '../i18n/index.js';
const COMPARABLE = ['bubble', 'insertion', 'selection', 'merge', 'quick', 'shell', 'heap', 'radix', 'linear', 'binary'];

function initCompareMode(registry, getArray) {
    const modal = document.getElementById('compare-modal');
    const selects = [document.getElementById('compare-a'), document.getElementById('compare-b')];
    const options = COMPARABLE.map(key => `<option value="${key}">${registry[key].name}</option>`).join('');
    selects.forEach(select => { if (select) select.innerHTML = options; });
    if (selects[1]) selects[1].value = 'quick';

    document.getElementById('btn-compare-open')?.addEventListener('click', () => { modal.hidden = false; });
    document.getElementById('btn-compare-close')?.addEventListener('click', () => { modal.hidden = true; });
    modal?.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
    document.getElementById('btn-compare-run')?.addEventListener('click', () => {
        const array = getArray();
        const sorted = [...array].sort((a, b) => a - b);
        // I njëjti target për të dy algoritmet (elementi i mesit të array-it të renditur)
        const target = sorted[Math.floor(sorted.length / 2)];
        selects.forEach((select, index) => {
            const key = select.value;
            // Binary Search kërkon array të renditur
            const input = key === 'binary' ? sorted : array;
            renderResult(index, inspect(registry[key], input, target));
        });
    });
}

function inspect(algo, array, target) {
    const generator = algo.gen([...array], target);
    const metrics = { name: algo.name, steps: 0, comparisons: 0, writes: 0 };
    for (const step of generator) {
        metrics.steps++;
        if (step.type === 'compare' && step.real !== false) metrics.comparisons++;
        if (step.type === 'swap' || step.type === 'overwrite') metrics.writes++;
    }
    return metrics;
}

function renderResult(index, result) {
    const card = document.querySelectorAll('.compare-result')[index];
    if (!card) return;
    card.removeAttribute('data-i18n');   // s'është më tekst udhëzues — mos e mbishkruaj kur ndërron gjuha
    card.innerHTML = `<h4>${result.name}</h4><div class="compare-track"><i style="--score:${Math.min(result.steps, 100)}%"></i></div><dl><div><dt>${t('cmp.steps')}</dt><dd>${result.steps}</dd></div><div><dt>${t('ui.statCompare')}</dt><dd>${result.comparisons}</dd></div><div><dt>${t('cmp.writes')}</dt><dd>${result.writes}</dd></div></dl>`;
}

export { initCompareMode };
