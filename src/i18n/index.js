// src/i18n/index.js
// Përkthimi shqip/anglisht: fjalor i sheshtë me çelësa, interpolim {param}, dhe
// përkthim i atributeve data-i18n* te HTML-ja statike. Gjuha ruhet në localStorage
// dhe mund të detyrohet me ?lang=en. Moduli punon edhe në Node (pa DOM) për testet.

import { SQ } from './sq.js';
import { EN } from './en.js';

const DICTS = { sq: SQ, en: EN };
const STORAGE_KEY = 'algopro-lang';
const DEFAULT_LANG = 'sq';

const listeners = new Set();
let current = detectLang();

function detectLang() {
    try {
        const fromUrl = new URLSearchParams(globalThis.location?.search || '').get('lang');
        if (fromUrl && DICTS[fromUrl]) return fromUrl;
    } catch { /* pa URL */ }
    if (typeof document === 'undefined') return DEFAULT_LANG;   // Node (teste): pa localStorage
    try {
        const saved = globalThis.localStorage?.getItem(STORAGE_KEY);
        if (saved && DICTS[saved]) return saved;
    } catch { /* localStorage i bllokuar */ }
    return DEFAULT_LANG;
}

function getLang() {
    return current;
}

function languages() {
    return Object.keys(DICTS);
}

/**
 * Kthen tekstin për një çelës në gjuhën aktuale. Nëse mungon në anglisht kthehet
 * versioni shqip; nëse mungon fare kthehet vetë çelësi (që të shihet në ekran).
 * @param {string} key
 * @param {Record<string, string|number>} [params]  — zëvendësojnë {emri}
 */
function t(key, params) {
    const text = DICTS[current][key] ?? DICTS[DEFAULT_LANG][key];
    if (text === undefined) return key;
    if (!params) return text;
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
}

/** Përkthen çdo element me data-i18n* brenda `root` (HTML-ja statike). */
function applyStaticTranslations(root = globalThis.document) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    // data-i18n-attr="placeholder:ui.a; aria-label:ui.b; title:ui.c"
    root.querySelectorAll('[data-i18n-attr]').forEach(el => {
        el.dataset.i18nAttr.split(';').map(s => s.trim()).filter(Boolean).forEach(pair => {
            const [attr, key] = pair.split(':').map(s => s.trim());
            if (attr && key) el.setAttribute(attr, t(key));
        });
    });
}

function setLang(lang) {
    if (!DICTS[lang] || lang === current) return;
    current = lang;
    if (typeof document !== 'undefined') {
        try { globalThis.localStorage?.setItem(STORAGE_KEY, lang); } catch { /* ignore */ }
    }
    syncDocument();
    listeners.forEach(callback => callback(lang));
}

/** Vendos <html lang>, titullin, butonat SQ/EN dhe përkthen HTML-në statike. */
function syncDocument() {
    const doc = globalThis.document;
    if (!doc) return;
    doc.documentElement.lang = current;
    doc.title = t('ui.title');
    applyStaticTranslations(doc);
    doc.querySelectorAll('[data-lang-option]').forEach(button => {
        const active = button.dataset.langOption === current;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });
}

/** Regjistron një funksion që thirret kur ndryshon gjuha. */
function onLangChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

/** Lidh butonat [data-lang-option] dhe përkthen faqen një herë në fillim. */
function initI18n() {
    const doc = globalThis.document;
    if (!doc) return;
    doc.querySelectorAll('[data-lang-option]').forEach(button => {
        button.addEventListener('click', () => setLang(button.dataset.langOption));
    });
    syncDocument();
}

export { t, getLang, setLang, languages, onLangChange, initI18n, applyStaticTranslations, DICTS };
