import {
  positiveCol,
  negativeCol,
  positiveColLighter,
  neutralCol,
  noNodeCol,
} from "app/constants";

import { select, hierarchy } from "d3";

// General helpers

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

export const appendSvg = (divId) => {
  select(`#div${divId}`).empty() &&
    select(`#vis`)
      .append("svg")
      .attr("id", `div${divId}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("style", "pointer-events: all");
};

export const updateVisRootData = (
  visObject,
  currentHierarchy,
  routeChanged
) => {
  // Check if the hierarchy in the store is a new one (a new tree needs rendering)
  const compareString = JSON.stringify(currentHierarchy.data);
  const compareString2 = currentHierarchy
    ?.descendants()
    ?.map((n) => n.value)
    ?.join("");

  const visExists = visObject?._svgId;
  const newData =
    visExists &&
    (JSON.stringify(visObject.rootData.data) !== compareString ||
      visObject.rootData.descendants().map((n) => n.value).join`` !==
        compareString2);

  if (visExists && (newData || visObject.firstRender() || routeChanged)) {
    visObject._nextRootData = hierarchy(currentHierarchy.data);

    // Account for second page load of an already instantiated vis
    if (routeChanged) {
      visObject._nextRootData.routeChanged = true;
      visObject.clearFirstRenderFlag();
    }
    visObject.render();
    _p("Rendered from component & updated ", {}, "!");
    return visObject;
  }
};

// Node Status helpers

export const oppositeStatus = (current) =>
  [undefined, "false", "incomplete", ""].includes(current) ? "true" : "false";

export const sumChildrenValues = (node, hidden = false) => {
  const children = node?._children || node?.children || node?.data?.children;
  return children.reduce((sum, n) => sum + n.value, 0);
};

export const isNotALeaf = (node) => {
  return !(node?.height === 0) || !!node?._children;
};

export function getColor(completedStatus) {
  switch (completedStatus) {
    case true:
      return positiveCol;
    case false:
      return negativeCol;
    case "OOB":
      return noNodeCol;
    case "noHabitDate":
      return neutralCol;
    case "parentCompleted":
      return positiveColLighter;
    default:
      return noNodeCol;
  }
}

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

export const habitDatePersisted = (node) => {
  return (
    node?.data?.content && parseTreeValues(node.data.content).status !== ""
  );
};

export const cumulativeValue = (node) => {
  let content;
  try {
    content = parseTreeValues(node.content || node?.data.content)?.status;
  } catch (error) {
    console.log("error accumulating values :>> ", error);
    console.log("content, node :>> ", content, node);
  }
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
    if (content === "true" || node?.value > 0) {
      if (!!node?.children && node?.children?.length > 0) {
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

export const nodeStatusColours = (d) => {
  // Guard clause for 'no record'
  if (typeof d === "undefined" || typeof d.data.content === "undefined")
    return noNodeCol;

  if (d.height !== 0) {
    // debugger;
  }
  const cumulativeVal =
    d.height == 0 && d?.value ? d.value : cumulativeValue(d);
  const status = parseTreeValues(d.data.content).status;
  if (
    d.height === 0 ||
    d?._children?.every(
      (d) => parseTreeValues(d.data.content).status === "OOB"
    ) ||
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
      if (status == "true") {
        return positiveColLighter;
      } // Node is complete but some of its descendants are not.
      return negativeCol;
    default:
      return neutralCol;
  }
};

// Node/tree manipulation helpers

export const nodeWithoutHabitDate = (data) =>
  data && parseTreeValues(data.content)?.status == "";

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

export const cousins = (node, root) => {
  return root.descendants().filter((n) => n.depth == node.depth && n !== node);
};

export const greatAunts = (node, root) =>
  root.descendants().filter((n) => !n.ancestors().includes(node?.parent));

export const nodesForCollapse = function (
  node,
  { cousinCollapse = true, auntCollapse = true }
) {
  let minExpandedDepth = node.depth + 2;
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
    aunts = greatAunts(node, this.rootData).filter(
      (n) => !node.ancestors().includes(n)
    );
  }
  return descendantsToCollapse.concat(nodeCousins).concat(aunts);
};
