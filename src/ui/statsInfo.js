// src/ui/statsInfo.js — butoni "i" te statistikat: hap/mbyll një panel me shpjegimet e
// Krahasimeve, Ndërrimeve/Shkrimeve, Hapit dhe Hapave logjikë.

function initStatsInfo() {
    const btn = document.getElementById('btn-stats-info');
    const pop = document.getElementById('stats-info-popover');
    const closeBtn = document.getElementById('btn-stats-info-close');
    if (!btn || !pop) return;

    function place() {
        const r = btn.getBoundingClientRect();
        const w = Math.min(380, window.innerWidth - 24);
        pop.style.width = `${w}px`;
        const left = Math.max(12, Math.min(window.innerWidth - w - 12, r.right - w));
        pop.style.left = `${left}px`;
        // sipër butonit; nëse nuk ka vend, poshtë tij
        const h = pop.offsetHeight;
        const top = r.top - h - 10 >= 8 ? r.top - h - 10 : Math.min(window.innerHeight - h - 8, r.bottom + 10);
        pop.style.top = `${Math.max(8, top)}px`;
    }
    function open() {
        pop.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        place();
    }
    function close() {
        pop.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', e => { e.stopPropagation(); pop.hidden ? open() : close(); });
    closeBtn?.addEventListener('click', close);
    document.addEventListener('click', e => { if (!pop.hidden && !pop.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) { close(); btn.focus(); } });
    window.addEventListener('resize', () => { if (!pop.hidden) place(); });
}

export { initStatsInfo };
