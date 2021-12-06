import {
  positiveCol,
  negativeCol,
  parentPositiveCol,
  neutralCol,
  noNodeCol,
} from "app/constants";

import { hierarchy } from "d3";

// General helpers

export const isTouchDevice = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

export const debounce = function (func, delay) {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(null, args), delay);
  };
};

export const radialPoint = (x, y) => {
  return [(y = +y) * Math.cos((x -= Math.PI / 2)), y * Math.sin(x)];
};

export const getTransform = (node, xScale) => {
  if (typeof node === "undefined") return;
  var x = node.__data__ ? node.__data__.x : node.x;
  var y = node.__data__ ? node.__data__.y : node.y;
  var bx = x * xScale;
  var by = y * xScale;
  var tx = -bx;
  var ty = -by;
  return { translate: [tx, ty], scale: xScale };
};

export const updateVisRootData = (visObject, currentHierarchy) => {
  // Check if the hierarchy in the store is a new one (a new tree needs rendering)
  const compareString = JSON.stringify(currentHierarchy.data);

  if (
    visObject?._svgId &&
    JSON.stringify(visObject.rootData.data) !== compareString
  ) {
    visObject._nextRootData = hierarchy(currentHierarchy.data);
    visObject.render();
    _p("Rendered from component & updated ", {}, "!");
  }
};

// Node Status helpers

export const oppositeStatus = (current) =>
  [undefined, "false", "incomplete", ""].includes(current) ? "true" : "false";

export const sumChildrenValues = (node, hidden = false) =>
  hidden
    ? node._children.reduce((sum, n) => sum + n.value, 0)
    : node.children.reduce((sum, n) => sum + n.value, 0);

export const parseTreeValues = (valueString) => {
  if (typeof valueString === "undefined") return;
  let splitValues, status, left, right;
  try {
    [splitValues, status] = valueString.split("-");
    [, left, right] = splitValues.split(/\D/);

    return { left, right, status };
  } catch {
    console.log(valueString, "Error Parsing");
  }
};

export const outOfBoundsNode = (d, rootData) => {
  return nodeStatusColours(d, rootData) == noNodeCol;
};

export const habitDatePersisted = (node) =>
  node?.data?.content && parseTreeValues(node.data.content).status !== "";

export const cumulativeValue = (node) => {
  const content = parseTreeValues(node.content).status;
  try {
    // if collapsed
    if (!!node?._children) {
      return +(
        // return 1 or 0
        (
          sumChildrenValues(node, true) >= node._children.length &&
          node._children.every((n) => cumulativeValue(n) === 1)
        ) // All children have accumulated value 1
      );
    }
    // if expanded
    if (content === "true") {
      if (node && node?.children.length > 0) {
        return +(
          // Were all descendant nodes accumulated to have a 1 value each?
          (
            sumChildrenValues(node) >= node.children.length &&
            node.children.every((n) => cumulativeValue(n) === 1)
          )
        );
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  } catch (err) {
    console.log("Could not accumulate.");
  }
};

export const contentEqual = (node, other) =>
  node.content.split("-").slice(0, 1)[0] ==
  other.content.split("-").slice(0, 1)[0];

export const nodeStatusColours = (d, currentHierarchy) => {
  // Guard clause for 'no record'
  if (typeof d === "undefined" || typeof d.data.content === "undefined")
    return noNodeCol;
  const cumulativeVal = cumulativeValue(d?.data || d);
  const status = parseTreeValues(d.data.content).status;
  if (
    currentHierarchy.leaves().includes(d) ||
    d?.children?.every((d) => parseTreeValues(d.data.content).status === "OOB")
  ) {
    if (status == "true") return positiveCol;
    if (status == "false") return negativeCol;
  }
  if (status == "OOB") return noNodeCol; // Untracked (out of bounds) nodes are neutral

  switch (cumulativeVal) {
    case 1: // All descendants are positive
      return positiveCol;
    case 0: // Not all descendants are positive
      if (status == "true") return parentPositiveCol; // Node is complete but some of its descendants are not.
      return negativeCol;
    default:
      return neutralCol;
  }
};

// Node/tree manipulation helpers

export const deadNode = (event) =>
  event.target.__data__.data &&
  parseTreeValues(event.target.__data__.data.content)?.status == "";

export function expand(d) {
  var children = d.children ? d.children : d._children;
  if (d._children) {
    d.children = d._children;
    d._children = null;
  }
  if (children) children.forEach(expand);
}

export function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

export const cousins = (node, root) =>
  root.descendants().filter((n) => n.depth == node.depth && n !== node);

export const greatAunts = (node, root) =>
  root.children.filter((n) => !node.ancestors().includes(n));

export const nodesForCollapse = function (
  node,
  { cousinCollapse = true, auntCollapse = true }
) {
  let minExpandedDepth = node.depth + 3;
  // For collapsing the nodes 'two levels lower' than selected
  let descendantsToCollapse = node
    .descendants()
    .filter((n) => n.depth >= minExpandedDepth);
  // For collapsing cousin nodes (saving width)
  let nodeCousins = [];
  if (cousinCollapse) {
    nodeCousins = cousins(node, this.rootData);
  }
  // For collapsing cousin nodes (saving width)
  let aunts = [];
  if (node.depth > 1 && auntCollapse && this.rootData.children) {
    aunts = greatAunts(node, this.rootData);
  }
  console.log("desce :>> ", nodeCousins, aunts);
  descendantsToCollapse.concat(nodeCousins).concat(aunts);
};
