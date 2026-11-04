import test from 'node:test';
import assert from 'node:assert/strict';
import { BASE, getLearningData } from '../src/ui/learningData.js';

test('çdo algoritëm dhe strukturë ka material mësimor të plotë', () => {
    assert.equal(Object.keys(BASE).length, 17);

    for (const key of Object.keys(BASE)) {
        const data = getLearningData(key);
        assert.ok(data.title);
        assert.ok(data.summary);
        assert.ok(data.use);
        assert.match(data.best, /^O\(/);
        assert.match(data.average, /^O\(/);
        assert.match(data.worst, /^O\(/);
        assert.match(data.space, /^O\(/);
        assert.ok(data.quiz.options.includes(data.quiz.answer));
    }
});

import { MORE, countMoreWords } from '../src/ui/learningMore.js';

test('çdo element ka shpjegim të zgjeruar 50–200 fjalë', () => {
    assert.deepEqual(Object.keys(MORE).sort(), Object.keys(BASE).sort());
    for (const key of Object.keys(BASE)) {
        const words = countMoreWords(key);
        assert.ok(words >= 50 && words <= 200, `${key}: ${words} fjalë`);
        const data = getLearningData(key);
        assert.ok(data.more.length > 0);
        data.more.forEach(p => assert.ok(!/[<>]/.test(p), `${key}: HTML i papritur`));
    }
});

import { REAL, countRealWords } from '../src/ui/learningMore.js';

test('çdo element ka 3 shembuj konkretë të jetës reale', () => {
    assert.deepEqual(Object.keys(REAL).sort(), Object.keys(BASE).sort());
    for (const key of Object.keys(BASE)) {
        assert.equal(REAL[key].length, 3, `${key}: duhen 3 shembuj`);
        REAL[key].forEach(item => assert.ok(item.split(/\s+/).length >= 8, `${key}: shembull shumë i shkurtër`));
        const words = countRealWords(key);
        assert.ok(words >= 40 && words <= 120, `${key}: ${words} fjalë`);
        assert.equal(getLearningData(key).real.length, 3);
    }
});

import { TRAIT_INFO } from '../src/ui/learningTraits.js';
import { PSEUDO } from '../src/ui/pseudocode.js';

test('çdo karakteristikë ka shpjegim', () => {
    const traits = new Set(Object.keys(BASE).flatMap(key => getLearningData(key).traits));
    for (const trait of traits) {
        assert.ok(TRAIT_INFO[trait] && TRAIT_INFO[trait].split(/\s+/).length >= 15, `mungon shpjegimi: ${trait}`);
    }
});

test('çdo element ka pseudokod të thelluar (jo vetëm 3 rreshta)', () => {
    assert.deepEqual(Object.keys(PSEUDO).sort(), Object.keys(BASE).sort());
    for (const key of Object.keys(BASE)) {
        const lines = PSEUDO[key].split('\n');
        assert.ok(lines.length >= 12, `${key}: vetëm ${lines.length} rreshta`);
        assert.ok(/KOMPLEKSITET/.test(PSEUDO[key]), `${key}: pa analizë kompleksiteti`);
        assert.ok(/IDEJA|INVARIANTI/.test(PSEUDO[key]), `${key}: pa ide/invariant`);
    }
});

import { TECH, countUsesWords } from '../src/ui/learningMore.js';

test('seksioni "Përdorimet" (teknik + jeta reale) ka 50–200 fjalë për çdo element', () => {
    assert.deepEqual(Object.keys(TECH).sort(), Object.keys(BASE).sort());
    for (const key of Object.keys(BASE)) {
        const words = countUsesWords(key);
        assert.ok(words >= 50 && words <= 200, `${key}: ${words} fjalë`);
        assert.ok(getLearningData(key).technical.length > 0);
    }
});

test('"Përdorimet" ka një fjali përmbledhëse (te `use`)', () => {
    for (const key of Object.keys(BASE)) {
        const use = getLearningData(key).use;
        assert.ok(use.split(/\s+/).length <= 25, `${key}: përmbledhja shumë e gjatë`);
        assert.equal((use.match(/[.!?](\s|$)/g) || []).length, 1, `${key}: duhet saktësisht një fjali`);
    }
});
