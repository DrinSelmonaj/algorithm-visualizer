import { t } from '../../../i18n/index.js';
// src/algorithms/datastructures/linkedlist/index.js

import { render } from '../../../engine/linkedListRenderer.js';

const JAVA_SOURCE =
`public class LinkedListDemo {
    static class Node {
        int value; Node next;
        Node(int v) { value = v; }
    }
    private Node head;

    public void insertAtHead(int value) {
        Node node = new Node(value);
        node.next = head;
        head = node;
    }

    public void insertAtTail(int value) {
        Node node = new Node(value);
        if (head == null) { head = node; return; }
        Node cur = head;
        while (cur.next != null) cur = cur.next;
        cur.next = node;
    }

    public void insertAfterValue(int value, int target) {
        Node node = new Node(value);
        Node cur = head;
        while (cur != null) {
            if (cur.value == target) {
                node.next = cur.next;
                cur.next = node;
                return;
            }
            cur = cur.next;
        }
    }

    public void delete(int value, Integer nextValue, boolean nextIsNull) {
        if (head == null) return;
        if (head.value == value && (nextIsNull ? head.next == null : (nextValue == null || (head.next != null && head.next.value == nextValue)))) { head = head.next; return; }
        Node prev = head, cur = head.next;
        while (cur != null) {
            if (cur.value == value && (nextIsNull ? cur.next == null : (nextValue == null || (cur.next != null && cur.next.value == nextValue)))) { prev.next = cur.next; return; }
            prev = cur; cur = cur.next;
        }
    }

    public boolean search(int value) {
        Node cur = head;
        while (cur != null) {
            if (cur.value == value) return true;
            cur = cur.next;
        }
        return false;
    }
}`;

let head      = null;
let uidCnt    = 0;

function makeNode(value) {
    return { id: uidCnt++, value, next: null };
}

function init() {
    head   = null;
    uidCnt = 0;
    render(head);
}

// ── INSERT AT HEAD ─────────────────────────────────────────────────
function* insertAtHead(value) {
    const node = makeNode(value);

    yield {
        type: 'compare', dsType: 'linkedlist',
        javaLine: 9,
        message: t('m.linkedlist.1', { p0: value, p1: value }),
    };

    node.next = head;

    yield {
        type: 'compare', dsType: 'linkedlist',
        javaLine: 10,
        message: head
            ? t('m.ll.newNodeHead', { h: head.value })
            : t('m.ll.newNodeEmpty'),
    };

    head = node;

    yield {
        type: 'rerender', dsType: 'linkedlist',
        render: () => render(head),
        nodeId: `ll-node-${node.id}`,
        javaLine: 11,
        message: t('m.linkedlist.2', { p0: value }),
    };

    yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 11, message: t('m.linkedlist.3') };
}

// ── INSERT AT TAIL ─────────────────────────────────────────────────
function* insertAtTail(value) {
    const node = makeNode(value);

    yield {
        type: 'compare', dsType: 'linkedlist',
        javaLine: 15,
        message: t('m.linkedlist.4', { p0: value, p1: value }),
    };

    if (!head) {
        head = node;
        yield {
            type: 'rerender', dsType: 'linkedlist',
            render: () => render(head),
            nodeId: `ll-node-${node.id}`,
            javaLine: 16,
            message: t('m.linkedlist.5', { p0: value }),
        };
        yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 16, message: t('m.linkedlist.6') };
        return;
    }

    let cur = head;
    yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: t('m.linkedlist.7', { p0: cur.value }), javaLine: 17 };

    while (cur.next) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: t('m.linkedlist.8', { p0: cur.value }), javaLine: 18 };
        cur = cur.next;
    }

    yield { type: 'found', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: t('m.linkedlist.9', { p0: cur.value }), javaLine: 18 };

    cur.next = node;

    yield {
        type: 'rerender', dsType: 'linkedlist',
        render: () => render(head),
        nodeId: `ll-node-${node.id}`,
        javaLine: 19,
        message: t('m.linkedlist.10', { p0: value, p1: cur.value }),
    };

    yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 19, message: t('m.linkedlist.11') };
}

