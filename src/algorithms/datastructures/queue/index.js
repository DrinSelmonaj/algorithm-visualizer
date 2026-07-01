// src/algorithms/datastructures/queue/index.js

import { render } from '../../../engine/queueRenderer.js';

const JAVA_SOURCE =
`public class QueueDemo {
    private int[] data;
    private int front, rear, size;

    public QueueDemo(int capacity) {
        data  = new int[capacity];
        front = 0; rear = -1; size = 0;
    }

    public void enqueue(int value) {
        rear = (rear + 1) % data.length;
        data[rear] = value;
        size++;
    }

    public int dequeue() {
        int value = data[front];
        front = (front + 1) % data.length;
        size--;
        return value;
    }

    public int peek() {
        return data[front];
    }

    public boolean isEmpty() {
        return size == 0;
    }
}`;

let items = [];

function init() {
    items = [];
    render(items);
}

// ── ENQUEUE ───────────────────────────────────────────────────────
function* enqueue(value) {
    yield {
        type: 'compare', dsType: 'queue',
        message: `enqueue(${value}): shtojmë ${value} në fund të queue-s.`,
        javaLine: 11,
    };

    items.push(value);
    const rearIndex = items.length - 1;

    yield {
        type: 'rerender', dsType: 'queue',
        render: () => render(items),
        nodeId: `queue-cell-${rearIndex}`,
        javaLine: 12,
        message: `${value} u shtua në rear. Madhësia: ${items.length}.`,
    };

    yield {
        type: 'enqueue', dsType: 'queue',
        nodeId: `queue-cell-${rearIndex}`,
        javaLine: 13,
        message: `enqueue() përfundoi.`,
    };
}

// ── DEQUEUE ───────────────────────────────────────────────────────
function* dequeue() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'queue', message: 'Queue është bosh.', javaLine: 17 };
        return;
    }

    yield {
        type: 'dequeue', dsType: 'queue',
        nodeId: 'queue-cell-0',
        message: `dequeue(): heqim front-in ${items[0]}.`,
        javaLine: 17,
    };

    yield {
        type: 'delete', dsType: 'queue',
        nodeId: 'queue-cell-0',
        message: `${items[0]} do të hiqet nga front-i.`,
        javaLine: 18,
    };

    items.shift();

    yield {
        type: 'rerender', dsType: 'queue',
        render: () => render(items),
        message: `U hoq. Madhësia: ${items.length}.`,
        javaLine: 19,
    };
}

// ── PEEK ──────────────────────────────────────────────────────────
function* peek() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'queue', message: 'Queue është bosh.', javaLine: 23 };
        return;
    }

    yield {
        type: 'found', dsType: 'queue',
        nodeId: 'queue-cell-0',
        message: `peek(): front-i është ${items[0]}. Queue pa ndryshim.`,
        javaLine: 23,
    };
}

// ── IS EMPTY ──────────────────────────────────────────────────────
function* isEmpty() {
    const result = items.length === 0;
    yield {
        type: 'compare', dsType: 'queue',
        message: `isEmpty(): ${result}. Queue ka ${items.length} element(e).`,
        javaLine: 27,
    };
}

export { init, enqueue, dequeue, peek, isEmpty, JAVA_SOURCE };
