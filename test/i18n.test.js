import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SQ } from '../src/i18n/sq.js';
import { EN } from '../src/i18n/en.js';
import { t, setLang, getLang, languages } from '../src/i18n/index.js';
import { BASE, getLearningData } from '../src/ui/learningData.js';
import { BASE_EN, OPERATIONS_EN } from '../src/ui/learningData.en.js';
import { MORE_EN, REAL_EN, TECH_EN } from '../src/ui/learningMore.en.js';
import { TRAIT_INFO_EN } from '../src/ui/learningTraits.en.js';
import { PSEUDO, getPseudocode } from '../src/ui/pseudocode.js';
import { PSEUDO_EN } from '../src/ui/pseudocode.en.js';
import { bubbleSort } from '../src/algorithms/sorting/bubble.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const words = text => String(text).split(/\s+/).filter(Boolean).length;
const placeholders = text => (text.match(/\{\w+\}/g) || []).sort().join(',');
const ALBANIAN_LETTERS = /[ëçËÇ]/;

function sourceFiles(dir, out = []) {
    for (const name of readdirSync(dir)) {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) sourceFiles(path, out);
        else if (name.endsWith('.js')) out.push(path);
    }
    return out;
}

test('shqip dhe anglisht kanë të njëjtët çelësa', () => {
    assert.deepEqual(languages().sort(), ['en', 'sq']);
    const sq = Object.keys(SQ).sort(), en = Object.keys(EN).sort();
    assert.deepEqual(sq.filter(k => !(k in EN)), [], 'çelësa që mungojnë në anglisht');
    assert.deepEqual(en.filter(k => !(k in SQ)), [], 'çelësa që mungojnë në shqip');
    assert.ok(sq.length > 300, `fjalor i vogël: ${sq.length}`);
});

test('çdo çelës ka të njëjtat parametra {…} në të dyja gjuhët', () => {
    for (const key of Object.keys(SQ)) {
        assert.equal(placeholders(SQ[key]), placeholders(EN[key]), `parametra të ndryshëm te ${key}`);
    }
});

test('asnjë tekst anglisht nuk përmban shkronja shqipe (ë, ç)', () => {
    const offenders = [];
    for (const [key, text] of Object.entries(EN)) if (ALBANIAN_LETTERS.test(text)) offenders.push(key);
    const content = { ...BASE_EN, ...OPERATIONS_EN, ...MORE_EN, ...REAL_EN, ...TECH_EN, ...TRAIT_INFO_EN, ...PSEUDO_EN };
    for (const [key, value] of Object.entries(content)) if (ALBANIAN_LETTERS.test(JSON.stringify(value))) offenders.push('content:' + key);
    assert.deepEqual(offenders, []);
});

test('çdo çelës i përdorur në kod ekziston në fjalor', () => {
    const files = [...sourceFiles(join(ROOT, 'src')), join(ROOT, 'main.js')].filter(f => !f.includes('/i18n/'));
    const used = new Map();
    for (const file of files) {
        const text = readFileSync(file, 'utf8');
        for (const m of text.matchAll(/'((?:m|ui|js|ds|graph|dist|hash|cmp|cx|learn)\.[A-Za-z0-9_.]+)'/g)) used.set(m[1], file);
    }
    const missing = [...used].filter(([key]) => !(key in SQ)).map(([key, file]) => `${key} (${file.replace(ROOT, '')})`);
    assert.deepEqual(missing, []);
    assert.ok(used.size > 100, `u gjetën vetëm ${used.size} çelësa në kod`);
});

test('çdo data-i18n te index.html ka çelës në të dyja gjuhët', () => {
    const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
    const keys = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]));
    for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
        m[1].split(';').forEach(pair => { const key = pair.split(':')[1]?.trim(); if (key) keys.add(key); });
    }
    assert.ok(keys.size > 70);
    for (const key of keys) {
        assert.ok(key in SQ && key in EN, `mungon çelësi ${key}`);
    }
});

