import {
  select,
  scaleOrdinal,
  scaleLinear,
  zoom,
  zoomIdentity,
  linkVertical,
  linkRadial,
  linkHorizontal,
  tree,
  cluster,
  easeCubic,
  easePolyOut,
} from "d3";
import { legendColor } from "d3-svg-legend";
import Hammer from "hammerjs";
import _ from "lodash";

import { store } from "app/store";
import { selectCurrentNodeByMptt } from "features/node/selectors";
import {
  selectCurrentHabit,
  selectCurrentHabitByMptt,
} from "features/habit/selectors";
import { fetchHabitDatesREST } from "features/habitDate/actions";
import { selectCurrentHabitDate } from "features/habitDate/selectors";
import UISlice from "features/ui/reducer";
const { toggleConfirm } = UISlice.actions;
import HabitSlice from "features/habit/reducer";
const { updateCurrentHabit } = HabitSlice.actions;
import NodeSlice from "features/node/reducer";
const { updateCurrentNode } = NodeSlice.actions;
import HabitDateSlice from "features/habitDate/reducer";
const { updateHabitDateForNode } = HabitDateSlice.actions;

import {
  getTransform,
  radialPoint,
  expand,
  collapse,
  nodesForCollapse,
  deadNode,
  oppositeStatus,
  contentEqual,
  nodeStatusColours,
  parseTreeValues,
  cumulativeValue,
  isTouchDevice,
  habitDatePersisted,
  outOfBoundsNode,
} from "./components/helpers";

import {
  positiveCol,
  negativeCol,
  noNodeCol,
  neutralCol,
  parentPositiveCol,
} from "app/constants";

