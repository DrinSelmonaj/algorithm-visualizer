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
