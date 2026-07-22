import test from 'node:test';
import assert from 'node:assert/strict';

import { bubbleSort } from '../src/algorithms/sorting/bubble.js';
import { insertionSort } from '../src/algorithms/sorting/insertion.js';
import { selectionSort } from '../src/algorithms/sorting/selection.js';
import { mergeSort } from '../src/algorithms/sorting/merge.js';
import { quickSort } from '../src/algorithms/sorting/quick.js';
import { shellSort } from '../src/algorithms/sorting/shell.js';
import { heapSort } from '../src/algorithms/sorting/heap.js';
import { radixSort } from '../src/algorithms/sorting/radix.js';
import { dijkstra } from '../src/algorithms/graph/dijkstra.js';
import { kruskal } from '../src/algorithms/graph/kruskal.js';
import { cloneGraph, isValidNodeId } from '../src/graph/model.js';
import { run, getState } from '../src/engine/scheduler.js';
import { init as initBST, bstAlgorithm, bstDelete, bstTraverse } from '../src/algorithms/bst.js';

const sortingAlgorithms = {
  bubbleSort, insertionSort, selectionSort, mergeSort,
  quickSort, shellSort, heapSort, radixSort,
};

for (const [name, algorithm] of Object.entries(sortingAlgorithms)) {
  test(`${name} rendit vlerat, përfshirë dublikatat`, () => {
    let latestState = null;
    for (const step of algorithm([9, 0, 4, 4, 2, 8, 1])) {
      if (step.state) latestState = step.state;
    }
    assert.deepEqual(latestState, [0, 1, 2, 4, 4, 8, 9]);
  });
}

test('Dijkstra prodhon distanca, paraardhës dhe nyjën e përditësuar', () => {
  const steps = [...dijkstra()];
  const update = steps.find(step => step.type === 'edge-accept');
  const final = steps.at(-1).distanceState;

  assert.equal(update.distanceState.updatedNodeId, 'B');
  assert.equal(update.distanceState.predecessors.B, 'A');
  assert.deepEqual({ ...final.distances }, { A: 0, B: 4, C: 2, D: 9, E: 5, F: 13 });
  assert.deepEqual({ ...final.predecessors }, { A: null, B: 'A', C: 'A', D: 'E', E: 'C', F: 'E' });
});

test('Kruskal ruan peshën e pritur të MST-së', () => {
  const final = [...kruskal()].at(-1);
  assert.match(final.message, /21/);
});

test('modeli i grafit pranon vetëm ID të sigurta dhe snapshot-i shkëputet nga burimi', () => {
  assert.equal(isValidNodeId('Node_12'), true);
  assert.equal(isValidNodeId(']'), false);
  assert.equal(isValidNodeId('__proto__'), false);

  const source = { nodes: [{ id: 'A' }, { id: 'B' }], edges: [{ source: { id: 'A' }, target: { id: 'B' }, weight: 3 }] };
  const snapshot = cloneGraph(source);
  source.nodes[0].id = 'Changed';
  assert.deepEqual(snapshot, { nodes: [{ id: 'A' }, { id: 'B' }], edges: [{ source: 'A', target: 'B', weight: 3 }] });
});

test('scheduler-i çlirohet edhe kur onStep hedh gabim', async () => {
  function* steps() { yield { type: 'first' }; }
  let reported = false;
  await run(steps(), () => { throw new Error('test error'); }, () => assert.fail('nuk duhet të përfundojë'), 3, () => { reported = true; });
  assert.equal(reported, true);
  assert.deepEqual(getState(), { isRunning: false, isPaused: false });
});

function consume(generator) {
  return [...generator];
}

function buildBST(values) {
  initBST();
  consume(bstAlgorithm(values));
}

test('BST fshin leaf, nyjë me një fëmijë dhe root me dy fëmijë', () => {
  buildBST([5, 3, 7, 6, 8]);
  consume(bstDelete(3));
  assert.deepEqual(consume(bstTraverse('inorder')).at(-1).traversal, [5, 6, 7, 8]);

  buildBST([5, 3, 7, 6]);
  consume(bstDelete(7));
  assert.deepEqual(consume(bstTraverse('inorder')).at(-1).traversal, [3, 5, 6]);

  buildBST([5, 3, 7, 6, 8]);
  const deletion = consume(bstDelete(5));
  assert.equal(deletion.some(step => step.type === 'replace'), true);
  assert.deepEqual(consume(bstTraverse('inorder')).at(-1).traversal, [3, 6, 7, 8]);
});

test('BST traversal-et ruajnë rendin e saktë', () => {
  buildBST([5, 3, 7, 1, 4, 6, 8]);
  assert.deepEqual(consume(bstTraverse('inorder')).at(-1).traversal, [1, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(consume(bstTraverse('preorder')).at(-1).traversal, [5, 3, 1, 4, 7, 6, 8]);
  assert.deepEqual(consume(bstTraverse('postorder')).at(-1).traversal, [1, 4, 3, 6, 8, 7, 5]);
});