const BASE_SCALE = 1;
const FOCUS_MODE_SCALE = 1;
const LABEL_SCALE = 1.5;
const BUTTON_SCALE = 2;
const XS_NODE_RADIUS = 60;
const LG_NODE_RADIUS = 50;
const XS_LEVELS_HIGH = 3;
const LG_LEVELS_HIGH = 3;
const XS_LEVELS_WIDE = 3;
const LG_LEVELS_WIDE = 3;
const DEFAULT_MARGIN = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};
export default class Visualization {
  constructor(svgId, inputTree, canvasHeight, canvasWidth, margin, type) {
    this.type = type;
    this.isDemo = false;
    this._svgId = svgId;
    this.rootData = inputTree;
    this._viewConfig = {
      scale: BASE_SCALE,
      clickScale: FOCUS_MODE_SCALE,
      margin: margin || DEFAULT_MARGIN,
      canvasHeight,
      canvasWidth,
      defaultCanvasTranslateX: () => {
        if (
          // there was a previous zoom/translate to a node
          typeof this._zoomConfig.previousRenderZoom?.node?.x !== "undefined"
        ) {
          const radialTranslate = radialPoint(
            this._zoomConfig.previousRenderZoom?.node?.x,
            this._zoomConfig.previousRenderZoom?.node?.y
          );
          // then add the node's coordinates
          return this.type == "cluster"
            ? this._viewConfig.levelsWide * this._viewConfig.nodeRadius -
                this._zoomConfig.previousRenderZoom?.node?.y +
                this._viewConfig.viewportW / 4
            : this._viewConfig.viewportW / 2 -
                (this.type == "radial"
                  ? radialTranslate[0]
                  : this._zoomConfig.previousRenderZoom?.node?.x);
        } else {
          // Initial translation settings
          return this.type == "cluster"
            ? this._viewConfig.levelsWide * this._viewConfig.nodeRadius +
                this._viewConfig.canvasWidth / 2
            : this._viewConfig.viewportW / 2;
        }
      },
      defaultCanvasTranslateY: () => {
        if (
          // there was a previous zoom/translate to a node
          typeof this._zoomConfig.previousRenderZoom?.node?.y !== "undefined"
        ) {
          const radialTranslate = radialPoint(
            this._zoomConfig.previousRenderZoom?.node?.x,
            this._zoomConfig.previousRenderZoom?.node?.y
          );
          // then add the node's coordinates
          return this.type == "cluster"
            ? this._viewConfig.levelsHigh * this._viewConfig.nodeRadius -
                this._zoomConfig.previousRenderZoom?.node?.x +
                this._viewConfig.viewportH / 2
            : -(this.type == "radial"
                ? radialTranslate[1]
                : this._zoomConfig.previousRenderZoom?.node?.x) +
                (+(this.type == "radial") * this._viewConfig.viewportH) / 2;
        } else {
          // Initial translation settings
          return this.type == "cluster" || this.type == "radial"
            ? -this._viewConfig.levelsHigh * this._viewConfig.nodeRadius +
                this._viewConfig.viewportH / 2
            : 0;
        }
      },
      isSmallScreen: function () {
        return this.canvasWidth < 768;
      },
    };

    this._zoomConfig = {
      globalZoom: 1,
      previousRenderZoom: {},
      zoomedInView: function () {
        return Object.keys(this.previousRenderZoom).length !== 0;
      },
    };

    this.eventHandlers = {
      handlePrependNode: function (event, node) {
        let isRoot = node.parent == undefined;
        store.dispatch(toggleConfirm({ type: "Prepend" }));
      },
      handleAppendNode: function (event, node) {
        store.dispatch(toggleConfirm({ type: "Append" }));
      },
      handleDeleteNode: function (event, node) {
        this.setCurrentHabit(node);
        store.dispatch(toggleConfirm({ type: "Delete" }));
      },
      handleNodeZoom: function (event, node, forParent = false) {
        if (!event || !node || event.deltaY >= 0) return;
        this._zoomConfig.globalZoomScale = this._viewConfig.clickScale;
        const parentNode = { ...node.parent };
        // Set for cross render transformation memory
        this._zoomConfig.previousRenderZoom = {
          event: event,
          node: forParent ? parentNode : node,
          content: node.data,
          scale: this._zoomConfig.globalZoomScale,
        };
        select(".canvas")
          .transition()
          .ease(easePolyOut)
          .duration(this.isDemo ? 0 : 550)
          .attr(
            "transform",
            `translate(${this._viewConfig.defaultCanvasTranslateX()},${this._viewConfig.defaultCanvasTranslateY()}), scale(${
              this._zoomConfig.globalZoomScale
            })`
          );
      },
      handleNodeFocus: function (event, node) {
        event.preventDefault();

        const targ = event.target;
        if (targ.tagName == "circle") {
          // if (targ.closest(".the-node").classList.contains("active"))
          //   return this.reset({ justTranslation: false });
          if (deadNode(event)) {
            //P: There is no habit node for this habit. To track a habit for this day:
            // - GIVEN a non OOB, incomplete habit_date, we need a locally stored habitDate ONLY when the habit has been toggled to true.
            // - We need a visual representation of the node. When a node with this state is toggled, it has a nonPersisted habitDate in the store, set to COMPLETE (a red dot).
            // - Once a certain amount of time has passed, in order to save the data, we need to do a batch PUT request to the API to update the habit_dates for all habits on that date.
            // - Do this before moving to a new date
            // notify the user of the save with a flash message.
          }
          if (
            !(node.data.name == selectCurrentHabit(store.getState())?.meta.name)
          ) {
            this.setCurrentHabit(node);
            this.setCurrentNode(node);
          }
          // console.log("event,node :>> ", event, node);
          this.setActiveNode(node.data, event);

          this.activateNodeAnimation();

          if (!(this.type == "radial")) {
            const nodesToCollapse = nodesForCollapse
              .call(this, node, {
                cousinCollapse: false,
                auntCollapse: true,
              })
              .map((n) => n?.data?.content);
            console.log("nodesToCollapse :>> ", nodesToCollapse);
            this.rootData.each((node) => {
              if (nodesToCollapse.includes(node.data.content)) collapse(node);
            });
            expand(node?.parent ? node.parent : node);
          }
        }
      },
      handleStatusChange: function (node) {
        if (this.isNotALeaf(node)) {
          //  TODO: ENACT parentCompleted LOGIC
          // 3 state changes possible:
          // - FROM P_C to all subtree completed
          // - FROM P_N_C to all subtree completed
          // - FROM P_N_C to all subtree not-completed?
        }
        if (!habitDatePersisted(node)) {
          // return if not a leaf;
          // if !habitDateStored
          // then dispatch a new habitDate action.
          // turn the ui green for that node.
          // turn all single parents green too
          // alter the logic for parentCompleted nodes such that they recognise temp habitDates in the store
        } else {
        }

        const nodeContent = parseTreeValues(node.data.content);
        const currentStatus = nodeContent.status;
        // Toggle in memory
        node.data.content = node.data.content.replace(
          /true|false|incomplete/,
          oppositeStatus(currentStatus)
          // TODO:
          // 1.alter the node status in memory
          // 2. re-sum, re-accumulate node values.
          // 3. re-render without reloading hierarchy data.
        );
        if (!node.data.name.includes("Sub-Habit")) {
          // If this was not a ternarising/placeholder sub habit that we created just for more even distribution
          const habitId = selectCurrentHabit(store.getState())?.meta.id;
          store.dispatch(
            updateHabitDateForNode({ habitId, value: !currentStatus })
          );
        }
      },
      handleNodeToggle: function (event, node) {
        event.preventDefault();
        if (node.children) {
          // return;
          // Non-leaf nodes have auto-generated cumulative status
          // (Only leaves can toggle)
          //  TODO: ENACT parentCompleted LOGIC
        }
        this.previousRenderZoom = {
          event,
          node,
          content: node.data,
        };
        // if (deadNode(event)) return this.reset();
        // this.eventHandlers.handleStatusChange.call(this, node);

        console.log("NODE TOGGLE :>> ");
      },
      handleMouseEnter: function ({ target: d }) {
        this.currentTooltip = select(d).selectAll("g.tooltip");
        this.currentTooltip.transition().duration(450).style("opacity", "1");
        console.log("d :>> ", d);
        this.currentButton = select(d).selectAll("g.habit-label-dash-button");
        this.currentButton
          .transition()
          .delay(200)
          .duration(850)
          .style("opacity", "1");
      },
      handleMouseLeave: function (e) {
        const g = select(e.target);
        g.select(".tooltip").transition().duration(50).style("opacity", "0");
        g.select(".habit-label-dash-button")
          .transition()
          .delay(1000)
          .duration(150)
          .style("opacity", "0");
        setTimeout(() => {
          this.currentButton = false;
        }, 100);
        setTimeout(() => {
          this.currentTooltip = false;
        }, 500);
      },
      handleHover: function (e, d) {
        // If it is an animated concentric circle, delegate to parent node
        if (e.target.classList.length === 0) {
          d = e.target.parentElement.__data__;
        }
        if (parseTreeValues(d.data.content).status === "") return;
        e.stopPropagation();
        // Hide labels if they are not part of the current subtree
        if (
          !(
            this.activeNode !== undefined &&
            d.ancestors().includes(this.activeNode)
          )
        ) {
          return;
        }
      },
    };

    this.expand = function () {
      expand(this.rootData);
      this._nextRootData = this.rootData;
      this.render();
    };
    this.collapse = function () {
      collapse(this.rootData);
      this._nextRootData = this.rootData;
      this.render();
      this.reset({ justTranslation: true });
    };
  }

