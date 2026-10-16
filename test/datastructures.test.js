import test from 'node:test';
import assert from 'node:assert/strict';

import { linearSearch, JAVA_SOURCE as JAVA_LINEAR } from '../src/algorithms/searching/linear.js';
import { binarySearch, JAVA_SOURCE as JAVA_BINARY } from '../src/algorithms/searching/binary.js';

// Strukturat mbajnë gjendje në nivel moduli dhe init() prek DOM-in (render).
// Një URL e re (?t=...) i jep çdo testi instancë të re të modulit, me gjendje bosh.
let instance = 0;
const fresh = name => import(`../src/algorithms/datastructures/${name}/index.js?t=${instance++}`);

// Bashkon disa generator-ë në një listë hapash
const run = (...generators) => generators.flatMap(generator => [...generator]);
const messages = steps => steps.map(step => step.message);

// ─── KËRKIMI ──────────────────────────────────────────

test('Linear Search gjen indeksin e saktë ose raporton mosgjetjen', () => {
  assert.equal([...linearSearch([4, 2, 7, 2], 2)].find(s => s.type === 'found').indices[0], 1);
  assert.equal([...linearSearch([4, 2, 7], 9)].some(s => s.type === 'found'), false);
});

test('Binary Search gjen elementin me O(log n) krahasime', () => {
  const sorted = Array.from({ length: 64 }, (_, i) => i * 3);
  const steps = [...binarySearch(sorted, 129)];
  assert.equal(steps.find(s => s.type === 'found').indices[0], 43);
  // 64 elemente → maksimumi log2(64) + 1 = 7 iteracione me "mid=" krahasim
  assert.ok(steps.filter(s => s.message.startsWith('mid=')).length <= 7);
  assert.equal([...binarySearch(sorted, 130)].some(s => s.type === 'found'), false);
});

// ─── STRUKTURAT ───────────────────────────────────────

test('Stack ndjek rendin LIFO dhe s\'prishet kur është bosh', async () => {
  const stack = await fresh('stack');
  const log = messages(run(stack.push(1), stack.push(2), stack.push(3), stack.peek(), stack.pop(), stack.pop()));
  assert.ok(log.includes('peek(): elementi i majës është 3. Stack pa ndryshim.'));
  assert.deepEqual(log.filter(m => m.startsWith('pop()')), ['pop(): heqim elementin e majës 3.', 'pop(): heqim elementin e majës 2.']);

  const empty = await fresh('stack');
  assert.deepEqual(messages(run(empty.pop())), ['Stack është bosh — nuk ka çfarë të heqim.']);
});

test('Queue ndjek rendin FIFO', async () => {
  const queue = await fresh('queue');
  const log = messages(run(queue.enqueue(5), queue.enqueue(7), queue.dequeue(), queue.peek()));
  assert.ok(log.includes('dequeue(): heqim front-in 5.'));
  assert.ok(log.includes('peek(): front-i është 7. Queue pa ndryshim.'));
});

test('LinkedList fut në head/tail/pas vlerës dhe kërkon saktë', async () => {
  const list = await fresh('linkedlist');
  run(list.insertAtHead(2), list.insertAtTail(4), list.insertAtHead(1), list.insertAfterValue(3, 2));

  // lista duhet të jetë 1 → 2 → 3 → 4: kërkimi i 4 viziton nyjet me këtë rend
  const visited = messages(run(list.searchLL(4))).filter(m => m.startsWith('Kontrollojmë nyjen'));
  assert.deepEqual(visited, ['Kontrollojmë nyjen 1.', 'Kontrollojmë nyjen 2.', 'Kontrollojmë nyjen 3.', 'Kontrollojmë nyjen 4.']);
  assert.ok(messages(run(list.searchLL(9))).includes('9 nuk u gjet.'));
});

test('HashMap trajton collision, përditësim dhe fshirje', async () => {
  const map = await fresh('hashmap');
  // "ab" dhe "ba" kanë të njëjtën shumë karakteresh (195) → i njëjti bucket
  const putLog = messages(run(map.put('ab', 1), map.put('ba', 2), map.put('ab', 3)));
  assert.ok(putLog.some(m => m.startsWith('Collision: bucket [3]')));
  assert.ok(putLog.includes('Çelësi "ab" ekziston — përditësojmë vlerën.'));

  assert.ok(messages(run(map.get('ab'))).includes('Gjendëm! "ab" → 3.'));
  run(map.remove('ab'));
  assert.ok(messages(run(map.get('ab'))).includes('"ab" nuk u gjet.'));
  assert.ok(messages(run(map.get('ba'))).includes('Gjendëm! "ba" → 2.'));
});

test('HashMap fut hyrjen e re në fillim të chain-it, si kodi Java', async () => {
  const map = await fresh('hashmap');
  run(map.put('ab', 1), map.put('ba', 2));
  // get("ab") duhet të krahasojë fillimisht "ba" (i futuri i fundit = head)
  const compared = messages(run(map.get('ab'))).filter(m => m.startsWith('Krahasojmë'));
  assert.deepEqual(compared, ['Krahasojmë "ba" me "ab".', 'Krahasojmë "ab" me "ab".']);
});

// ─── SINKRONIZIMI ME KODIN JAVA ───────────────────────

// Çdo javaLine duhet të tregojë një rresht real kodi — jo jashtë kufijve,
// jo rresht bosh, jo vetëm "}". Ky test e zbuloi zhvendosjen e HashMap-it.
function assertJavaLinesValid(name, javaSource, steps) {
  const lines = javaSource.split('\n');
  for (const step of steps) {
    if (step.javaLine == null) continue;
    const line = lines[step.javaLine - 1];
    assert.ok(line !== undefined, `${name}: javaLine ${step.javaLine} jashtë kodit ("${step.message}")`);
    assert.ok(!/^\s*}?\s*$/.test(line), `${name}: javaLine ${step.javaLine} është bosh ose "}" ("${step.message}")`);
  }
}

test('javaLine e çdo hapi tregon një rresht real në kodin Java', async () => {
  assertJavaLinesValid('linear', JAVA_LINEAR, run(linearSearch([4, 2, 7], 7), linearSearch([4, 2], 9)));
  assertJavaLinesValid('binary', JAVA_BINARY, run(binarySearch([1, 3, 5, 7, 9], 7), binarySearch([1, 3, 5], 2)));

  const stack = await fresh('stack');
  assertJavaLinesValid('stack', stack.JAVA_SOURCE,
    run(stack.pop(), stack.peek(), stack.push(1), stack.peek(), stack.isEmpty(), stack.pop()));

  const queue = await fresh('queue');
  assertJavaLinesValid('queue', queue.JAVA_SOURCE,
    run(queue.dequeue(), queue.peek(), queue.enqueue(1), queue.peek(), queue.isEmpty(), queue.dequeue()));

  const list = await fresh('linkedlist');
  assertJavaLinesValid('linkedlist', list.JAVA_SOURCE,
    run(list.deleteLL(1), list.insertAtTail(1), list.insertAtHead(0), list.insertAfterValue(5, 1),
        list.insertAfterValue(6, 99), list.searchLL(5), list.searchLL(99), list.deleteLL(0), list.deleteLL(5)));

  const map = await fresh('hashmap');
  assertJavaLinesValid('hashmap', map.JAVA_SOURCE,
    run(map.put('ab', 1), map.put('ba', 2), map.put('ab', 3), map.get('ab'), map.get('zz'),
        map.remove('ab'), map.remove('ba'), map.remove('zz')));
});
