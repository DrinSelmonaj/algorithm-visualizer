// src/ui/toast.js — njoftime të shkurtra me kohëzgjatje të zgjedhur. Çdo njoftim është një
// element i përhershëm në HTML (#id) që përkthehet sipas çelësit të ruajtur në data-toast-key.
import { t, onLangChange } from '../i18n/index.js';

const timers = new Map();

function showToast(id, key, ms = 3000) {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.toastKey = key;
    el.textContent = t(key);
    el.style.setProperty('--toast-ms', `${ms}ms`);
    el.hidden = false;
    el.classList.remove('theme-toast--show');
    void el.offsetWidth;                      // rifillo animacionin
    el.classList.add('theme-toast--show');
    clearTimeout(timers.get(id));
    timers.set(id, setTimeout(() => hideToast(id), ms));
}

function hideToast(id) {
    const el = document.getElementById(id);
    if (!el) return;
    clearTimeout(timers.get(id));
    el.classList.remove('theme-toast--show');
    el.hidden = true;
}

// Njoftimi që po shfaqet ndërrohet në gjuhën e re kur përdoruesi e ndryshon gjuhën
onLangChange(() => {
    document.querySelectorAll('.theme-toast:not([hidden])').forEach(el => {
        if (el.dataset.toastKey) el.textContent = t(el.dataset.toastKey);
    });
});

export { showToast, hideToast };