  zoomBase() {
    return select(`#${this._svgId}`);
  }

  firstRender() {
    return typeof this?._hasRendered == "undefined";
  }

  clearFirstRenderFlag() {
    delete this._hasRendered;
  }

  isNotALeaf(node) {
    !this.rootData.leaves().includes(node) || node?._children;
  }
  noCanvas() {
    return typeof this?._canvas == "undefined";
  }
  hasNextData() {
    return !!this?._nextRootData;
  }
  hasNewHierarchyData() {
    return (
      this.hasNextData() &&
      this._nextRootData !== JSON.stringify(this.rootData.data)
    );
  }

  setActiveNode(clickedNodeContent, event = null) {
    this.activeNode?.isNewActive && delete this.activeNode.isNewActive;

    this.activeNode = this.findNodeByContent(clickedNodeContent);
    this.activeNode && (this.activeNode.isNewActive = true);

    const currentActiveG = document.querySelector(".the-node.active");
    if (currentActiveG) currentActiveG.classList.toggle("active");
    event && event.target.closest(".the-node").classList.toggle("active");

    this.render();
    return this.activeNode;
  }
  findNodeByContent(node) {
    if (node === undefined || node.content === undefined) return;
    let found;
    this.rootData.each((n) => {
      if (contentEqual(n.data, node)) {
        found = n;
      }
    });
    return found;
  }
  setCurrentNode(node) {
    const nodeContent = parseTreeValues(node.data.content);
    let newCurrent = selectCurrentNodeByMptt(
      store.getState(),
      nodeContent.left,
      nodeContent.right
    );
    store.dispatch(updateCurrentNode(newCurrent));
  }
  setCurrentHabit(node) {
    const nodeContent = parseTreeValues(node.data.content);
    let newCurrent = selectCurrentHabitByMptt(
      store.getState(),
      nodeContent.left,
      nodeContent.right
    );
    if (!newCurrent) {
      window.FlashMessage.warning("Couldn't select habit");
      return;
    }
    store.dispatch(updateCurrentHabit(newCurrent));
    const s = store.getState();
    if (selectCurrentHabit(s)?.meta.id !== selectCurrentHabitDate(s)?.habitId) {
      store.dispatch(
        fetchHabitDatesREST({
          id: newCurrent?.meta.id,
          periodLength: 3, // TODO change this back to 7
        })
      );
    }
  }