test('përmbajtja mësimore angleze është e plotë dhe ka të njëjtat kufij si shqipja', () => {
    assert.deepEqual(Object.keys(BASE_EN).sort(), Object.keys(BASE).sort());
    assert.deepEqual(Object.keys(OPERATIONS_EN).sort(), ['bst', 'hashmap', 'linkedlist', 'queue', 'stack']);
    const traitNames = new Set();
    for (const key of Object.keys(BASE)) {
        const sqRow = BASE[key], enRow = BASE_EN[key];
        assert.deepEqual(enRow.slice(3, 7), sqRow.slice(3, 7), `${key}: kompleksitetet duhen të jenë njësoj`);
        assert.equal(enRow[7].length, sqRow[7].length, `${key}: numri i karakteristikave`);
        enRow[7].forEach(trait => traitNames.add(trait));
        assert.ok(enRow[0], `${key}: titull bosh`);
        [enRow[1], enRow[2]].forEach(text => assert.ok(text && text.length > 8, `${key}: tekst bosh`));

        const more = words(MORE_EN[key].join(' '));
        assert.ok(more >= 50 && more <= 200, `${key}: MORE_EN ka ${more} fjalë`);
        assert.equal(REAL_EN[key].length, 3, `${key}: duhen 3 shembuj`);
        const uses = words([TECH_EN[key], ...REAL_EN[key]].join(' '));
        assert.ok(uses >= 50 && uses <= 200, `${key}: "Uses" ka ${uses} fjalë`);

        const lines = PSEUDO_EN[key].split('\n');
        assert.ok(lines.length >= 12, `${key}: pseudokodi EN shumë i shkurtër`);
        assert.ok(/COMPLEXITY/.test(PSEUDO_EN[key]), `${key}: pseudokod EN pa kompleksitet`);
        assert.ok(/IDEA|INVARIANT/.test(PSEUDO_EN[key]), `${key}: pseudokod EN pa ide/invariant`);
        assert.ok(Math.abs(lines.length - PSEUDO[key].split('\n').length) <= 3, `${key}: pseudokodi EN dhe SQ duhet të kenë gjatësi të ngjashme`);
    }
    for (const trait of traitNames) {
        assert.ok(TRAIT_INFO_EN[trait] && words(TRAIT_INFO_EN[trait]) >= 15, `mungon shpjegimi EN për ${trait}`);
    }
});

test('ndërrimi i gjuhës ndryshon tekstet, mesazhet e algoritmeve dhe materialin', () => {
    assert.equal(getLang(), 'sq');
    const firstSq = bubbleSort([3, 1, 2]).next().value.message;
    assert.match(firstSq, /Krahasojmë/);
    assert.equal(getLearningData('binary').title, 'Binary Search');
    assert.match(getLearningData('stack').summary, /Strukturë LIFO/);
    assert.match(getPseudocode('bubble'), /"ngjiten" drejt fundit/);

    setLang('en');
    try {
        assert.equal(getLang(), 'en');
        assert.equal(t('ui.run'), 'Run');
        assert.equal(t('js.searching', { target: 7 }), 'Searching for the value 7.');
        const firstEn = bubbleSort([3, 1, 2]).next().value.message;
        assert.match(firstEn, /Compare arr\[0\]=3 with arr\[1\]=1\./);
        assert.match(getLearningData('stack').summary, /LIFO structure/);
        assert.equal(getLearningData('bst').operations[0][0], 'Search');
        assert.match(getLearningData('quick').quiz.question, /What is the average complexity of Quick Sort\?/);
        assert.match(getPseudocode('bubble'), /bubble up/);
        assert.equal(t('çelës.që.nuk.ekziston'), 'çelës.që.nuk.ekziston');   // mungesa shfaqet si çelës
    } finally {
        setLang('sq');
    }
    assert.equal(getLang(), 'sq');
    assert.equal(t('ui.run'), 'Ekzekuto');
});

test('pa asnjë tekst të ngulitur shqip te thirrjet e t() me parametra që mungojnë', () => {
    // parametri që mungon lihet {emri} në vend që të hedhë gabim
    assert.equal(t('js.searching', {}), 'Po kërkojmë vlerën {target}.');
});
