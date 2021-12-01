import {
  positiveCol,
  negativeCol,
  parentPositiveCol,
  neutralCol,
} from "app/constants";

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

// Non-vis DOM manipulation

export const showHabitLabel = () =>
  (document.querySelector(".mask-wrapper").style.height = "5rem");

export const setHabitLabel = (data) => {
  document.getElementById("current-habit").nextElementSibling.textContent =
    data?.name;
  document.getElementById("current-habit-sm").nextElementSibling.textContent =
    data?.name;
};

// Node Status helpers

export const oppositeStatus = (current) =>
  current === undefined || current === "false" || current == "incomplete"
    ? "true"
    : "false";

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

export const nodeExists = (node) =>
  // node.value !== undefined &&
  node?.data?.content && parseTreeValues(node.data.content).status !== "";

export const cumulativeValue = (node) => {
  const content = parseTreeValues(node.data.content).status;
  try {
    // if collapsed
    if (node?._children) {
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
      return 1;
    } else if (node && node.children) {
      // console.log(
      //   "object :>> ",
      //   sumChildrenValues(node) >= node.children.length,
      //   node.children.every((n) => cumulativeValue(n) === 1),
      //   sumChildrenValues(node)
      // );
      return +(
        // Were all descendant nodes accumulated to have a 1 value each?
        (
          sumChildrenValues(node) >= node.children.length &&
          node.children.every((n) => cumulativeValue(n) === 1)
        )
      );
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
    return neutralCol;

  const status = parseTreeValues(d.data.content).status;

  if (status == "false" && currentHierarchy.leaves().includes(d))
    return negativeCol;

  if (cumulativeValue(d) === 0 && status === "true") return parentPositiveCol; // Node is complete but some of its descendants are not.

  switch (cumulativeValue(d)) {
    case 1:
      return positiveCol;
    case 0:
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

export const collapseAroundAndUnder = function (
  node,
  cousinCollapse = true,
  auntCollapse = true
) {
  let minExpandedDepth = node.depth + 3;
  // For collapsing the nodes 'two levels lower' than selected
  let descendantsToCollapse = node
    .descendants()
    .filter((n) => n.depth >= minExpandedDepth);

  // For collapsing cousin nodes (saving width)
  let nodeCousins = [];
  if (cousinCollapse) {
    nodeCousins = cousins(node, rootData);
  }
  // For collapsing cousin nodes (saving width)
  let aunts = [];
  if (node.depth > 1 && auntCollapse && rootData.children) {
    aunts = greatAunts(node, rootData);
  }
  descendantsToCollapse.concat(nodeCousins).concat(aunts).forEach(collapse);
};
