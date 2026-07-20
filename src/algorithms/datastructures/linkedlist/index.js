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
        message: `Krijojmë nyje të re me vlerën ${value} (Node node = new Node(${value})).`,
    };

    node.next = head;

    yield {
        type: 'compare', dsType: 'linkedlist',
        javaLine: 10,
        message: head
            ? `node.next = head → nyja e re tregon te ${head.value}.`
            : `node.next = head → lista ishte bosh, node.next = null.`,
    };

    head = node;

    yield {
        type: 'rerender', dsType: 'linkedlist',
        render: () => render(head),
        nodeId: `ll-node-${node.id}`,
        javaLine: 11,
        message: `head = node → ${value} është tani head i ri.`,
    };

    yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 11, message: `insertAtHead() përfundoi.` };
}

// ── INSERT AT TAIL ─────────────────────────────────────────────────
function* insertAtTail(value) {
    const node = makeNode(value);

    yield {
        type: 'compare', dsType: 'linkedlist',
        javaLine: 15,
        message: `Krijojmë nyje të re me vlerën ${value} (Node node = new Node(${value})).`,
    };

    if (!head) {
        head = node;
        yield {
            type: 'rerender', dsType: 'linkedlist',
            render: () => render(head),
            nodeId: `ll-node-${node.id}`,
            javaLine: 16,
            message: `Lista ishte bosh — ${value} u bë head.`,
        };
        yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 16, message: `insertAtTail() përfundoi.` };
        return;
    }

    let cur = head;
    yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Nisim nga head: cur = ${cur.value}.`, javaLine: 17 };

    while (cur.next) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Kalojmë te nyja ${cur.value}, next nuk është null.`, javaLine: 18 };
        cur = cur.next;
    }

    yield { type: 'found', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Mbërritëm tek tail ${cur.value} (next = null).`, javaLine: 18 };

    cur.next = node;

    yield {
        type: 'rerender', dsType: 'linkedlist',
        render: () => render(head),
        nodeId: `ll-node-${node.id}`,
        javaLine: 19,
        message: `cur.next = node → ${value} u shtua pas ${cur.value}.`,
    };

    yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 19, message: `insertAtTail() përfundoi.` };
}

// ── INSERT AFTER VALUE ─────────────────────────────────────────────
// Kërkon nyjen me vlerën `target`, pastaj fut nyjen e re pas saj.
// Ndjek të njëjtin pattern 3-hapësh: krijim → ecje/krahasim → lidhje (2 hapa) → rerender.
function* insertAfterValue(value, target) {
    const node = makeNode(value);

    yield {
        type: 'compare', dsType: 'linkedlist',
        javaLine: 23,
        message: `Krijojmë nyje të re me vlerën ${value} (Node node = new Node(${value})).`,
    };

    if (!head) {
        yield { type: 'compare', dsType: 'linkedlist',
                javaLine: 24,
                message: 'Lista është bosh — nuk ka asgjë për të kërkuar.' };
        return;
    }

    let cur = head;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist',
                nodeId: `ll-node-${cur.id}`,
                message: `Kërkojmë ${target}: kontrollojmë nyjen ${cur.value}.`,
                javaLine: 26 };

        if (cur.value === parseInt(target)) {
            yield { type: 'found', dsType: 'linkedlist',
                    nodeId: `ll-node-${cur.id}`,
                    message: `Gjendëm ${target} — futim ${value} pas saj.`,
                    javaLine: 26 };

            node.next = cur.next;
            yield { type: 'compare', dsType: 'linkedlist',
                    javaLine: 27,
                    message: `node.next = cur.next → nyja e re tregon te ${node.next ? node.next.value : 'null'}.` };

            cur.next = node;
            yield {
                type: 'rerender', dsType: 'linkedlist',
                render: () => render(head),
                nodeId: `ll-node-${node.id}`,
                javaLine: 28,
                message: `cur.next = node → ${target} → ${value} → ${node.next ? node.next.value : 'null'}.`,
            };

            yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 28, message: `insertAfterValue() përfundoi.` };
            return;
        }
        cur = cur.next;
    }

    yield { type: 'compare', dsType: 'linkedlist',
            javaLine: 33,
            message: `${target} nuk u gjet — nuk u fut asgjë.` };
}

// ── DELETE ─────────────────────────────────────────────────────────
function* deleteLL(value, nextValue = null, nextIsNull = false) {
    const usesNextValue = nextValue !== null || nextIsNull;
    const matchesTarget = (node) => node.value === value &&
        (!usesNextValue || (nextIsNull ? node.next === null : (node.next && node.next.value === nextValue)));
    const targetDescription = usesNextValue ? `${value} → ${nextIsNull ? 'null' : nextValue}` : String(value);

    if (!head) {
        yield { type: 'compare', dsType: 'linkedlist', message: 'Lista është bosh.', javaLine: 36 };
        return;
    }

    if (matchesTarget(head)) {
        yield { type: 'delete', dsType: 'linkedlist', nodeId: `ll-node-${head.id}`, message: `head (${targetDescription}) do të hiqet.`, javaLine: 37 };
        head = head.next;
        yield { type: 'rerender', dsType: 'linkedlist', render: () => render(head), message: `${targetDescription} u hoq. head u ndryshua.`, javaLine: 37 };
        return;
    }

    let prev = head, cur = head.next;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: usesNextValue ? `Kontrollojmë çiftin ${cur.value} → ${cur.next ? cur.next.value : 'null'}.` : `Kontrollojmë nyjen ${cur.value}.`, javaLine: 40 };

        if (matchesTarget(cur)) {
            yield { type: 'delete', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Gjendëm ${targetDescription} — rilidhet: ${prev.value}.next → ${cur.next ? cur.next.value : 'null'}.`, javaLine: 40 };
            prev.next = cur.next;
            yield { type: 'rerender', dsType: 'linkedlist', render: () => render(head), message: `${targetDescription} u hoq. Lista u rilidhë.`, javaLine: 40 };
            return;
        }

        prev = cur;
        cur  = cur.next;
    }

    yield { type: 'compare', dsType: 'linkedlist', message: `${targetDescription} nuk u gjet.`, javaLine: 39 };
}

// ── SEARCH ─────────────────────────────────────────────────────────
function* searchLL(value) {
    let cur = head;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Kontrollojmë nyjen ${cur.value}.`, javaLine: 48 };
        if (cur.value === value) {
            yield { type: 'found', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Gjendëm ${value}!`, javaLine: 48 };
            return;
        }
        cur = cur.next;
    }
    yield { type: 'compare', dsType: 'linkedlist', message: `${value} nuk u gjet.`, javaLine: 51 };
}
export { init, insertAtHead, insertAtTail, insertAfterValue, deleteLL, searchLL, JAVA_SOURCE };
