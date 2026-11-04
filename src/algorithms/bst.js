import { t } from '../i18n/index.js';
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
        yield { type: 'rerender', render: () => rerender(root), javaLine: 14, message: t('m.bst.1', { p0: value }) };
        yield { type: 'insert',   nodeId: `bst-node-${node.id}`, javaLine: 14, message: t('m.bst.2', { p0: value }) };
        return;
    }

    let cur = root;
    while (true) {
        yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 16, message: t('m.bst.3', { p0: value, p1: cur.value }) };

        if (value < cur.value) {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 17, message: t('m.bst.4', { p0: value, p1: cur.value }) };
            if (!cur.left) {
                cur.left = node;
                yield { type: 'rerender', render: () => rerender(root), javaLine: 17, message: t('m.bst.5', { p0: value, p1: cur.value }) };
                yield { type: 'insert', nodeId: `bst-node-${node.id}`, javaLine: 17, message: t('m.bst.6', { p0: value }) };
                return;
            }
            cur = cur.left;
        } else if (value > cur.value) {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 18, message: t('m.bst.7', { p0: value, p1: cur.value }) };
            if (!cur.right) {
                cur.right = node;
                yield { type: 'rerender', render: () => rerender(root), javaLine: 18, message: t('m.bst.8', { p0: value, p1: cur.value }) };
                yield { type: 'insert', nodeId: `bst-node-${node.id}`, javaLine: 18, message: t('m.bst.9', { p0: value }) };
                return;
            }
            cur = cur.right;
        } else {
            yield { type: 'found', nodeId: `bst-node-${cur.id}`, javaLine: 18, message: t('m.bst.10', { p0: value }) };
            return;
        }
    }
}

// ── SEARCH ───────────────────────────────────────────────────────
function* bstSearch(value) {
    let cur = root;

    if (!cur) {
        yield { type: 'visit', javaLine: 23, message: t('m.bst.11') };
        return;
    }

    while (cur) {
        yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 24, message: t('m.bst.12', { p0: cur.value }) };

        if (value === cur.value) {
            yield { type: 'found', nodeId: `bst-node-${cur.id}`, javaLine: 25, message: t('m.bst.13', { p0: value }) };
            return;
        }

        if (value < cur.value) {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 26, message: t('m.bst.14', { p0: value, p1: cur.value }) };
            cur = cur.left;
        } else {
            yield { type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: 26, message: t('m.bst.15', { p0: value, p1: cur.value }) };
            cur = cur.right;
        }
    }

    yield { type: 'visit', javaLine: 26, message: t('m.bst.16', { p0: value }) };
}

// ── DELETE ───────────────────────────────────────────────────────
// Përdor successor-in in-order për rastin me dy fëmijë, ashtu si kodi Java.
// javaLine-t këtu ndjekin deleteRec() rresht për rresht (30-41 në JAVA_SOURCE);
// rastet majtas/djathtas janë dinamike, njësoj si te bstInsert.
function* bstDelete(value) {
    if (!root) {
        yield { type: 'visit', javaLine: 31, message: t('m.bst.17') };
        return;
    }

    let parent = null;
    let cur = root;
    while (cur && cur.value !== value) {
        const goingLeft = value < cur.value;
        yield {
            type: 'visit', nodeId: `bst-node-${cur.id}`, javaLine: goingLeft ? 32 : 33,
            message: t(goingLeft ? 'm.bst.goLeft' : 'm.bst.goRight', { v: value, c: cur.value })
        };
        parent = cur;
        cur = goingLeft ? cur.left : cur.right;
    }

    if (!cur) {
        yield { type: 'visit', javaLine: 31, message: t('m.bst.18', { p0: value }) };
        return;
    }

    const replaceChild = (oldNode, nextNode) => {
        if (!parent) root = nextNode;
        else if (parent.left === oldNode) parent.left = nextNode;
        else parent.right = nextNode;
    };

    if (!cur.left && !cur.right) {
        yield { type: 'delete', nodeId: `bst-node-${cur.id}`, javaLine: 35, message: t('m.bst.19', { p0: value }) };
        replaceChild(cur, null);
        yield { type: 'rerender', render: () => rerender(root), javaLine: 35, message: t('m.bst.20', { p0: value }) };
        return;
    }

    if (!cur.left || !cur.right) {
        const child = cur.left || cur.right;
        const childLine = !cur.left ? 35 : 36; // node.left == null → line 35, node.right == null → line 36
        yield {
            type: 'replace', nodeId: `bst-node-${cur.id}`, replacementNodeId: `bst-node-${child.id}`,
            javaLine: childLine, message: t('m.bst.21', { p0: value, p1: child.value })
        };
        replaceChild(cur, child);
        yield { type: 'rerender', render: () => rerender(root), javaLine: childLine, message: t('m.bst.22', { p0: value }) };
        return;
    }

    let successorParent = cur;
    let successor = cur.right;
    yield { type: 'visit', nodeId: `bst-node-${successor.id}`, javaLine: 37, message: t('m.bst.23', { p0: successor.value }) };
    while (successor.left) {
        successorParent = successor;
        successor = successor.left;
        yield { type: 'visit', nodeId: `bst-node-${successor.id}`, javaLine: 44, message: t('m.bst.24', { p0: successor.value }) };
    }

    yield {
        type: 'replace', nodeId: `bst-node-${cur.id}`, replacementNodeId: `bst-node-${successor.id}`,
        javaLine: 37, message: t('m.bst.25', { p0: successor.value, p1: cur.value })
    };
    cur.value = successor.value;
    yield { type: 'delete', nodeId: `bst-node-${successor.id}`, javaLine: 38, message: t('m.bst.26', { p0: successor.value }) };
    if (successorParent.left === successor) successorParent.left = successor.right;
    else successorParent.right = successor.right;
    yield { type: 'rerender', render: () => rerender(root), javaLine: 37, message: t('m.bst.27', { p0: value }) };
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
        yield { type: 'visit', javaLine: 46, message: t('m.bst.28') };
        return;
    }

    const result = [];
    yield { type: 'traversal-start', message: t('m.bst.29', { p0: name }) };

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
            message: t('m.bst.30', { p0: name, p1: result.join(' → ') })
        };
    }

    yield* visit(root);
    yield { type: 'traversal-complete', traversal: result, message: t('m.bst.31', { p0: name, p1: result.join(' → ') }) };
}

// Eksporti i funksionit kryesor që thërret main.js (butoni "Krijo pemën")
// VETËM ndërton pemën — kërkimi është veprim i veçantë, eksplicit (btn-bst-search)
function* bstAlgorithm(values = [5, 3, 7, 1, 4, 6, 8]) {
    init();
    for (const v of values) yield* bstInsert(v);
}

export { bstAlgorithm, bstInsert, bstSearch, bstDelete, bstTraverse, init, JAVA_SOURCE };