  removeCanvas() {
    select(".canvas")?.remove();
  }

  clearCanvas() {
    select(".canvas").selectAll("*").remove();
  }

  reset({ justTranslation }) {
    this.scale = BASE_SCALE;
    this.zoomBase().attr("viewBox", this._viewConfig.defaultView);
    this._zoomConfig.previousRenderZoom = {};
    this.activeNode.isNew = null;
    this.activeNode = this.rootData;
    if (!justTranslation) {
      this.expand();
      document.querySelector(".the-node.active") &&
        document.querySelector(".the-node.active").classList.remove("active");
    }
    this._canvas.call(this.zoomer.transform, zoomIdentity);
  }

  setLevelsHighAndWide() {
    if (this._viewConfig.isSmallScreen()) {
      this._viewConfig.levelsHigh = this.previousRenderZoom
        ? XS_LEVELS_HIGH
        : XS_LEVELS_HIGH;
      this._viewConfig.levelsWide = this.previousRenderZoom
        ? XS_LEVELS_WIDE
        : XS_LEVELS_WIDE;
    } else {
      this._viewConfig.levelsHigh = LG_LEVELS_HIGH;
      this._viewConfig.levelsWide = LG_LEVELS_WIDE;
    }
  }
  setdXdY() {
    this._viewConfig.dx =
      this._viewConfig.canvasWidth / this._viewConfig.levelsHigh + // Adjust for cluster vertical spacing on different screens
      +(this.type == "cluster") * (this._viewConfig.isSmallScreen() ? 40 : 500);
    this._viewConfig.dy =
      this._viewConfig.canvasHeight / this._viewConfig.levelsWide -
      +(this.type == "cluster") * 0.2;

    //adjust for taller aspect ratio
    this._viewConfig.dx *= this._viewConfig.isSmallScreen() ? 2.25 : 0.5;
    this._viewConfig.dy *= this._viewConfig.isSmallScreen() ? 1.25 : 1.5;
  }
  setNodeRadius() {
    this._viewConfig.nodeRadius =
      (this._viewConfig.isSmallScreen() ? XS_NODE_RADIUS : LG_NODE_RADIUS) *
      this._viewConfig.scale;
  }
  setZoomBehaviour() {
    const zooms = function (e) {
      let t = { ...e.transform };
      let scale = t.k;

      t.x = t.x + this._viewConfig.defaultCanvasTranslateX() * scale;
      t.y = t.y + this._viewConfig.defaultCanvasTranslateY() * scale;
      select(".canvas")
        .attr("transform", `translate(${t.x},${t.y}), scale(${scale})`)
        .transition()
        .ease(easePolyOut)
        .duration(2500);
    };
    this.zoomer = zoom().scaleExtent([0.5, 5]).on("zoom", zooms.bind(this));
    this.zoomBase().call(this.zoomer);
  }

  calibrateViewPortAttrs() {
    this._viewConfig.viewportW =
      this._viewConfig.canvasWidth * this._viewConfig.levelsWide;
    this._viewConfig.viewportH =
      this._viewConfig.canvasHeight * this._viewConfig.levelsHigh;

    this._viewConfig.viewportX =
      this.type == "tree" ? this._viewConfig.canvasWidth / 6 : 0;
    this._viewConfig.viewportY =
      (-(this.type == "tree" ? 150 : -this._viewConfig.canvasHeight / 2) *
        this._viewConfig.levelsHigh) /
      4; // Adjust for initial y translation on different vis

    this._viewConfig.defaultView = `${this._viewConfig.viewportX} ${this._viewConfig.viewportY} ${this._viewConfig.viewportW} ${this._viewConfig.viewportH}`;
  }
  calibrateViewBox() {
    this.zoomBase()
      .attr("viewBox", this._viewConfig.defaultView)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .on("dblclick.zoom", null);
  }

