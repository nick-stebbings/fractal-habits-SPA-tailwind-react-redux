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
// import Hammer from "hammerjs";

import { store } from "app/store";
import { selectCurrentNodeByMptt } from "features/node/selectors";
import { selectCurrentHabitByMptt } from "features/habit/selectors";
import { updateHabitDateREST } from "features/habitDate/actions";
import HabitSlice from "features/habit/reducer";
const { updateCurrentHabit } = HabitSlice.actions;
import NodeSlice from "features/node/reducer";
const { updateCurrentNode, updateNodeStatus } = NodeSlice.actions;

import {
  getTransform,
  showHabitLabel,
  setHabitLabel,
  expand,
  collapse,
  collapseAroundAndUnder,
  deadNode,
  oppositeStatus,
  contentEqual,
  nodeStatusColours,
  parseTreeValues,
  cumulativeValue,
  isTouchDevice,
} from "./components/helpers";

import { positiveCol, negativeCol, noNodeCol, neutralCol } from "app/constants";

function radialPoint(x, y) {
  return [(y = +y) * Math.cos((x -= Math.PI / 2)), y * Math.sin(x)];
}

const BASE_SCALE = 1;
const FOCUS_MODE_SCALE = 4;
const LABEL_SCALE = 1.5;
const BUTTON_SCALE = 1;
const XS_NODE_RADIUS = 10;
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
  constructor(svg, svgId, inputTree, canvasHeight, canvasWidth, margin, type) {
    this.type = type;
    this.isDemo = false;
    this._svgId = svgId;
    this.rootData = inputTree;
    this._viewConfig = {
      scale: BASE_SCALE,
      clickScale: FOCUS_MODE_SCALE,
      margin: DEFAULT_MARGIN,
      canvasHeight,
      canvasWidth,
      currentXTranslate: () =>
        this._viewConfig?.globalTranslate
          ? -this._viewConfig.globalTranslate[0]
          : this._viewConfig.margin.left * this._viewConfig.scale, // Initial translate
      currentYTranslate: () =>
        this._viewConfig?.globalTranslate
          ? -this._viewConfig.globalTranslate[0]
          : this._viewConfig.margin.top * this._viewConfig.scale, // Initial translate
      isSmallScreen: function () {
        return this.canvasWidth < 768;
      },
    };

    this._zoomConfig = {
      globalZoom: 1,
      zoomClicked: {},
      zoomedInView: function () {
        return Object.keys(this.zoomClicked).length !== 0;
      },
    };
    // Flags/metrics from previous render
    this.zoomsG = null;

    this.eventHandlers = {
      handlePrependNode: function (event, node) {},
      handleAppendNode: function (event, node) {},
      handleNodeZoom: function (event, node, forParent = false) {
        if (!event || !node || event.deltaY >= 0 || deadNode(event))
          return this.reset();
        this._zoomConfig.globalZoomScale = this._viewConfig.clickScale;
        this._viewConfig.globalTranslate = [node.x, node.y];
        this.setActiveNode(forParent ? node.data : node.data);
        expand(node);
        this.setCurrentHabit(node);
        this.setCurrentNode(node);
        this._zoomConfig.zoomClicked = {
          event: event,
          node: node,
          content: node.data,
          scale: this._zoomConfig.zoomClicked
            ? this._zoomConfig.scale //clickScale
            : this._zoomConfig.scale,
        };
      },
      clickedZoom: function (e, that) {
        if (e?.defaultPrevented || typeof that === "undefined") return; // panning, not clicking
        const transformer = getTransform(that, this._viewConfig.clickScale);
        _p("transformer.translate :>> ", transformer, "success");
        select(".canvas")
          .transition()
          .ease(easePolyOut)
          .ease(easePolyOut)
          .duration(this.isDemo ? 0 : 550)
          .attr(
            "transform",
            "translate(" +
              transformer.translate[0] +
              ", " +
              transformer.translate[1] +
              ")scale(" +
              transformer.scale +
              ")"
          );
      },
      handleNodeFocus: function (event, node) {
        event.preventDefault();
        this.activateNodeAnimation();

        this.setActiveNode(node.data);
        // const targ = event.target;
        // if (targ.tagName == "circle") {
        //   if (
        //     targ.closest(".the-node").classList.contains("active") ||
        //     deadNode(event)
        //   )
        //     return this.reset();

        //   this.setCurrentHabit(node);
        //   expand(node);

        //   this.zoomsG?.k && this.setNormalTransform();

        //   setHabitLabel(node.data);
        //   // showHabitLabel();
        //   collapseAroundAndUnder(node, false, false);
        //   if (!this.isDemo) {
        //    this.setCurrentNode(node)
        //   }
        // }
      },
      handleStatusChange: function (node) {
        if (!this.rootData.leaves().includes(node) || node._children) return; // Non-leaf nodes have auto-generated cumulative status
        // (Only leaves can toggle)
        this.setCurrentHabit(node);
        this.setCurrentNode(node);

        const nodeContent = parseTreeValues(node.data.content);
        const currentStatus = nodeContent.status;
        // Toggle in memory
        node.data.content = node.data.content.replace(
          /true|false|incomplete/,
          oppositeStatus(currentStatus)
        );

        if (!node.data.name.includes("Sub-Habit")) {
          // If this was not a ternarising/placeholder sub habit that we created just for more even distribution
          store.dispatch(updateNodeStatus(currentStatus));
        }
      },
      handleNodeToggle: function (event, node) {
        event.preventDefault();
        if (node.children) return;
        this.setActiveNode(node.data);
        this.activateNodeAnimation();
        this.zoomClicked = {
          event,
          node,
          content: node.data,
        };
        if (deadNode(event)) return this.reset();

        expand(node);
        this.render();
        this.eventHandlers.handleStatusChange.call(this, node);
        setHabitLabel(node.data);
        this.eventHandlers.clickedZoom.call(this, event, node?.parent, true);
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
        if (!this.currentTooltip) {
          this.zoomBase().select("g.tooltip").transition();
          this.currentTooltip = this.zoomBase()
            .selectAll("g.tooltip")
            .filter((t) => {
              return d == t;
            });
          this.currentTooltip.transition().duration(450).style("opacity", "1");
        }
        if (!this.currentButton) {
          this.zoomBase().select("g.habit-label-dash-button").transition();
          this.currentButton = this.zoomBase()
            .selectAll("g.habit-label-dash-button")
            .filter((t) => {
              return d == t;
            });
          this.currentButton
            .transition()
            .delay(200)
            .duration(850)
            .style("opacity", "1");
        }
      },
    };
  }

  zoomBase() {
    return select(`#${this._svgId}`);
  }

  setActiveNode(clickedNode) {
    this.activeNode = this.findNodeByContent(clickedNode);
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
    store.dispatch(updateCurrentHabit(newCurrent));
  }

  clearCanvas() {
    select(".canvas").selectAll("*").remove();
  }

  reset() {
    this.scale = BASE_SCALE;
    this.zoomBase().attr("viewBox", this._viewConfig.defaultView);
    this.expand();
    this._zoomConfig.zoomClicked = {};
    this.activeNode = null;
    document.querySelector(".the-node.active") &&
      document.querySelector(".the-node.active").classList.remove("active");
    this._canvas.call(this.zoomer.transform, zoomIdentity);
  }
  expand() {
    expand(this.rootData);
  }
  collapse() {
    collapse(this.rootData);
  }

  setNormalTransform() {
    this.zoomsG?.k && (this.zoomsG.k = this._viewConfig.clickScale);

    if (
      this.zoomsG?.x &&
      Object.keys(this._zoomConfig.zoomClicked).length > 0
    ) {
      // Set the translation for a movement back to 'normal zoom' by feeding the node coordinates and multiplying by the current 'normal' scale
      this.zoomsG.x =
        this.zoomsG.k *
        -(this._zoomConfig.zoomClicked?.node.__data__
          ? this._zoomConfig.zoomClicked?.node.__data__.x
          : this._zoomConfig.zoomClicked?.node.x);
      this.zoomsG.y =
        this.zoomsG.k *
        -(this._zoomConfig.zoomClicked?.node.__data__
          ? this.zoomClicked?.node.__data__.y
          : this.zoomClicked?.node.y);
    }
  }
  setLevelsHighAndWide() {
    if (this._viewConfig.isSmallScreen()) {
      this._viewConfig.levelsHigh = this.zoomClicked
        ? XS_LEVELS_HIGH
        : XS_LEVELS_HIGH;
      this._viewConfig.levelsWide = this.zoomClicked
        ? XS_LEVELS_WIDE
        : XS_LEVELS_WIDE;
    } else {
      this._viewConfig.levelsHigh = LG_LEVELS_HIGH;
      this._viewConfig.levelsWide = LG_LEVELS_WIDE;
    }
  }
  setdXdY() {
    this._viewConfig.dx =
      (this._viewConfig.canvasWidth / this._viewConfig.levelsHigh) * 2;
    this._viewConfig.dy =
      (this._viewConfig.canvasHeight / this._viewConfig.levelsWide) * 8;

    //adjust for taller aspect ratio
    this._viewConfig.dx *= this._viewConfig.isSmallScreen() ? 3 : 1.5;
    this._viewConfig.dy *= this._viewConfig.isSmallScreen() ? 1 : 0.5;
  }
  setNodeRadius() {
    this._viewConfig.nodeRadius =
      (this._viewConfig.isSmallScreen() ? XS_NODE_RADIUS : LG_NODE_RADIUS) *
      this._viewConfig.scale;
  }
  setZoomBehaviour() {
    const zooms = function (e) {
      let scale = e.transform.k;

      this._viewConfig.scale = scale;

      const transform = [
        this._viewConfig.currentXTranslate() +
          e.transform.x -
          (this._viewConfig.canvasWidth + this._viewConfig.nodeRadius) *
            this._viewConfig.scale,
        this._viewConfig.currentYTranslate() +
          e.transform.y +
          (this._viewConfig.canvasHeight + this._viewConfig.nodeRadius) *
            this._viewConfig.scale,
      ];

      select(".canvas").attr(
        "transform",
        "translate(" +
          transform[0] +
          ", " +
          transform[1] +
          ")scale(" +
          scale +
          ")"
      );
    };
    this.zoomer = zoom()
      .scaleExtent([2, 5])
      .duration(10000)
      .on("zoom", zooms.bind(this));
  }

  calibrateViewPortAttrs() {
    this._viewConfig.viewportW =
      this._viewConfig.canvasWidth * this._viewConfig.levelsWide;
    this._viewConfig.viewportH =
      this._viewConfig.canvasHeight * this._viewConfig.levelsHigh;

    this._viewConfig.viewportX = 0;
    this._viewConfig.viewportY = 0;

    this._viewConfig.defaultView = `${this._viewConfig.viewportX} ${this._viewConfig.viewportY} ${this._viewConfig.viewportW} ${this._viewConfig.viewportH}`;
  }
  calibrateViewBox() {
    console.log("this.zoomBase() :>> ", this.zoomBase());
    this.zoomBase()
      .attr("viewBox", this._viewConfig.defaultView)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .call(this.zoomer)
      .on("dblclick.zoom", null);
  }

  sumHierarchyData() {
    this.rootData.sum((d) => {
      // Return a binary interpretation of whether the habit was completed that day
      const thisNode = this.rootData
        .descendants()
        .find((node) => node.data == d);
      // console.log("thisNode :>> ", thisNode);
      let content = parseTreeValues(thisNode.data.content);
      if (content.status === "incomplete" || content.status === "") return 0;
      const statusValue = JSON.parse(content.status);
      return +statusValue;
    });
  }
  accumulateNodeValues() {
    while (this.rootData.descendants().some((node) => node.value > 1)) {
      // Convert node values to binary based on whether their descendant nodes are all completed
      this.rootData.each((node) => {
        if (node.value > 0) {
          node.value = cumulativeValue(node);
        }
      });
    }
  }
  activeOrNonActiveOpacity(d, dimmedOpacity) {
    if (
      !this.activeNode ||
      (this.activeNode && d.ancestors().includes(this.activeNode))
    )
      return "1";
    return !this.zoomClicked ? "1" : dimmedOpacity;
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
        this.layout = cluster().size(360, this._viewConfig.canvasWidth / 1.5);
        break;
    }
    this.layout.nodeSize([this._viewConfig.dx, this._viewConfig.dy]);
    this.layout(this.rootData);
  }
  setNodeAndLinkGroups() {
    const transformation = `translate(${0}, ${this.type == "radial" ? 0 : 0})`;

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
    const links = this._gLink
      .selectAll("line.link")
      .data(this.rootData.links());

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

    const nodes = this._gNode
      .selectAll("g.node")
      .data(this.rootData.descendants());

    this._enteringNodes = nodes
      .enter()
      .append("g")
      .attr("class", (d) =>
        this.activeNode && d.data.content === this.activeNode.data.content
          ? "the-node solid active"
          : "the-node solid"
      )
      .style("fill", (d) => nodeStatusColours(d, this.rootData))
      .style("opacity", (d) => this.activeOrNonActiveOpacity(d, "0.5"))
      .style("stroke-width", (d) =>
        this.activeNode !== undefined && d.ancestors().includes(this.activeNode)
          ? "2px"
          : "0"
      )
      .attr("transform", (d) => {
        if (this.type == "radial")
          return "translate(" + radialPoint(d.x, d.y) + ")";
        return this.type == "cluster"
          ? `translate(${d.y},${d.x})`
          : `translate(${d.x},${d.y})`;
      })
      .call(this.bindEventHandlers.bind(this));
  }
  setCircleAndLabelGroups() {
    this._gCircle = this._enteringNodes.append("g");
    this._gTooltip = this._enteringNodes
      .append("g")
      .classed("tooltip", true)
      .attr(
        "transform",
        `translate(${-this._viewConfig.nodeRadius / 4}, ${
          this._viewConfig.nodeRadius
        }), scale(${LABEL_SCALE})`
      )
      .attr("opacity", (d) => this.activeOrNonActiveOpacity(d, "0"));
  }
  setButtonGroups() {
    this._gButton = this._gCircle
      .append("g")
      .classed("habit-label-dash-button", true)
      .attr("transform", `translate(${200}, -50), scale(${BUTTON_SCALE})`)
      .attr("style", "opacity: 0");
  }

  appendCirclesAndLabels() {
    this._gCircle
      .append("circle")
      // .attr("cx", (d) => d.x)
      // .attr("cy", (d) => (this.type == "radial" ? -d.y : d.y))
      .attr("transform", (d) =>
        this.type == "radial" ? `rotate(${d.x}, 0, 0)` : ``
      )
      .attr("r", this._viewConfig.nodeRadius)
      .on("mouseenter", this.eventHandlers.handleHover);
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
      .attr("width", this.type == "radial" ? 120 : 275)
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
  }
  appendButtons() {
    this._gButton
      .append("rect")
      .attr("rx", 15)
      .attr("y", 5)
      .attr("width", 100)
      .attr("height", 30)
      .on("click", (e) => {
        e.stopPropagation();
      });
    // this._gButton
    //   .append("text")
    //   .attr("x", 15)
    //   .attr("y", isDemo ? 25 : 30)
    //   .text((d) => "DETAILS")
    //   .on("click", (e, n) => {
    // HabitStore.current(HabitStore.filterByName(n.data.name)[0]);
    // let currentId = HabitStore.current()?.id;
    // m.route.set(
    //   m.route.param("demo") ? `/habits/list?demo=true` : `/habits/list`,
    //   { currentHabit: currentId }
    // );
    // });
    if (!this.isDemo) {
      this._gButton
        .append("rect")
        .attr("rx", 15)
        .attr("y", -20)
        .attr("width", 100)
        .attr("height", 30)
        .on("click", (e) => {
          e.stopPropagation();
        });
      this._gButton
        .append("text")
        .attr("x", 15)
        .attr("y", (d) => (d.parent ? 2 : 5))
        .text((d) => "APPEND")
        .on("click", (e, n) => {
          this.eventHandlers.handleAppendNode(e, n);
        });
      this._gButton
        .append("rect")
        .attr("style", (d) => (d.parent ? "opacity: 0" : "opacity: 1"))
        .attr("rx", 15)
        .attr("y", -45)
        .attr("width", 100)
        .attr("height", 30)
        .on("click", (e) => {
          e.stopPropagation();
        });
      this._gButton
        .append("text")
        .attr("style", (d) => (d.parent ? "opacity: 0" : "opacity: 1"))
        .attr("x", 12)
        .attr("y", -20)
        .text((d) => "PREPEND")
        .on("click", (e, n) => {
          this.eventHandlers.handlePrependNode(e, n);
        });
    }
  }

  bindEventHandlers(selection) {
    selection
      .on("contextmenu", this.eventHandlers.handleNodeFocus.bind(this))
      .on("mousewheel.zoom", this.eventHandlers.handleNodeZoom.bind(this), {
        passive: true,
      })
      .on("touchstart", this.eventHandlers.handleHover.bind(this), {
        passive: true,
      })
      .on("touchend", this.eventHandlers.handleNodeToggle.bind(this), {
        passive: true,
      })
      .on("click", this.eventHandlers.handleNodeToggle.bind(this), {
        passive: true,
      })
      .on("mouseleave", this.eventHandlers.handleMouseLeave.bind(this));
  }

  addLegend() {
    const ordinal = scaleOrdinal()
      .domain([
        "Completed",
        "Not Yet Tracked",
        "Incomplete",
        "No Record for Day",
      ])
      .range([positiveCol, neutralCol, negativeCol, noNodeCol]);

    const legendSvg = select("svg.legendSvg");
    const controlsSvg = select("svg.controlsSvg");
    const gText = controlsSvg
      .append("g")
      .attr("class", "controls")
      .attr("transform", "translate(280, 40) scale(0.7)");
    const gLegend = legendSvg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(20, 30) scale(2)");

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
      gText.append("text").text("L/Click ---> Select Habit & Focus");
      gText.append("text").attr("y", 25).text("R/Click -> Tick Off Habit");
      gText
        .append("text")
        .text("Zoom On Habit -> Select Family & Centre")
        .attr("y", -25);
    }
    const colorLegend = legendColor()
      .orient("horizontal")
      .labels(["Completed", "Not Recorded", "Incomplete", "", ""])
      .orient("vertical")
      .shape("circle")
      .shapeRadius(15)
      .shapePadding(-5)
      .scale(ordinal);

    gLegend.call(colorLegend);
  }

  activateNodeAnimation() {
    // https://stackoverflow.com/questions/45349849/concentric-emanating-circles-d3
    // Credit: Andrew Reid
    const gCircle = this.zoomBase().selectAll(
      "g.the-node.solid.active g:first-child"
    );
    gCircle.on("mouseover", this.eventHandlers.handleHover);

    const pulseScale = scaleLinear()
      .range(["#d0790f", "#5568d2", "#3349c1"])
      .domain([0, 3 * this._viewConfig.nodeRadius]);

    const pulseData = [
      0,
      this._viewConfig.nodeRadius,
      this._viewConfig.nodeRadius * 2,
      this._viewConfig.nodeRadius * 2,
    ];

    const pulseCircles = gCircle
      .append("g")
      .classed("active-circle", true)
      .attr("stroke-opacity", (d) => {
        return this.activeNode &&
          d.data.content === this.activeNode.data.content
          ? "1"
          : "0";
      })
      .selectAll("circle")
      .data(pulseData)
      .enter()
      .append("circle")
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
    showHabitLabel();
    transition();
  }

  render() {
    // console.log("Rendering vis... :>>", this?._canvas);
    // _p("zoomconfig", this._zoomConfig, "info");
    this._canvas = select(document.querySelectorAll(".canvas")[0]);
    // console.log(
    //   "need new canvas? :>> ",
    //   typeof document.querySelectorAll(".canvas")[0] == "undefined" ||
    //     typeof this?._canvas == "undefined"
    // );
    this.setZoomBehaviour();
    this.calibrateViewPortAttrs();
    this.calibrateViewBox();
    if (
      typeof document.querySelectorAll(".canvas")[0] == "undefined" ||
      typeof this?._canvas == "undefined"
    ) {
      this._canvas = select(`#${this._svgId}`)
        .append("g")
        .classed("canvas", true)
        .attr("transform", `scale(${BASE_SCALE}), translate(${0}, ${0})`);

      console.log("Configured canvas... :>>", this._canvas);

      this.setNormalTransform();
      this.setLevelsHighAndWide();
      this.setdXdY();
      this.setNodeRadius();
    } else {
      this.clearCanvas();
      if (this.rootData.name === "" || typeof this._canvas == undefined)
        this.sumHierarchyData();
      this.accumulateNodeValues();
      this.setLayout();

      this.setNodeAndLinkGroups();
      this.setNodeAndLinkEnterSelections();
      this.setCircleAndLabelGroups();
      this.setButtonGroups();

      this.appendCirclesAndLabels();
      this.appendLabels();
      this.appendButtons();
      console.log("Appended SVG elements... :>>");
    }
    if (select("svg .legend").empty() && select("svg .controls").empty()) {
      this.addLegend();
    }
    if (this._zoomConfig.zoomedInView()) {
      const { event, node, content } = this._zoomConfig.zoomClicked;
      // _p("zoomClicked :>> ", this._zoomConfig.zoomClicked, "!");
      if (event !== undefined) this.eventHandlers.clickedZoom(event, node);
      if (content !== undefined) {
        this.setActiveNode(content);
      }
    }

    this.activeNode && this.activateNodeAnimation();
  }
}

const makePatchOrPutRequest = function (isDemo, currentStatus) {
  const requestBody = {
    habit_id: HabitStore.current().id,
    date_id: DateStore.current().id,
    completed_status: oppositeStatus(currentStatus),
  };
  return HabitDateStore.runUpdate(
    isDemo,
    requestBody,
    DomainStore.current().id
  );
};
// enteringNodes
//   .append("g")
//   .attr("transform", "translate(" + "-20" + "," + "55" + ") scale( 2.5 )")
//   .append("path")
//   .attr("class", "expand-arrow")
//   .attr("d", (d) => {
//     return d._children
//       ? "M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
//       : null;
//   })
//   .style("fill", "red");
