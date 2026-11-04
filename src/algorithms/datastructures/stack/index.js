import { t } from '../../../i18n/index.js';
// src/algorithms/datastructures/stack/index.js

import { render } from '../../../engine/stackRenderer.js';

const JAVA_SOURCE =
`public class StackDemo {
    private int[] data;
    private int top;

    public StackDemo(int capacity) {
        data = new int[capacity];
        top = -1;
    }

    public void push(int value) {
        top++;
        data[top] = value;
    }

    public int pop() {
        int value = data[top];
        top--;
        return value;
    }

    public int peek() {
        return data[top];
    }

    public boolean isEmpty() {
        return top == -1;
    }
}`;

// Gjendja e stack-ut — array e brendshme
let items = [];

function init() {
    items = [];
    render(items);
}

// ── PUSH ──────────────────────────────────────────────────────────
function* push(value) {
    yield {
        type: 'compare', dsType: 'stack',
        message: t('m.stack.1', { p0: value, p1: value }),
        javaLine: 11,
    };

    items.push(value);
    const topIndex = items.length - 1;

    yield {
        type: 'rerender', dsType: 'stack',
        render: () => render(items),
        nodeId: `stack-cell-${topIndex}`,
        javaLine: 12,
        message: t('m.stack.2', { p0: value, p1: topIndex }),
    };

    yield {
        type: 'push', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: t('m.stack.3', { p0: items.length }),
        javaLine: 12,
    };
}

// ── POP ───────────────────────────────────────────────────────────
function* pop() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'stack', message: t('m.stack.4'), javaLine: 16 };
        return;
    }

    const topIndex = items.length - 1;

    yield {
        type: 'pop', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: t('m.stack.5', { p0: items[topIndex] }),
        javaLine: 16,
    };

    yield {
        type: 'delete', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: t('m.stack.6', { p0: items[topIndex] }),
        javaLine: 17,
    };

    items.pop();

    yield {
        type: 'rerender', dsType: 'stack',
        render: () => render(items),
        message: t('m.stack.7', { p0: items.length }),
        javaLine: 17,
    };
}

// ── PEEK ──────────────────────────────────────────────────────────
function* peek() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'stack', message: t('m.stack.8'), javaLine: 22 };
        return;
    }

    const topIndex = items.length - 1;

    yield {
        type: 'found', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: t('m.stack.9', { p0: items[topIndex] }),
        javaLine: 22,
    };
}

// ── IS EMPTY ──────────────────────────────────────────────────────
function* isEmpty() {
    const result = items.length === 0;
    yield {
        type: 'compare', dsType: 'stack',
        message: t('m.stack.10', { p0: result, p1: items.length }),
        javaLine: 26,
    };
}

export { init, push, pop, peek, isEmpty, JAVA_SOURCE };
