// src/algorithms/datastructures/hashmap/index.js

import { render, BUCKET_COUNT } from '../../../engine/hashMapRenderer.js';

const JAVA_SOURCE =
`public class HashMapDemo {
    static final int BUCKETS = 8;

    static class Entry {
        String key; int value; Entry next;
        Entry(String k, int v) { key = k; value = v; }
    }

    private Entry[] table = new Entry[BUCKETS];

    static int hash(String key) {
        int sum = 0;
        for (char c : key.toCharArray()) sum += c;
        return sum % BUCKETS;
    }

    public void put(String key, int value) {
        int index = hash(key);
        Entry cur = table[index];
        while (cur != null) {
            if (cur.key.equals(key)) { cur.value = value; return; }
            cur = cur.next;
        }
        Entry node = new Entry(key, value);
        node.next  = table[index];
        table[index] = node;
    }

    public Integer get(String key) {
        int index = hash(key);
        Entry cur = table[index];
        while (cur != null) {
            if (cur.key.equals(key)) return cur.value;
            cur = cur.next;
        }
        return null;
    }

    public void remove(String key) {
        int index = hash(key);
        Entry prev = null, cur = table[index];
        while (cur != null) {
            if (cur.key.equals(key)) {
                if (prev == null) table[index] = cur.next;
                else prev.next = cur.next;
                return;
            }
            prev = cur; cur = cur.next;
        }
    }
}`;

let buckets = Array.from({ length: BUCKET_COUNT }, () => []);
let uidCnt  = 0;

function hash(key) {
    let sum = 0;
    for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
    return sum % BUCKET_COUNT;
}

function init() {
    buckets = Array.from({ length: BUCKET_COUNT }, () => []);
    uidCnt  = 0;
    render(buckets);
}

// ── PUT ──────────────────────────────────────────────────────────
function* put(key, value) {
    let sum = 0;
    for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
    const idx = sum % BUCKET_COUNT;

    yield {
        type: 'hash', dsType: 'hashmap',
        bucketIndex: idx,
        message: `hash("${key}") = ${sum} % ${BUCKET_COUNT} = ${idx}.`,
        javaLine: 12,
    };

    const chain = buckets[idx];
    const existing = chain.find(e => e.key === key);

    if (existing) {
        yield { type: 'compare', dsType: 'hashmap', nodeId: `hm-entry-${existing.id}`, message: `Çelësi "${key}" ekziston — përditësojmë vlerën.`, javaLine: 19 };
        existing.value = value;
        yield { type: 'rerender', dsType: 'hashmap', render: () => render(buckets), nodeId: `hm-entry-${existing.id}`, message: `Vlera u përditësua: ${value}.`, javaLine: 19 };
        return;
    }

    if (chain.length > 0) {
        yield { type: 'compare', dsType: 'hashmap', message: `Collision: bucket [${idx}] ka ${chain.length} hyrje. Shtojmë me chaining.`, javaLine: 22 };
    }

    const entry = { id: uidCnt++, key, value };
    chain.push(entry);

    yield {
        type: 'rerender', dsType: 'hashmap',
        render: () => render(buckets),
        nodeId: `hm-entry-${entry.id}`,
        javaLine: 23,
        message: `("${key}", ${value}) u shtua në bucket [${idx}].`,
    };

    yield { type: 'insert', dsType: 'hashmap', nodeId: `hm-entry-${entry.id}`, javaLine: 23, message: `put() përfundoi.` };
}

// ── GET ──────────────────────────────────────────────────────────
function* get(key) {
    let sum = 0;
    for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
    const idx = sum % BUCKET_COUNT;

    yield { type: 'hash', dsType: 'hashmap', bucketIndex: idx, message: `hash("${key}") = ${idx}. Kërkojmë në chain.`, javaLine: 29 };

    const chain = buckets[idx];
    for (const entry of chain) {
        yield { type: 'compare', dsType: 'hashmap', nodeId: `hm-entry-${entry.id}`, message: `Krahasojmë "${entry.key}" me "${key}".`, javaLine: 31 };
        if (entry.key === key) {
            yield { type: 'found', dsType: 'hashmap', nodeId: `hm-entry-${entry.id}`, message: `Gjendëm! "${key}" → ${entry.value}.`, javaLine: 32 };
            return;
        }
    }

    yield { type: 'compare', dsType: 'hashmap', bucketIndex: idx, message: `"${key}" nuk u gjet.`, javaLine: 34 };
}

// ── REMOVE ───────────────────────────────────────────────────────
function* remove(key) {
    let sum = 0;
    for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
    const idx = sum % BUCKET_COUNT;

    yield { type: 'hash', dsType: 'hashmap', bucketIndex: idx, message: `hash("${key}") = ${idx}. Kërkojmë për fshirje.`, javaLine: 38 };

    const chain = buckets[idx];
    for (let i = 0; i < chain.length; i++) {
        yield { type: 'compare', dsType: 'hashmap', nodeId: `hm-entry-${chain[i].id}`, message: `Kontrollojmë "${chain[i].key}".`, javaLine: 41 };
        if (chain[i].key === key) {
            const entryId = chain[i].id;
            yield { type: 'delete', dsType: 'hashmap', nodeId: `hm-entry-${entryId}`, message: `Gjendëm "${key}" — fshijmë.`, javaLine: 42 };
            chain.splice(i, 1);
            yield { type: 'rerender', dsType: 'hashmap', render: () => render(buckets), message: `"${key}" u fshi. Chain u rilidhë.`, javaLine: 43 };
            return;
        }
    }

    yield { type: 'compare', dsType: 'hashmap', message: `"${key}" nuk u gjet.`, javaLine: 41 };
}

export { init, put, get, remove, JAVA_SOURCE };
