// src/ui/theme.js — tema e errët / e çelët. Zgjedhja ruhet në localStorage ('algopro-theme').
// Ikona e logos lart majtas është butoni. Kur faqja hapet (para se të zgjidhet algoritëm)
// shfaqen njoftime informuese 8 sekonda: një për temën dhe një për gjuhën; zhduken
// më herët nëse përdoruesi zgjedh një algoritëm. Pas ndryshimit të temës njoftimi zgjat 3 s.
import { showToast, hideToast } from './toast.js';

const STORAGE_KEY = 'algopro-theme';
const INTRO_MS = 8000;
const CHANGE_MS = 3000;
const INTRO_IDS = ['theme-toast', 'lang-toast'];

function getTheme() {
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme, persist = true) {
    document.documentElement.dataset.theme = theme;
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', String(theme === 'light'));
    if (persist) {
        try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* localStorage i bllokuar */ }
    }
}

function showIntroHints() {
    showToast('theme-toast', 'ui.themeToast', INTRO_MS);
    showToast('lang-toast', 'ui.langToast', INTRO_MS);
    // Sapo zgjidhet një algoritëm, njoftimet informuese nuk duhen më
    document.addEventListener('click', e => {
        if (e.target.closest?.('[data-algorithm]')) INTRO_IDS.forEach(hideToast);
    }, { once: false, capture: true });
}

function initTheme() {
    applyTheme(getTheme(), false);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const next = getTheme() === 'light' ? 'dark' : 'light';
            applyTheme(next);
            showToast('theme-toast', next === 'light' ? 'ui.themeNowLight' : 'ui.themeNowDark', CHANGE_MS);
        });
    }
    showIntroHints();
}

export { initTheme, getTheme, applyTheme };
