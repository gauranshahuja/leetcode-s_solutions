'use strict';

const { test, summary } = require('../../lib/check');
const { TreeNode, buildTree, treeToArray } = require('../../lib/structures');

const NULL = '#';
const SEP = ',';

function serialize(root) {
  const out = [];

  function walk(node) {
    if (node === null) {
      out.push(NULL);
      return;
    }
    out.push(String(node.val));
    walk(node.left);
    walk(node.right);
  }

  walk(root);
  return out.join(SEP);
}

function deserialize(data) {
  if (typeof data !== 'string' || data.length === 0) return null;

  const tokens = data.split(SEP);
  let i = 0;

  function build() {
    const token = tokens[i];
    i += 1;
    if (token === undefined || token === NULL) return null;

    const node = new TreeNode(Number(token));
    node.left = build();
    node.right = build();
    return node;
  }

  return build();
}

function roundTrip(values) {
  return treeToArray(deserialize(serialize(buildTree(values))));
}

test('example tree survives the round trip', roundTrip([1, 2, 3, null, null, 4, 5]), [
  1, 2, 3, null, null, 4, 5,
]);
test('empty tree is just the marker, and decodes back to null', [serialize(null), deserialize('#')], [
  '#',
  null,
]);
test('single node', roundTrip([42]), [42]);
test(
  'exact encoding of the example, so the format itself is pinned down',
  serialize(buildTree([1, 2, 3, null, null, 4, 5])),
  '1,2,#,#,3,4,#,#,5,#,#'
);
test(
  'lopsided right chain keeps its shape',
  roundTrip([1, null, 2, null, 3, null, 4, null, 5, null, 6]),
  [1, null, 2, null, 3, null, 4, null, 5, null, 6]
);
test('lopsided left chain keeps its shape', roundTrip([1, 2, null, 3, null, 4]), [
  1, 2, null, 3, null, 4,
]);
test('negative and multi-digit values', roundTrip([-5, -1000, 15, null, null, -7, 2000]), [
  -5, -1000, 15, null, null, -7, 2000,
]);
test('zeros are values, not missing children', roundTrip([0, 0, 0, null, 0]), [0, 0, 0, null, 0]);
test(
  'serialising twice is stable (re-encoding a decoded tree gives the same string)',
  serialize(deserialize(serialize(buildTree([5, 3, 8, 1, null, 7, 9])))),
  serialize(buildTree([5, 3, 8, 1, null, 7, 9]))
);

summary('Day 133 - Serialize and Deserialize Binary Tree');

module.exports = { serialize, deserialize, roundTrip };
