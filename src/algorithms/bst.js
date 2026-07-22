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

    public void delete(int value) { root = deleteRec(root, value); }
    private Node deleteRec(Node node, int value) {
        if (node == null) return null;
        if (value < node.value) node.left = deleteRec(node.left, value);
        else if (value > node.value) node.right = deleteRec(node.right, value);
        else {
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            node.value = minValue(node.right);
            node.right = deleteRec(node.right, node.value);
        }
        return node;
    }

    private int minValue(Node node) {
        while (node.left != null) node = node.left;
        return node.value;
    }

    public void inOrder(Node node) {
        if (node == null) return;
        inOrder(node.left); visit(node); inOrder(node.right);
    }
    public void preOrder(Node node) {
        if (node == null) return;
        visit(node); preOrder(node.left); preOrder(node.right);
    }
    public void postOrder(Node node) {
        if (node == null) return;
        postOrder(node.left); postOrder(node.right); visit(node);
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
    if (typeof document !== 'undefined') rerender(null);
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

// ── DELETE ───────────────────────────────────────────────────────
// Përdor successor-in in-order për rastin me dy fëmijë, ashtu si kodi Java.
function* bstDelete(value) {
    if (!root) {
        yield { type: 'visit', javaLine: 28, message: 'Pema është bosh.' };
        return;
    }

    let parent = null;
    let cur = root;
    while (cur && cur.value !== value) {
        yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 30, message: `Kërkojmë ${value}: kontrollojmë ${cur.value}.` };
        parent = cur;
        cur = value < cur.value ? cur.left : cur.right;
    }

    if (!cur) {
        yield { type: 'visit', javaLine: 29, message: `${value} nuk u gjet — pema nuk ndryshon.` };
        return;
    }

    const replaceChild = (oldNode, nextNode) => {
        if (!parent) root = nextNode;
        else if (parent.left === oldNode) parent.left = nextNode;
        else parent.right = nextNode;
    };

    if (!cur.left && !cur.right) {
        yield { type: 'delete', nodeId: `bst-node-${cur.id}`, javaLine: 33, message: `${value} është leaf — e heqim drejtpërdrejt.` };
        replaceChild(cur, null);
        yield { type: 'rerender', render: () => rerender(root), javaLine: 33, message: `${value} u fshi.` };
        return;
    }

    if (!cur.left || !cur.right) {
        const child = cur.left || cur.right;
        yield {
            type: 'replace', nodeId: `bst-node-${cur.id}`, replacementNodeId: `bst-node-${child.id}`,
            javaLine: 34, message: `${value} ka një fëmijë — ${child.value} zë vendin e saj.`
        };
        replaceChild(cur, child);
        yield { type: 'rerender', render: () => rerender(root), javaLine: 34, message: `${value} u fshi dhe lidhja u rivendos.` };
        return;
    }

    let successorParent = cur;
    let successor = cur.right;
    yield { type: 'visit', nodeId: `bst-node-${successor.id}`, javaLine: 35, message: `Gjejmë successor-in: nisim te nënpema e djathtë (${successor.value}).` };
    while (successor.left) {
        successorParent = successor;
        successor = successor.left;
        yield { type: 'visit', nodeId: `bst-node-${successor.id}`, javaLine: 40, message: `Lëvizim majtas te ${successor.value} për minimumin.` };
    }

    yield {
        type: 'replace', nodeId: `bst-node-${cur.id}`, replacementNodeId: `bst-node-${successor.id}`,
        javaLine: 36, message: `Successori ${successor.value} zëvendëson ${cur.value}.`
    };
    cur.value = successor.value;
    yield { type: 'delete', nodeId: `bst-node-${successor.id}`, javaLine: 37, message: `Fshijmë successor-in e vjetër ${successor.value}.` };
    if (successorParent.left === successor) successorParent.left = successor.right;
    else successorParent.right = successor.right;
    yield { type: 'rerender', render: () => rerender(root), javaLine: 37, message: `${value} u fshi; successor-i u vendos në pozicionin e saj.` };
}

// ── TRAVERSALS ───────────────────────────────────────────────────
const TRAVERSAL_NAMES = {
    inorder: 'In-order',
    preorder: 'Pre-order',
    postorder: 'Post-order',
};

function* bstTraverse(mode) {
    const name = TRAVERSAL_NAMES[mode];
    if (!name) return;
    if (!root) {
        yield { type: 'visit', javaLine: 46, message: 'Pema është bosh.' };
        return;
    }

    const result = [];
    yield { type: 'traversal-start', message: `${name} fillon.` };

    function* visit(node) {
        if (!node) return;
        if (mode === 'preorder') yield* record(node);
        yield* visit(node.left);
        if (mode === 'inorder') yield* record(node);
        yield* visit(node.right);
        if (mode === 'postorder') yield* record(node);
    }

    function* record(node) {
        result.push(node.value);
        yield {
            type: 'traverse', nodeId: `bst-node-${node.id}`, traversal: [...result],
            javaLine: mode === 'inorder' ? 47 : mode === 'preorder' ? 51 : 55,
            message: `${name}: ${result.join(' → ')}`
        };
    }

    yield* visit(root);
    yield { type: 'traversal-complete', traversal: result, message: `${name} përfundoi: ${result.join(' → ')}.` };
}

// Eksporti i funksionit kryesor që thërret main.js (butoni "Krijo pemën")
// VETËM ndërton pemën — kërkimi është veprim i veçantë, eksplicit (btn-bst-search)
function* bstAlgorithm(values = [5, 3, 7, 1, 4, 6, 8]) {
    init();
    for (const v of values) yield* bstInsert(v);
}

export { bstAlgorithm, bstInsert, bstSearch, bstDelete, bstTraverse, init, JAVA_SOURCE };
