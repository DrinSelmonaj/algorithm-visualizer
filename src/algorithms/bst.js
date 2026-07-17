// src/algorithms/bst.js

import { rerender } from '../engine/bstRenderer.js';

const JAVA_SOURCE =
`public class BST {
    static class Node {
        int value; Node left, right;
        Node(int v) { value = v; }
    }

    private Node root;

    public void insert(int value) {
        root = insertRec(root, value);
    }

    private Node insertRec(Node node, int value) {
        if (node == null) return new Node(value);
        if (value < node.value) node.left  = insertRec(node.left,  value);
        else if (value > node.value) node.right = insertRec(node.right, value);
        return node;
    }

    public boolean search(int value) {
        Node cur = root;
        while (cur != null) {
            if (value == cur.value) return true;
            cur = value < cur.value ? cur.left : cur.right;
        }
        return false;
    }
}`;

// Pema e brendshme — objekti JS me { id, value, left, right }
let root     = null;
let uidCount = 0;

function makeNode(value) {
    return { id: uidCount++, value, left: null, right: null };
}

function init() {
    root     = null;
    uidCount = 0;
    rerender(null);
}

// ── INSERT ────────────────────────────────────────────────────────
function* bstInsert(value) {
    const node = makeNode(value);

    if (!root) {
        root = node;
        yield { type: 'rerender', render: () => rerender(root), javaLine: 14, message: `${value} u fut si root.` };
        yield { type: 'insert',   nodeId: `bst-node-${node.id}`, javaLine: 14, message: `insert(${value}) përfundoi.` };
        return;
    }

    let cur = root;
    while (true) {
        yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 16, message: `Krahasojmë ${value} me ${cur.value}.` };

        if (value < cur.value) {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 17, message: `${value} < ${cur.value} — shkojmë majtas.` };
            if (!cur.left) {
                cur.left = node;
                yield { type: 'rerender', render: () => rerender(root), javaLine: 17, message: `${value} u fut si fëmijë i majtë i ${cur.value}.` };
                yield { type: 'insert', nodeId: `bst-node-${node.id}`, javaLine: 17, message: `insert(${value}) përfundoi.` };
                return;
            }
            cur = cur.left;
        } else if (value > cur.value) {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 18, message: `${value} > ${cur.value} — shkojmë djathtas.` };
            if (!cur.right) {
                cur.right = node;
                yield { type: 'rerender', render: () => rerender(root), javaLine: 18, message: `${value} u fut si fëmijë i djathtë i ${cur.value}.` };
                yield { type: 'insert', nodeId: `bst-node-${node.id}`, javaLine: 18, message: `insert(${value}) përfundoi.` };
                return;
            }
            cur = cur.right;
        } else {
            yield { type: 'found', nodeId: `bst-node-${cur.id}`, javaLine: 18, message: `${value} ekziston tashmë.` };
            return;
        }
    }
}

// ── SEARCH ───────────────────────────────────────────────────────
function* bstSearch(value) {
    let cur = root;

    if (!cur) {
        yield { type: 'visit', javaLine: 23, message: 'Pema është bosh.' };
        return;
    }

    while (cur) {
        yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 24, message: `Kontrollojmë nyjen ${cur.value}.` };

        if (value === cur.value) {
            yield { type: 'found', nodeId: `bst-node-${cur.id}`, javaLine: 25, message: `Gjendëm ${value}!` };
            return;
        }

        if (value < cur.value) {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 26, message: `${value} < ${cur.value} — majtas.` };
            cur = cur.left;
        } else {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 26, message: `${value} > ${cur.value} — djathtas.` };
            cur = cur.right;
        }
    }

    yield { type: 'visit', javaLine: 28, message: `${value} nuk u gjet.` };
}

// Eksporti i funksionit kryesor që thërret main.js (butoni "Krijo pemën")
// VETËM ndërton pemën — kërkimi është veprim i veçantë, eksplicit (btn-bst-search)
function* bstAlgorithm(values = [5, 3, 7, 1, 4, 6, 8]) {
    init();
    for (const v of values) yield* bstInsert(v);
}

export { bstAlgorithm, bstInsert, bstSearch, init, JAVA_SOURCE };