'use strict';

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function buildList(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of values) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

function listToArray(head) {
  const out = [];
  let node = head;
  let guard = 0;
  while (node && guard < 100000) {
    out.push(node.val);
    node = node.next;
    guard += 1;
  }
  return out;
}

function buildListWithCycle(values, pos) {
  const head = buildList(values);
  if (pos < 0 || !head) return head;

  let tail = head;
  while (tail.next) tail = tail.next;

  let target = head;
  for (let i = 0; i < pos; i += 1) target = target.next;

  tail.next = target;
  return head;
}

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(values) {
  if (!values || values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;

  while (queue.length && i < values.length) {
    const node = queue.shift();

    if (i < values.length) {
      const v = values[i];
      i += 1;
      if (v !== null && v !== undefined) {
        node.left = new TreeNode(v);
        queue.push(node.left);
      }
    }

    if (i < values.length) {
      const v = values[i];
      i += 1;
      if (v !== null && v !== undefined) {
        node.right = new TreeNode(v);
        queue.push(node.right);
      }
    }
  }

  return root;
}

function treeToArray(root) {
  if (!root) return [];

  const out = [];
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    if (node === null) {
      out.push(null);
      continue;
    }
    out.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }

  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

function inorder(root, out = []) {
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
  return out;
}

function preorder(root, out = []) {
  if (!root) return out;
  out.push(root.val);
  preorder(root.left, out);
  preorder(root.right, out);
  return out;
}

class PriorityQueue {
  constructor(compare = (a, b) => a - b) {
    this.heap = [];
    this.compare = compare;
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0];
  }

  push(value) {
    this.heap.push(value);
    this.#bubbleUp(this.heap.length - 1);
    return this.size;
  }

  pop() {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length) {
      this.heap[0] = last;
      this.#sinkDown(0);
    }
    return top;
  }

  #bubbleUp(index) {
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.heap[i], this.heap[parent]) >= 0) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  #sinkDown(index) {
    let i = index;
    const n = this.heap.length;
    for (;;) {
      const left = 2 * i + 1;
      const right = left + 1;
      let smallest = i;

      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) smallest = right;
      if (smallest === i) break;

      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

class DSU {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;
  }

  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }

  union(a, b) {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;

    if (this.rank[ra] < this.rank[rb]) {
      this.parent[ra] = rb;
    } else if (this.rank[ra] > this.rank[rb]) {
      this.parent[rb] = ra;
    } else {
      this.parent[rb] = ra;
      this.rank[ra] += 1;
    }
    this.count -= 1;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

module.exports = {
  ListNode,
  buildList,
  listToArray,
  buildListWithCycle,
  TreeNode,
  buildTree,
  treeToArray,
  inorder,
  preorder,
  PriorityQueue,
  DSU,
};
