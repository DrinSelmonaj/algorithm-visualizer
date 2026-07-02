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

    public void delete(int value) {
        if (head == null) return;
        if (head.value == value) { head = head.next; return; }
        Node prev = head, cur = head.next;
        while (cur != null) {
            if (cur.value == value) { prev.next = cur.next; return; }
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

    yield { type: 'compare', dsType: 'linkedlist', message: `insertAtHead(${value}): krijojmë nyje të re, i caktohet next = head aktual.`, javaLine: 8 };

    node.next = head;
    head = node;

    yield {
        type: 'rerender', dsType: 'linkedlist',
        render: () => render(head),
        nodeId: `ll-node-${node.id}`,
        javaLine: 10,
        message: `${value} u fut si head i ri.`,
    };

    yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 10, message: `insertAtHead() përfundoi.` };
}

// ── INSERT AT TAIL ─────────────────────────────────────────────────
function* insertAtTail(value) {
    const node = makeNode(value);

    if (!head) {
        head = node;
        yield {
            type: 'rerender', dsType: 'linkedlist',
            render: () => render(head),
            nodeId: `ll-node-${node.id}`,
            javaLine: 14,
            message: `Lista ishte bosh — ${value} u bë head.`,
        };
        yield { type: 'insert', dsType: 'linkedlist', nodeId: `ll-node-${node.id}`, javaLine: 14, message: `insertAtTail() përfundoi.` };
        return;
    }

    let cur = head;
    while (cur.next) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Kalojmë te nyja ${cur.value}, next nuk është null.`, javaLine: 16 };
        cur = cur.next;
    }

    yield { type: 'found', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Mbërritëm tek tail ${cur.value} (next = null).`, javaLine: 17 };

    cur.next = node;

    yield {
        type: 'rerender', dsType: 'linkedlist',
        render: () => render(head),
        nodeId: `ll-node-${node.id}`,
        javaLine: 17,
        message: `${value} u shtua pas ${cur.value}.`,
    };
}

// ── DELETE ─────────────────────────────────────────────────────────
function* deleteLL(value) {
    if (!head) {
        yield { type: 'compare', dsType: 'linkedlist', message: 'Lista është bosh.', javaLine: 21 };
        return;
    }

    if (head.value === value) {
        yield { type: 'delete', dsType: 'linkedlist', nodeId: `ll-node-${head.id}`, message: `head (${value}) do të hiqet.`, javaLine: 22 };
        head = head.next;
        yield { type: 'rerender', dsType: 'linkedlist', render: () => render(head), message: `${value} u hoq. head u ndryshua.`, javaLine: 22 };
        return;
    }

    let prev = head, cur = head.next;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Kontrollojmë nyjen ${cur.value}.`, javaLine: 25 };

        if (cur.value === value) {
            yield { type: 'delete', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Gjendëm ${value} — rilidhet: ${prev.value}.next → ${cur.next ? cur.next.value : 'null'}.`, javaLine: 26 };
            prev.next = cur.next;
            yield { type: 'rerender', dsType: 'linkedlist', render: () => render(head), message: `${value} u hoq. Lista u rilidhë.`, javaLine: 26 };
            return;
        }

        prev = cur;
        cur  = cur.next;
    }

    yield { type: 'compare', dsType: 'linkedlist', message: `${value} nuk u gjet.`, javaLine: 25 };
}

// ── SEARCH ─────────────────────────────────────────────────────────
function* searchLL(value) {
    let cur = head;
    while (cur) {
        yield { type: 'compare', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Kontrollojmë nyjen ${cur.value}.`, javaLine: 32 };
        if (cur.value === value) {
            yield { type: 'found', dsType: 'linkedlist', nodeId: `ll-node-${cur.id}`, message: `Gjendëm ${value}!`, javaLine: 33 };
            return;
        }
        cur = cur.next;
    }
    yield { type: 'compare', dsType: 'linkedlist', message: `${value} nuk u gjet.`, javaLine: 35 };
}
export { init, insertAtHead, insertAtTail, deleteLL, searchLL, JAVA_SOURCE };

