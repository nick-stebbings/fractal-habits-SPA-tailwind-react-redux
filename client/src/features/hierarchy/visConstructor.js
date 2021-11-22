import {
  select,
  scaleOrdinal,
  scaleLinear,
  zoom,
  zoomIdentity,
  linkVertical,
  tree,
  easeCubic,
  easePolyOut,
} from "d3";
import { legendColor } from "d3-svg-legend";
// import Hammer from "hammerjs";

import { store } from "app/store";
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

import { updateHabitDateREST } from "features/habitDate/actions";
import { positiveCol, negativeCol, noNodeCol, neutralCol } from "app/constants";

export default class Visualization {
  constructor(svg, svgId, inputTree, canvasHeight, canvasWidth) {
    this.isDemo = false;
    this.zoomBase = svg;
    this._svgId = svgId;
    this.rootData = inputTree;
    this._viewConfig = {
      scale: 9,
      clickScale: 4.2,
      canvasHeight,
      canvasWidth,
      currentXTranslate: () =>
        this._viewConfig.globalTranslate
          ? -this._viewConfig.globalTranslate[0]
          : 0,
      currentYTranslate: () =>
        this._viewConfig.globalTranslate
          ? -this._viewConfig.globalTranslate[0]
          : 0,
      smallScreen: () => this.canvasWidth < 768,
    };

    this._zoomConfig = {
      globalZoom: 1,
      zoomClicked: {},
      zoomedInView: function () {
        return Object.keys(this.zoomClicked).length === 0;
      },
    };
    // Flags/metrics from previous render
    this.zoomsG = null;

    this.eventHandlers = {
      handleZoom: function (event, node, forParent = false) {
        if (!event || !node || event.deltaY >= 0 || deadNode(event))
          return this.reset();
        this._zoomConfig.globalZoom = this._viewConfig.clickScale;
        this._viewConfig.globalTranslate = [node.x, node.y];
        this.setActiveNode(forParent ? node.data : node.data);
        expand(node);
        // updateCurrentHabit(node, false);
        this._zoomConfig.zoomClicked = {
          event: event,
          node: node,
          content: node.data,
          scale: clickedZoom ? clickScale : scale,
        };
        this.render();
      },
      clickedZoom: function (e, that) {
        if (e?.defaultPrevented || typeof that === "undefined") return; // panning, not clicking
        const transformer = getTransform(that, clickScale);
        console.log("transformer.translate :>> ", transformer.translate);
        select(".canvas")
          .transition()
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
      handleNodeToggle: function (event, node) {
        this.setActiveNode(node.data);
        this.activateNodeAnimation();
        const targ = event.target;
        if (targ.tagName == "circle") {
          if (
            targ.closest(".the-node").classList.contains("active") ||
            deadNode(event)
          )
            return this.reset();

          // updateCurrentHabit(node, false);
          expand(node);

          this.zoomsG?.k && this.setNormalTransform();

          setHabitLabel(node.data);
          showHabitLabel();
          collapseAroundAndUnder(node, false, false);
          if (!this.isDemo) {
            const nodeContent = parseTreeValues(node.data.content);
            // NodeStore.runCurrentFilterByMptt(
            //   nodeContent.left,
            //   nodeContent.right
            // );
            // HabitStore.runCurrentFilterByNode(NodeStore.current().id);
            // pendingCalendarRefresh(true);
            // populateCalendar().then(m.redraw);
          }
        }
      },
      handleStatusToggle: function (node) {
        if (!this.rootData.leaves().includes(node) || node._children) return; // Non-leaf nodes have auto-generated cumulative status
        const nodeContent = parseTreeValues(node.data.content);
        // NodeStore.runCurrentFilterByMptt(nodeContent.left, nodeContent.right);
        // HabitStore.runCurrentFilterByNode(NodeStore.current().id);

        const currentStatus = nodeContent.status;
        node.data.content = node.data.content.replace(
          /true|false|incomplete/,
          oppositeStatus(currentStatus)
        );
        // const nodeId = NodeStore.current().id;
        // HabitStore.runCurrentFilterByNode(nodeId);
        if (!node.data.name.includes("Sub-Habit")) {
          // If this was not a 'ternarising' sub habit that we created for more even distribution
          // return makePatchOrPutRequest(isDemo, currentStatus);
        }
      },
      handleStatusChange: function (event, node) {
        event.preventDefault();
        if (node.children) return;
        this.setActiveNode(node.data);
        this.activateNodeAnimation();
        const opts = {
          event,
          node,
          content: node.data,
        };
        if (deadNode(event)) return this.reset();

        expand(node);
        // this.render(svg, isDemo, zoomer, opts);
        this.handleStatusToggle(node);

        // setHabitLabel(node.data);
        this.handleZoom(event, node?.parent, true);
        // zoomsG?.k && setNormalTransform(zoomClicked, zoomsG, clickScale);
        // renderTree(svg, isDemo, zoomer, opts);
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
          this.zoomBase.select("g.tooltip").transition();
          this.currentTooltip = this.zoomBase
            .selectAll("g.tooltip")
            .filter((t) => {
              return d == t;
            });
          this.currentTooltip.transition().duration(450).style("opacity", "1");
        }
        if (!this.currentButton) {
          this.zoomBase.select("g.habit-label-dash-button").transition();
          this.currentButton = this.zoomBase
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

    this.render();
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

  clearCanvas() {
    select(".canvas").selectAll("*").remove();
  }

  reset() {
    scale = isDemo ? 8 : 14;
    this.zoomBase.attr("viewBox", this._viewConfig.defaultView);
    this.expandTree();
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
    if (this._viewConfig.smallScreen()) {
      this._viewConfig.levelsHigh = this.zoomClicked ? 15 : 12;
      this._viewConfig.levelsWide = this.zoomClicked ? 0.5 : 3;
    } else {
      this._viewConfig.levelsHigh = 12;
      this._viewConfig.levelsWide = 2;
    }
    this._viewConfig.levelsWide *= 8;
  }
  setdXdY() {
    this._viewConfig.dx =
      this._viewConfig.canvasWidth / this._viewConfig.levelsHigh / 2;
    this._viewConfig.dy =
      (this._viewConfig.canvasHeight / this._viewConfig.levelsWide) * 4;
    this._viewConfig.dy *=
      this._zoomConfig.zoomedInView() && !this._viewConfig.smallScreen()
        ? 10
        : 14;
  }
  setNodeRadius() {
    this._viewConfig.nodeRadius =
      (this._viewConfig.smallScreen() ? 8 : 10) * this._viewConfig.scale;
  }
  setZoomBehaviour() {
    const zooms = function (e) {
      const transform = e.transform;
      let scale = transform.k,
        tbound = -this._viewConfig.canvasHeight * this._viewConfig.scale * 3,
        bbound = this._viewConfig.canvasHeight * this._viewConfig.scale * 3;
      const currentTranslation = [0, 0];

      this._viewConfig.scale = this._zoomConfig.globalZoom
        ? this._zoomConfig.globalZoom
        : scale;
      this.zoomsG = e.transform;
      this._zoomConfig.globalZoom = null;
      this._viewConfig.globalTranslate = null;

      const translation = [
        this._viewConfig.globalTranslate
          ? this._viewConfig.globalTranslate[0]
          : currentTranslation[0] + transform.x,
        this._viewConfig.globalTranslate
          ? currentTranslation[1] + this._viewConfig.globalTranslate[1]
          : currentTranslation[1] + transform.y,
      ];
      console.log("translation :>> ", translation);
      select(".canvas").attr(
        "transform",
        "translate(" +
          translation +
          ")" +
          " scale(" +
          this._viewConfig.scale +
          ")"
      );
    };
    this.zoomer = zoom()
      .scaleExtent([0, 5])
      .duration(10000)
      .on("zoom", zooms.bind(this));
  }

  calibrateViewPortAttrs() {
    this._viewConfig.viewportY = this._viewConfig.smallScreen() ? -800 : -550;
    this._viewConfig.viewportW = this._viewConfig.canvasWidth;
    this._viewConfig.viewportX =
      this._viewConfig.viewportW / this._viewConfig.clickScale +
      this._viewConfig.clickScale *
        (!this.isDemo || this._viewConfig.smallScreen() ? 3.5 : 10) *
        this._viewConfig.nodeRadius;
    this._viewConfig.viewportH = this._viewConfig.canvasHeight * 5;
    this._viewConfig.defaultView = `${this._viewConfig.viewportX} ${this._viewConfig.viewportY} ${this._viewConfig.viewportW} ${this._viewConfig.viewportH}`;
  }
  calibrateViewBox() {
    this.zoomBase
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
      console.log("thisNode :>> ", thisNode);
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

  setLayout() {
    this.layout = tree()
      .size(this._viewConfig.canvasWidth, this._viewConfig.canvasHeight)
      .nodeSize([this._viewConfig.dy, this._viewConfig.dx]);
    this.layout(this.rootData);
  }
  setNodeAndLinkGroups() {
    console.log("this._viewConfig :>> ", this._viewConfig);
    this._gLink = this._canvas
      .append("g")
      .classed("links", true)
      .attr(
        "transform",
        `translate(${this._viewConfig.viewportW / 2},${this._viewConfig.scale})`
      );
    this._gNode = this._canvas
      .append("g")
      .classed("nodes", true)
      .attr(
        "transform",
        `translate(${this._viewConfig.viewportW / 2},${this._viewConfig.scale})`
      );
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
      .attr(
        "d",
        linkVertical()
          .x((d) => d.x)
          .y((d) => d.y)
      );

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
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .call(this.bindEventHandlers.bind(this));
  }
  setCircleAndLabelGroups() {
    this._gCircle = this._enteringNodes.append("g");
    this._gTooltip = this._enteringNodes
      .append("g")
      .classed("tooltip", true)
      .attr(
        "transform",
        `translate(${
          this._viewConfig.nodeRadius / this._viewConfig.scale
        }, 75), scale(2)`
      )
      .attr("opacity", (d) => this.activeOrNonActiveOpacity(d, "0"));
  }

  appendCirclesAndLabels() {
    this._gCircle
      .append("circle")
      .attr("r", this._viewConfig.nodeRadius)
      .on("mouseenter", this.eventHandlers.handleHover);
  }
  appendTooltips() {
    this._gTooltip
      .append("rect")
      .attr("width", 3)
      .attr("height", 45)
      .attr("x", -6)
      .attr("y", -25);

    this._gTooltip
      .append("rect")
      .attr("width", 275)
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
      });
    this._gTooltip
      .append("text")
      .attr("x", 15)
      .attr("y", 50)
      .text((d) => {
        const allWords = d.data.name.split(" ");
        const words = allWords.slice(0, 6);
        return `${words[4] || ""} ${words[5] || ""} ${words[6] || ""} ${
          allWords.length > 7 ? "..." : ""
        }`;
      });
  }

  bindEventHandlers(selection) {
    selection
      .on("contextmenu", this.eventHandlers.handleStatusChange.bind(this))
      .on("mousewheel.zoom", this.eventHandlers.handleZoom.bind(this), {
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
    const gCircle = this.zoomBase.selectAll(
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
    console.log(
      "Rendering vis... :>>",
      select(document.querySelectorAll(".canvas")[0])
    );
    this._canvas = select(document.querySelectorAll(".canvas")[0]);
    console.log(
      "Current canvas:",
      document.querySelectorAll(".canvas")[0],
      typeof this?._canvas
    );
    console.log(
      "need new canvas? :>> ",
      typeof document.querySelectorAll(".canvas")[0] == "undefined" ||
        typeof this?._canvas == "undefined"
    );
    if (
      typeof document.querySelectorAll(".canvas")[0] == "undefined" ||
      typeof this?._canvas == "undefined"
    ) {
      this._canvas = select(this._svgId)
        .append("g")
        .classed("canvas", true)
        .attr(
          "transform",
          `scale(${
            this._viewConfig.clickScale
          }), translate(${this._viewConfig.currentXTranslate()},${this._viewConfig.currentYTranslate()})`
        );

      console.log("Configured canvas... :>>", this._canvas);

      this.setNormalTransform();
      this.setLevelsHighAndWide();
      this.setdXdY();
      this.setNodeRadius();
      this.setZoomBehaviour();
      this.calibrateViewPortAttrs();
      this.calibrateViewBox();
    } else {
      this.clearCanvas();

      if (this.rootData.name === "" || typeof this._canvas == undefined)
        return console.log("Data or canvas missing!");
      this.sumHierarchyData();
      this.accumulateNodeValues();
      this.setLayout();

      this.setNodeAndLinkGroups();
      this.setNodeAndLinkEnterSelections();
      this.setCircleAndLabelGroups();

      this.appendCirclesAndLabels();
      this.appendTooltips();
    }

    if (select("svg .legend").empty() && select("svg .controls").empty()) {
      this.addLegend();
    }
    if (this.zoomClicked !== undefined) {
      const { event, node, content } = this.zoomClicked;
      if (event !== undefined) this.eventHandlers.clickedZoom(event, node);
      if (content !== undefined) {
        this.setActiveNode(content);
      }
    }

    this.activeNode && this.activateNodeAnimation();
  }
}