  static sumHierarchyData(data) {
    if (!data?.sum) return;
    data.sum((d) => {
      // Return a binary interpretation of whether the habit was completed that day
      const thisNode = data.descendants().find((node) => node.data == d);
      let content = parseTreeValues(thisNode.data.content);

      if (content.status === "") return 0;
      if (content.status === "OOB") return 0;
      const statusValue = JSON.parse(content.status);
      return +statusValue;
    });
  }
  static accumulateNodeValues(data) {
    if (!data?.descendants) return;
    while (data.descendants().some((node) => node.value > 1)) {
      // Convert node values to binary based on whether their descendant nodes are all completed
      data.each((node, idx) => {
        if (node.value > 0) {
          node.value = cumulativeValue(node);
        }
      });
    }
  }
  activeOrNonActiveOpacity(d, dimmedOpacity) {
    if (
      !this.activeNode ||
      (!!this.activeNode &&
        [d]
          .concat(d?.parent?.children)
          .concat(d?.parent?._children)
          .concat(d?.children)
          .concat(d?._children)
          .includes(this.activeNode))
    )
      return "1";

    return dimmedOpacity;
  }

  getLinkPathGenerator() {
    switch (this.type) {
      case "tree":
        return linkVertical()
          .x((d) => d.x)
          .y((d) => d.y);
      case "cluster":
        return linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x);
      case "radial":
        return linkRadial()
          .angle((d) => d.x)
          .radius((d) => d.y);
    }
  }
  setLayout() {
    switch (this.type) {
      case "tree":
        this.layout = tree().size(
          this._viewConfig.canvasWidth,
          this._viewConfig.canvasHeight
        );
        break;
      case "cluster":
        this.layout = cluster().size(
          this._viewConfig.canvasWidth,
          this._viewConfig.canvasHeight
        );
        break;
      case "radial":
        this.layout = tree()
          .size(360, this._viewConfig.canvasWidth / 3)
          .separation(function (a, b) {
            return (a.parent == b.parent ? 0.2 : 14) / a.depth;
          });
        break;
    }
    this.layout.nodeSize([this._viewConfig.dx, this._viewConfig.dy]);
    try {
      this.layout(this.rootData);
    } catch (error) {
      _p("Failed layout data", this.rootData, "!");
      console.error(error);
    }
  }
  setNodeAndLinkGroups() {
    const transformation = `translate(${0}, ${0})`;
    this._gLink = this._canvas
      .append("g")
      .classed("links", true)
      .attr("transform", transformation);
    this._gNode = this._canvas
      .append("g")
      .classed("nodes", true)
      .attr("transform", transformation);
  }
  setNodeAndLinkEnterSelections() {
    const nodes = this._gNode.selectAll("g.node").data(
      this.rootData.descendants().filter((d) => {
        const outOfBounds = outOfBoundsNode(d, this.rootData);
        // Set new active node when this one is out of bounds
        if (outOfBounds && this.activeNode?.data.name == d.data.name) {
          this.setActiveNode(this.rootData);
        }

        return !outOfBounds;
      })
    ); // Remove habits that weren't being tracked then);

    this._enteringNodes = nodes
      .enter()
      .append("g")
      .attr("class", (d) => {
        return this.activeNode &&
          d.data.content === this.activeNode.data.content
          ? "the-node solid active"
          : "the-node solid";
      })
      .style("fill", (d) => {
        if (!habitDatePersisted(d)) return neutralCol;
        return nodeStatusColours(d, this.rootData);
      })
      .style("stroke", (d) =>
        nodeStatusColours(d, this.rootData) === parentPositiveCol
          ? positiveCol
          : noNodeCol
      )
      .style("opacity", (d) =>
        this.type == "tree" ? this.activeOrNonActiveOpacity(d, "0.5") : 1
      )
      .style("stroke-width", (d) =>
        // !!this.activeNode && d.ancestors().includes(this.activeNode)
        // TODO : memoize nodeStatus colours
        nodeStatusColours(d, this.rootData) === parentPositiveCol
          ? "40px"
          : "1px"
      )
      .attr("transform", (d) => {
        if (this.type == "radial")
          return "translate(" + radialPoint(d.x, d.y) + ")";
        return this.type == "cluster"
          ? `translate(${d.y},${d.x})`
          : `translate(${d.x},${d.y})`;
      })
      .call(this.bindEventHandlers.bind(this));

    // Links
    const links = this._gLink.selectAll("line.link").data(
      this.rootData
        .links()
        .filter(
          ({ source, target }) =>
            !outOfBoundsNode(source, this.rootData) &&
            !outOfBoundsNode(target, this.rootData)
        ) // Remove habits that weren't being tracked then
    );
    this._enteringLinks = links
      .enter()
      .append("path")
      .classed("link", true)
      .attr("stroke-opacity", (d) =>
        !this.activeNode ||
        (this.activeNode && this.activeNode.descendants().includes(d.source))
          ? 0.55
          : 0.3
      )
      .attr("d", this.getLinkPathGenerator());
  }
  setCircleAndLabelGroups() {
    this._gCircle = this._enteringNodes
      .append("g")
      .classed("node-subgroup", true);
    this._gTooltip = this._enteringNodes
      .append("g")
      .classed("tooltip", true)
      .attr(
        "transform",
        `translate(${this._viewConfig.nodeRadius / 10}, ${
          this._viewConfig.nodeRadius
        }), scale(${LABEL_SCALE})`
      )
      .attr("opacity", (d) => this.activeOrNonActiveOpacity(d, "0"));
  }
  setButtonGroups() {
    this._gButton = this._gCircle
      .append("g")
      .classed("habit-label-dash-button", true)
      .attr(
        "transform",
        `translate(${-2 * this._viewConfig.nodeRadius}, ${
          -1.5 * this._viewConfig.nodeRadius
        }), scale(${BUTTON_SCALE})`
      )
      .attr("style", "opacity: 0");
  }

  appendCirclesAndLabels() {
    this._gCircle
      .append("circle")
      .attr("r", this._viewConfig.nodeRadius)
      .on("mouseenter", this.eventHandlers.handleHover.bind(this));
  }
  appendLabels() {
    this._gTooltip
      .append("rect")
      .attr("width", 3)
      .attr("height", 45)
      .attr("x", -6)
      .attr("y", -25);

    this._gTooltip
      .append("rect")
      .attr("width", this.type == "radial" ? 130 : 275)
      .attr("height", 100)
      .attr("x", -6)
      .attr("y", -10)
      .attr("rx", 15);

    // Split the name label into two parts:
    this._gTooltip
      .append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text((d) => {
        const words = d.data.name.split(" ").slice(0, 6);
        return `${words[0] || ""} ${words[1] || ""} ${words[2] || ""} ${
          words[3] || ""
        }`;
      })
      .attr("transform", this.type == "radial" ? "scale(0.75)" : "");
    this._gTooltip
      .append("text")
      .attr("x", 5)
      .attr("y", 50)
      .text((d) => {
        const allWords = d.data.name.split(" ");
        const words = allWords.slice(0, 6);
        return `${words[4] || ""} ${words[5] || ""} ${words[6] || ""} ${
          allWords.length > 7 ? "..." : ""
        }`;
      })
      .attr("transform", this.type == "radial" ? "scale(0.75)" : "");

    this._enteringNodes
      .append("g")
      .attr("transform", "translate(" + "-20" + "," + "55" + ") scale( 2.5 )")
      .append("path")
      .attr("class", "expand-arrow")
      .attr("d", (d) => {
        return d._children
          ? "M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
          : null;
      })
      .style("fill", "#3D3229");
  }
  appendButtons() {
    const delBtnG = this._gButton.append("g");
    delBtnG
      .append("path")
      .attr("d", "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z")
      .attr("fill", "#e06a58")
      .on("click", this.eventHandlers.handleDeleteNode.bind(this));
    if (!this.isDemo) {
      this._gButton
        .append("rect")
        .attr("rx", 15)
        .attr("y", -30)
        .attr("width", 100)
        .attr("height", 30)
        .on("click", (e) => {
          e.stopPropagation();
        });
      this._gButton
        .append("text")
        .attr("x", 15)
        .attr("y", (d) => (d.parent ? -8 : -5))
        .text((d) => "APPEND")
        .on("click", (e, n) => {
          this.eventHandlers.handleAppendNode.call(this, e, n);
        });
      this._gButton
        .append("rect")
        .attr("style", (d) => (d.parent ? "opacity: 0" : "opacity: 1"))
        .attr("rx", 15)
        .attr("y", -55)
        .attr("width", 100)
        .attr("height", 30)
        .on("click", (e) => {
          e.stopPropagation();
        });
      this._gButton
        .append("text")
        .attr("style", (d) => (d.parent ? "opacity: 0" : "opacity: 1"))
        .attr("x", 12)
        .attr("y", -30)
        // .attr("x", 15)
        // .attr("y", -45)
        .text((d) => "PREPEND")
        .on("click", (e, n) => {
          this.eventHandlers.handlePrependNode.call(this, e, n);
        });
    }
  }

  bindEventHandlers(selection) {
    selection
      .on("click", (e, d) => {
        this.eventHandlers.handleNodeZoom.call(this, e, d, false);
        this.eventHandlers.handleNodeFocus.call(this, e, d);
      })
      .on("touchstart", this.eventHandlers.handleHover.bind(this), {
        passive: true,
      })
      .on("touchend", (e, d) => {
        this.eventHandlers.handleNodeFocus.call(this, e, d);
        this.eventHandlers.handleNodeToggle.call(this, e, d);
      })
      .on("contextmenu", (e, d) => {
        this.eventHandlers.handleNodeFocus.call(this, e, d);
        this.type != "radial" &&
          this.eventHandlers.handleNodeZoom.call(
            this,
            e,
            d,
            this.type == "tree"
          );
        this.eventHandlers.handleNodeToggle.call(this, e, d);
      })
      .on("mouseleave", this.eventHandlers.handleMouseLeave.bind(this))
      .on("mouseenter", this.eventHandlers.handleMouseEnter.bind(this));
    console.log(" selection._groups[0] :>> ", selection._groups[0]);
    // Mobile device events
    selection._groups[0].forEach((node) => {
      const manager = new Hammer.Manager(node);
      // Create a recognizer
      const singleTap = new Hammer.Tap({ event: "singletap" });
      const doubleTap = new Hammer.Tap({
        event: "doubletap",
        taps: 2,
        interval: 700,
      });
      manager.add([doubleTap, singleTap]);
      manager.get("singletap").requireFailure("doubletap");
      manager.on("singletap", (ev) => {
        ev.preventDefault();
        const content = ev.target.__data__.data.content;
        let parentNodeGroup = _.find(
          this._enteringNodes._groups[0],
          (n) => n?.__data__?.data?.content == content
        );
        ev.target = parentNodeGroup;
        this.eventHandlers.handleMouseEnter.call(this, ev, node.__data__);
      });
      manager.on("doubletap", (ev) => {
        ev.preventDefault();
        this.eventHandlers.handleNodeFocus.call(this, ev, node.__data__);
      });
    });
  }

  bindLegendEventHandler() {
    let infoCell = document.querySelector(".legend-svg .cell:first-child");
    console.log("infoCell :>> ", infoCell);
    infoCell.addEventListener("click", () => {
      debugger;
      let controlsSvg = document.querySelector(".controls-svg");
      controlsSvg.classList.toggle("hidden");
    });
  }

  addLegend() {
    const labels = [
      "",
      "Completed",
      "Not Yet Tracked",
      "Incomplete",
      "Incomplete Subtree",
    ];
    const legendScale = this._viewConfig.isSmallScreen()
      ? BASE_SCALE / 2
      : BASE_SCALE;
    const ordinal = scaleOrdinal()
      .domain(labels)
      .range([noNodeCol, positiveCol, neutralCol, negativeCol, positiveCol]);

    const legendSvg = select("svg.legend-svg");
    const controlsSvg = select("svg.controls-svg");
    const gText = controlsSvg
      .append("g")
      .attr("class", "controls")
      .attr("transform", `translate(${40}, ${38})scale(${legendScale})`);
    const gLegend = legendSvg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(5, ${120 * legendScale}) scale(${legendScale})`
      );

    // Borrowing the habit label for the legend
    if (isTouchDevice()) {
      gText
        .append("text")
        .text("Single Tap -> Select Habit & Focus")
        .attr("y", -45);
      gText
        .append("text")
        .text("Double Tap -> Select Family/Tick Off Habit")
        .attr("y", 30);
      gText.append("text").text("Swipe Left ---> Next Day").attr("y", 5);
      gText.append("text").text("Swipe Right ---> Last Day").attr("y", -10);
    } else {
      gText.append("text").text("L/Click ---> Mark Complete");
      gText.append("text").attr("y", 25).text("R/Click -> Focus");
      gText.append("text").text("Scroll Up -> Zoom").attr("y", -25);
    }
    const colorLegend = legendColor()
      .orient("horizontal")
      .labels(labels)
      .orient("vertical")
      .shape("circle")
      .shapeRadius(15)
      .shapePadding(-5)
      .scale(ordinal);
    gLegend.call(colorLegend);
    // TODO: Wire up controls svg displaying on event
  }

  activateNodeAnimation() {
    // https://stackoverflow.com/questions/45349849/concentric-emanating-circles-d3
    // Credit: Andrew Reid

    const gCircle = this.zoomBase().selectAll(
      "g.the-node.solid.active g.node-subgroup"
    );

    const pulseScale = scaleLinear()
      .range(["#fff", "#5568d2", "#3349c1"])
      .domain([0, 3 * this._viewConfig.nodeRadius]);

    const pulseData = [
      0,
      this._viewConfig.nodeRadius,
      this._viewConfig.nodeRadius * 2,
      this._viewConfig.nodeRadius * 2,
    ];

    const pulseCircles = gCircle
      .insert("g", ".habit-label-dash-button")
      .classed("active-circle", true)
      .attr("stroke-opacity", (d) => {
        return this.activeNode &&
          d.data.content === this.activeNode.data.content
          ? "0.8"
          : "0";
      })
      .selectAll("circle")
      .data(pulseData)
      .enter()
      .insert("circle", ".habit-label-dash-button")
      .attr("r", function (d) {
        return d;
      })
      .attr("fill", "none")
      .style("stroke-width", "4")
      .style("stroke", function (d) {
        return pulseScale(d);
      });

    const transition = function () {
      let data = pulseData
        .map((d) => {
          return d == 3 * this._viewConfig.nodeRadius
            ? 0
            : d + this._viewConfig.nodeRadius;
        })
        .slice(0, -2);

      var i = 0;
      // Grow circles
      pulseCircles
        .data(data)
        .filter(function (d) {
          return d > 0;
        })
        .transition()
        .ease(easeCubic)
        .attr("r", function (d) {
          return d;
        })
        .style("stroke", function (d) {
          return pulseScale(d);
        })
        .style("opacity", (d) => {
          return d == 3 * this._viewConfig.nodeRadius ? 0 : 1;
        })
        .duration(500);

      // Reset pulseCircles where r == 0
      pulseCircles
        .filter(function (d) {
          return d == 0;
        })
        .attr("r", 0)
        .style("opacity", 1)
        .style("stroke", function (d) {
          return pulseScale(d);
        });
    }.bind(this);
    transition();
  }

  render() {
    console.log("Rendering vis... :>>", this?._canvas);
    // _p("zoomconfig", this._zoomConfig, "info");
    if (!this.noCanvas()) {
      this._hasRendered = true;
      // this.removeCanvas();
    } else {
      this._canvas = select(`#${this._svgId}`)
        .append("g")
        .classed("canvas", true);
      console.log(
        "Configured canvas... :>>",
        this._canvas,
        "First render?",
        this.firstRender()
      );
    }
    if (this.firstRender()) {
      this.setNodeRadius();
      this.setLevelsHighAndWide();
      this.calibrateViewPortAttrs();
      this.calibrateViewBox();
      this.setdXdY();
      this._canvas.attr(
        "transform",
        `scale(${BASE_SCALE}), translate(${this._viewConfig.defaultCanvasTranslateX()}, ${this._viewConfig.defaultCanvasTranslateY()})`
      );
    }

    if (
      this.firstRender() ||
      this.hasNewHierarchyData() ||
      this.activeNode?.isNewActive
    ) {
      if (this.noCanvas()) return;

      // First render OR New hierarchy needs to be rendered
      // Update the current day's rootData
      if (this.hasNextData()) this.rootData = this._nextRootData;
      this.setLayout();

      //Render cleared canvas for OOB dates
      const isBlankData = this.rootData?.data?.content == "";
      if (isBlankData) {
        console.log("Rendered blank :>> ");
        this.clearCanvas();
        return;
      }
      if (!this.rootData.data.content) {
        debugger;
        this.rootData = this.rootData.data;
      }
      accumulateTree(this.rootData);
      console.log("Formed new layout", this, "!");

      this.setZoomBehaviour();
      this.clearCanvas();
      console.log("Cleared canvas :>> ");

      this.setNodeAndLinkGroups();
      this.setNodeAndLinkEnterSelections();
      this.setCircleAndLabelGroups();
      this.setButtonGroups();
      // console.log("Appended and set groups... :>>");
      this.appendCirclesAndLabels();
      this.appendLabels();
      this.appendButtons();
      console.log("Appended SVG elements... :>>");

      this._hasRendered = true;
    }
    _p("this._hasRendered :>> ", { has: this._hasRendered }, "!");

    if (!select("svg.legend-svg").empty() && select("svg .legend").empty()) {
      // console.log("Added legend :>> ");
      this.addLegend();
      this.bindLegendEventHandler();
    }

    console.log("this.activeNode :>> ", this.activeNode);
    if (!!this.activeNode) {
      this.activeNode?.isNew &&
        this.zoomBase().selectAll(".active-circle").remove();
      this.activateNodeAnimation();
    }
  }
}

export function accumulateTree(json) {
  try {
    Visualization.sumHierarchyData.call(null, json);
    Visualization.accumulateNodeValues.call(null, json);
  } catch (error) {
    console.error("Could not manipulate tree: ", error);
  }
}