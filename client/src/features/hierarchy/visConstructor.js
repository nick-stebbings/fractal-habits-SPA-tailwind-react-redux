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
  nodeStatusColours,
  parseTreeValues,
  cumulativeValue,
} from "./components/helpers";

import { updateHabitDateREST } from "features/habitDate/actions";
import { positiveCol, negativeCol, noNodeCol, neutralCol } from "app/constants";

export default class Visualization {
  constructor(svg, inputTree, canvasHeight, canvasWidth) {
    this.isDemo = false;
    this.zoomBase = svg;
    this.rootData = inputTree;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.currentXTranslate = this.globalTranslate
      ? -this.globalTranslate[0]
      : 0;
    this.currentYTranslate = this.globalTranslate
      ? -this.globalTranslate[1]
      : 0;
    this.canvas = svg
      .append("g")
      .classed("canvas", true)
      .attr(
        "transform",
        `scale(${this.clickScale}), translate(${this.currentXTranslate},${this.currentYTranslate})`
      );

    // Flags/metrics from previous render
    this.scale = 9;
    this.clickScale = 4.2;
    this.globalZoom = 1;
    // this.zoomsG = null;
    this.zoomClicked = {};
    this.zoomedInView = Object.keys(this.zoomClicked).length === 0;
    this.smallScreen = this.canvasWidth < 768;

    this.eventHandlers = {
      handleZoom: function (event, node, forParent = false) {
        if (!event || !node || event.deltaY >= 0 || deadNode(event))
          return this.reset();
        this.globalZoom = this.clickScale;
        this.globalTranslate = [node.x, node.y];
        this.setActiveNode(forParent ? node.data : node.data);
        expand(node);
        // updateCurrentHabit(node, false);
        this.zoomClicked = {
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
      handleMouseLeave: function () {
        const g = select(this);
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

  reset() {
    if (this.canvas === undefined) return;
    scale = isDemo ? 8 : 14;
    this.zoomBase.attr("viewBox", this.defaultView);
    this.expandTree();
    this.zoomClicked = {};
    this.activeNode = null;
    document.querySelector(".the-node.active") &&
      document.querySelector(".the-node.active").classList.remove("active");
    this.canvas.call(this.zoomer.transform, zoomIdentity);
  }
  expand() {
    expand(this.rootData);
  }
  collapse() {
    collapse(this.rootData);
  }

  setNormalTransform() {
    this.zoomsG?.k && (this.zoomsG.k = this.clickScale);

    if (this.zoomsG?.x && Object.keys(this.zoomClicked).length > 0) {
      // Set the translation for a movement back to 'normal zoom' by feeding the node coordinates and multiplying by the current 'normal' scale
      this.zoomsG.x =
        this.zoomsG.k *
        -(this.zoomClicked?.node.__data__
          ? this.zoomClicked?.node.__data__.x
          : this.zoomClicked?.node.x);
      this.zoomsG.y =
        this.zoomsG.k *
        -(this.zoomClicked?.node.__data__
          ? this.zoomClicked?.node.__data__.y
          : this.zoomClicked?.node.y);
    }
  }
  setLevelsHighAndWide() {
    if (this.smallScreen) {
      this.levelsHigh = this.zoomClicked ? 15 : 12;
      this.levelsWide = this.zoomClicked ? 0.5 : 3;
    } else {
      this.levelsHigh = 12;
      this.levelsWide = 2;
    }
    this.levelsWide *= 8;
  }
  setdXdY() {
    this.dx = this.canvasWidth / this.levelsHigh / 2;
    this.dy = (this.canvasHeight / this.levelsWide) * 4;
    this.dy *= this.zoomedInView && !this.smallScreen ? 10 : 14;
  }
  setNodeRadius() {
    this.nodeRadius = (this.smallScreen ? 8 : 10) * this.scale;
  }
  setZoomBehaviour() {
    const zooms = function (e) {
      const transform = e.transform;
      let scale = transform.k,
        tbound = -canvasHeight * scale * 3,
        bbound = canvasHeight * scale * 3;
      const currentTranslation = [0, 0];

      this.scale = this.globalZoom ? this.globalZoom : scale;
      this.zoomsG = e.transform;
      this.globalZoom = null;
      this.globalTranslate = null;

      const translation = [
        globalTranslate
          ? this.globalTranslate[0]
          : currentTranslation[0] + transform.x,
        globalTranslate
          ? currentTranslation[1] + this.globalTranslate[1]
          : currentTranslation[1] + transform.y,
      ];
      select(".canvas").attr(
        "transform",
        "translate(" + translation + ")" + " scale(" + this.scale + ")"
      );
    };
    this.zoomer = zoom().scaleExtent([0, 5]).duration(10000).on("zoom", zooms);
  }

  calibrateViewPortAttrs() {
    this.viewportY = this.smallScreen ? -800 : -550;
    this.viewportW = this.canvasWidth;
    this.viewportX =
      viewportW / clickScale +
      clickScale *
        (!this.isDemo || this.smallScreen ? 3.5 : 10) *
        this.nodeRadius;
    this.viewportH = this.canvasHeight * 5;
    this.defaultView = `${this.viewportX} ${this.viewportY} ${this.viewportW} ${this.viewportH}`;
  }
  calibrateViewBox() {
    this.zoomBase
      .attr("viewBox", this.defaultView)
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
      .size(this.canvasWidth, this.canvasHeight)
      .nodeSize([this.dy, this.dx]);
    this.layout(this.rootData);
  }
  setNodeAndLinkGroups() {
    this.gLink = this.canvas
      .append("g")
      .classed("links", true)
      .attr("transform", `translate(${this.viewportW / 2},${this.scale})`);
    this.gNode = this.canvas
      .append("g")
      .classed("nodes", true)
      .attr("transform", `translate(${this.viewportW / 2},${this.scale})`);
  }
  setNodeAndLinkEnterSelections() {
    const links = this.gLink.selectAll("line.link").data(this.rootData.links());

    this.enteringLinks = links
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

    const nodes = this.gNode
      .selectAll("g.node")
      .data(this.rootData.descendants());

    this.enteringNodes = nodes
      .enter()
      .append("g")
      .attr("class", (d) =>
        this.activeNode && d.data.content === this.activeNode.data.content
          ? "the-node solid active"
          : "the-node solid"
      )
      .style("fill", nodeStatusColours)
      .style("opacity", (d) => this.activeOrNonActiveOpacity(d, "0.5"))
      .style("stroke-width", (d) =>
        this.activeNode !== undefined && d.ancestors().includes(this.activeNode)
          ? "2px"
          : "0"
      )
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .call(this.bindEventHandlers);
  }
  setCircleAndLabelGroups() {
    this.gCircle = this.enteringNodes.append("g");
    this.gTooltip = this.enteringNodes
      .append("g")
      .classed("tooltip", true)
      .attr(
        "transform",
        `translate(${this.nodeRadius / this.scale}, 75), scale(2)`
      )
      .attr("opacity", (d) => this.activeOrNonActiveOpacity(d, "0"));
  }

  appendCirclesAndLabels() {
    this.gCircle
      .append("circle")
      .attr("r", this.nodeRadius)
      .on("mouseenter", this.eventHandlers.handleHover);
  }
  appendTooltips() {
    this.gTooltip
      .append("rect")
      .attr("width", 3)
      .attr("height", 45)
      .attr("x", -6)
      .attr("y", -25);

    this.gTooltip
      .append("rect")
      .attr("width", 275)
      .attr("height", 100)
      .attr("x", -6)
      .attr("y", -10)
      .attr("rx", 15);

    // Split the name label into two parts:
    this.gTooltip
      .append("text")
      .attr("x", 5)
      .attr("y", 20)
      .text((d) => {
        const words = d.data.name.split(" ").slice(0, 6);
        return `${words[0] || ""} ${words[1] || ""} ${words[2] || ""} ${
          words[3] || ""
        }`;
      });
    this.gTooltip
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
      .domain([0, 3 * this.nodeRadius]);

    const pulseData = [
      0,
      this.nodeRadius,
      this.nodeRadius * 2,
      this.nodeRadius * 2,
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

    function transition() {
      let data = pulseData
        .map(function (d) {
          return d == 3 * this.nodeRadius ? 0 : d + this.nodeRadius;
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
        .style("opacity", function (d) {
          return d == 3 * this.nodeRadius ? 0 : 1;
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
    }
    showHabitLabel();
    transition();
  }

  render() {
    if (this.rootData.name === "") return;
    this.setNormalTransform();
    this.setLevelsHighAndWide();
    this.setdXdY();
    this.setNodeRadius();
    this.setZoomBehaviour();
    this.calibrateViewPortAttrs();
    this.calibrateViewBox();

    this.sumHierarchyData();
    this.accumulateNodeValues();
    this.setLayout();

    this.setNodeAndLinkGroups();
    this.setNodeAndLinkEnterSelections();
    this.setCircleAndLabelGroups();

    this.appendCirclesAndLabels();
    this.appendTooltips();

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
