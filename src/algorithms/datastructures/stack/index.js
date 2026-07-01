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
        message: `push(${value}): shtojmë ${value} në majë të stack-ut.`,
        javaLine: 11,
    };

    items.push(value);
    const topIndex = items.length - 1;

    yield {
        type: 'rerender', dsType: 'stack',
        render: () => render(items),
        nodeId: `stack-cell-${topIndex}`,
        javaLine: 12,
        message: `${value} u shtua. top = ${topIndex}.`,
    };

    yield {
        type: 'push', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: `push() përfundoi. Madhësia: ${items.length}.`,
        javaLine: 12,
    };
}

// ── POP ───────────────────────────────────────────────────────────
function* pop() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'stack', message: 'Stack është bosh — nuk ka çfarë të heqim.', javaLine: 16 };
        return;
    }

    const topIndex = items.length - 1;

    yield {
        type: 'pop', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: `pop(): heqim elementin e majës ${items[topIndex]}.`,
        javaLine: 16,
    };

    yield {
        type: 'delete', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: `${items[topIndex]} do të hiqet.`,
        javaLine: 17,
    };

    items.pop();

    yield {
        type: 'rerender', dsType: 'stack',
        render: () => render(items),
        message: `U hoq. Madhësia: ${items.length}.`,
        javaLine: 17,
    };
}

// ── PEEK ──────────────────────────────────────────────────────────
function* peek() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'stack', message: 'Stack është bosh.', javaLine: 21 };
        return;
    }

    const topIndex = items.length - 1;

    yield {
        type: 'found', dsType: 'stack',
        nodeId: `stack-cell-${topIndex}`,
        message: `peek(): elementi i majës është ${items[topIndex]}. Stack pa ndryshim.`,
        javaLine: 21,
    };
}

// ── IS EMPTY ──────────────────────────────────────────────────────
function* isEmpty() {
    const result = items.length === 0;
    yield {
        type: 'compare', dsType: 'stack',
        message: `isEmpty(): ${result}. Stack ka ${items.length} element(e).`,
        javaLine: 25,
    };
}

export { init, push, pop, peek, isEmpty, JAVA_SOURCE };