// ── INSERT AFTER VALUE ─────────────────────────────────────────────
// Kërkon nyjen me vlerën `target`, pastaj fut nyjen e re pas saj.
// Ndjek të njëjtin pattern 3-hapësh: krijim → ecje/krahasim → lidhje (2 hapa) → rerender.
function* insertAfterValue(value, target) {
    const node = makeNode(value);

    yield {
        type: 'compare', dsType: 'linkedlist',
        javaLine: 23,
        message: t('m.linkedlist.12', { p0: value, p1: value }),
    };

    if (!head) {
        yield { type: 'compare', dsType: 'linkedlist',
                javaLine: 24,
                message: t('m.linkedlist.13') };
        return;
    }

    let cur = head;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist',
                nodeId: `ll-node-${cur.id}`,
                message: t('m.linkedlist.14', { p0: target, p1: cur.value }),
                javaLine: 26 };

        if (cur.value === parseInt(target)) {
            yield { type: 'found', dsType: 'linkedlist',
                    nodeId: `ll-node-${cur.id}`,
                    message: t('m.linkedlist.15', { p0: target, p1: value }),
                    javaLine: 26 };

            node.next = cur.next;
            yield { type: 'compare', dsType: 'linkedlist',
                    javaLine: 27,
                    message: t('m.linkedlist.16', { p0: node.next ? node.next.value : 'null' }) };

            cur.next = node;
            yield {
                type: 'rerender', dsType: 'linkedlist',
                render: () => render(head),
                nodeId: `ll-node-${node.id}`,
                javaLine: 28,
                message: t('m.linkedlist.17', { p0: target, p1: value, p2: node.next ? node.next.value : 'null' }),
            };

            yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 28, message: t('m.linkedlist.18') };
            return;
        }
        cur = cur.next;
    }

    yield { type: 'compare', dsType: 'linkedlist',
            javaLine: 25, // while (cur != null) mbaroi pa gjetur target-in
            message: t('m.linkedlist.19', { p0: target }) };
}

// ── DELETE ─────────────────────────────────────────────────────────
function* deleteLL(value, nextValue = null, nextIsNull = false) {
    const usesNextValue = nextValue !== null || nextIsNull;
    const matchesTarget = (node) => node.value === value &&
        (!usesNextValue || (nextIsNull ? node.next === null : (node.next && node.next.value === nextValue)));
    const targetDescription = usesNextValue ? `${value} → ${nextIsNull ? 'null' : nextValue}` : String(value);

    if (!head) {
        yield { type: 'compare', dsType: 'linkedlist', message: t('m.linkedlist.20'), javaLine: 36 };
        return;
    }

    if (matchesTarget(head)) {
        yield { type: 'delete', dsType: 'linkedlist', nodeId: `ll-node-${head.id}`, message: t('m.linkedlist.21', { p0: targetDescription }), javaLine: 37 };
        head = head.next;
        yield { type: 'rerender', dsType: 'linkedlist', render: () => render(head), message: t('m.linkedlist.22', { p0: targetDescription }), javaLine: 37 };
        return;
    }

    let prev = head, cur = head.next;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: usesNextValue ? t('m.ll.checkPair', { a: cur.value, b: cur.next ? cur.next.value : 'null' }) : t('m.ll.checkNode', { a: cur.value }), javaLine: 40 };

        if (matchesTarget(cur)) {
            yield { type: 'delete', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: t('m.linkedlist.23', { p0: targetDescription, p1: prev.value, p2: cur.next ? cur.next.value : 'null' }), javaLine: 40 };
            prev.next = cur.next;
            yield { type: 'rerender', dsType: 'linkedlist', render: () => render(head), message: t('m.linkedlist.24', { p0: targetDescription }), javaLine: 40 };
            return;
        }

        prev = cur;
        cur  = cur.next;
    }

    yield { type: 'compare', dsType: 'linkedlist', message: t('m.linkedlist.25', { p0: targetDescription }), javaLine: 39 };
}

// ── SEARCH ─────────────────────────────────────────────────────────
function* searchLL(value) {
    let cur = head;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: t('m.linkedlist.26', { p0: cur.value }), javaLine: 48 };
        if (cur.value === value) {
            yield { type: 'found', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: t('m.linkedlist.27', { p0: value }), javaLine: 48 };
            return;
        }
        cur = cur.next;
    }
    yield { type: 'compare', dsType: 'linkedlist', message: t('m.linkedlist.28', { p0: value }), javaLine: 51 };
}
export { init, insertAtHead, insertAtTail, insertAfterValue, deleteLL, searchLL, JAVA_SOURCE };
