import { t } from '../../../i18n/index.js';
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
        message: t('m.queue.1', { p0: value, p1: value }),
        javaLine: 11,
    };

    items.push(value);
    const rearIndex = items.length - 1;

    yield {
        type: 'rerender', dsType: 'queue',
        render: () => render(items),
        nodeId: `queue-cell-${rearIndex}`,
        javaLine: 12,
        message: t('m.queue.2', { p0: value, p1: items.length }),
    };

    yield {
        type: 'enqueue', dsType: 'queue',
        nodeId: `queue-cell-${rearIndex}`,
        javaLine: 13,
        message: t('m.queue.3'),
    };
}

// ── DEQUEUE ───────────────────────────────────────────────────────
function* dequeue() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'queue', message: t('m.queue.4'), javaLine: 17 };
        return;
    }

    yield {
        type: 'dequeue', dsType: 'queue',
        nodeId: 'queue-cell-0',
        message: t('m.queue.5', { p0: items[0] }),
        javaLine: 17,
    };

    yield {
        type: 'delete', dsType: 'queue',
        nodeId: 'queue-cell-0',
        message: t('m.queue.6', { p0: items[0] }),
        javaLine: 18,
    };

    items.shift();

    yield {
        type: 'rerender', dsType: 'queue',
        render: () => render(items),
        message: t('m.queue.7', { p0: items.length }),
        javaLine: 19,
    };
}

// ── PEEK ──────────────────────────────────────────────────────────
function* peek() {
    if (items.length === 0) {
        yield { type: 'compare', dsType: 'queue', message: t('m.queue.8'), javaLine: 24 };
        return;
    }

    yield {
        type: 'found', dsType: 'queue',
        nodeId: 'queue-cell-0',
        message: t('m.queue.9', { p0: items[0] }),
        javaLine: 24,
    };
}

// ── IS EMPTY ──────────────────────────────────────────────────────
function* isEmpty() {
    const result = items.length === 0;
    yield {
        type: 'compare', dsType: 'queue',
        message: t('m.queue.10', { p0: result, p1: items.length }),
        javaLine: 28,
    };
}

export { init, enqueue, dequeue, peek, isEmpty, JAVA_SOURCE };
