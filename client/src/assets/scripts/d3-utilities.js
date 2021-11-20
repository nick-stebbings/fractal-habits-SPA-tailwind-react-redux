import { select } from "d3-selection";
import { scaleOrdinal, scaleLinear } from "d3-scale";
import { zoom, zoomIdentity } from "d3-zoom";
import { linkVertical } from "d3-shape";
import { tree } from "d3-hierarchy";
import { easeCubic, easePolyOut } from "d3-ease";
import { legendColor } from "d3-svg-legend";
// import Hammer from "hammerjs";

import { store } from "app/store";
import { updateHabitDateREST } from "features/habitDate/actions";
import { positiveCol, negativeCol, noNodeCol, neutralCol } from "app/constants";

const showHabitLabel = () =>
  (document.querySelector(".mask-wrapper").style.height = "5rem");

const addLegend = (svg) => {
  const ordinal = scaleOrdinal()
    .domain(["Completed", "Not Yet Tracked", "Incomplete", "No Record for Day"])
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
  if (false) {
    //isTouchDevice() ||
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
};

const setHabitLabel = (data) => {
  document.getElementById("current-habit").nextElementSibling.textContent =
    data?.name;
  document.getElementById("current-habit-sm").nextElementSibling.textContent =
    data?.name;
};

const deadNode = (event) =>
  event.target.__data__.data &&
  parseTreeValues(event.target.__data__.data.content)?.status == "";

const sumChildrenValues = (node, hidden = false) =>
  hidden
    ? node._children.reduce((sum, n) => sum + n.value, 0)
    : node.children.reduce((sum, n) => sum + n.value, 0);

const cumulativeValue = (node) => {
  const content = parseTreeValues(node.data.content).status;
  try {
    if (node?._children) {
      return +(
        sumChildrenValues(node, true) >= node._children.length &&
        node._children.every((n) => cumulativeValue(n) === 1)
      );
    }
    if (![undefined, "incomplete", false, ""].includes(content)) {
      return 1;
    } else if (node && node.children)
      return node && node.children
        ? +(
            sumChildrenValues(node) >= node.children.length &&
            node.children.every((n) => cumulativeValue(n) === 1)
          )
        : 0;
  } catch (err) {
    console.log("Could not accumulate.");
  }
};

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

const setNormalTransform = function (zoomClicked, zoomsG, clickScale) {
  zoomsG?.k && (zoomsG.k = clickScale);

  if (zoomsG?.x && Object.keys(zoomClicked).length > 0) {
    // Set the translation for a movement back to 'normal zoom' by feeding the node coordinates and multiplying by the current 'normal' scale
    zoomsG.x =
      zoomsG.k *
      -(zoomClicked?.node.__data__
        ? zoomClicked?.node.__data__.x
        : zoomClicked?.node.x);
    zoomsG.y =
      zoomsG.k *
      -(zoomClicked?.node.__data__
        ? zoomClicked?.node.__data__.y
        : zoomClicked?.node.y);
  }
};

const renderTree = function (
  svg,
  isDemo,
  zoomClicked,
  canvasWidth,
  canvasHeight,
  mType,
  inputTree
) {
  let globalZoom, globalTranslate;
  // TODO change this to private data once more than one vis is live
  let zoomsG;
  let rootData = inputTree;
  if (rootData.name === "") return;
  let clickScale = 4.2;
  setNormalTransform(zoomClicked, zoomsG, clickScale);

  let currentXTranslate = globalTranslate ? -globalTranslate[0] : 0;
  let currentYTranslate = globalTranslate ? -globalTranslate[1] : 0;

  // SETTINGS
  let scale = isDemo ? 9 : 9;
  const zoomBase = svg
    .append("g")
    .classed("canvas", true)
    .attr(
      "transform",
      `scale(${clickScale}), translate(${currentXTranslate},${currentYTranslate})`
    );
  const smallScreen = canvasWidth < 768;
  const zoomedInView = Object.keys(zoomClicked).length === 0;
  let levelsWide;
  let levelsHigh;

  const canvas = svg
    .append("g")
    .classed("canvas", true)
    .attr(
      "transform",
      `scale(${clickScale}), translate(${currentXTranslate},${currentYTranslate})`
    );

  if (smallScreen) {
    levelsWide = zoomClicked ? 15 : 12;
    levelsHigh = zoomClicked ? 0.5 : 3;
  } else {
    levelsWide = 12;
    levelsHigh = 2;
  }
  levelsWide *= 8;
  const nodeRadius = (smallScreen ? 8 : 10) * scale;
  let dx = canvasWidth / levelsHigh / 2;
  let dy = (canvasHeight / levelsWide) * 4;
  dy *= zoomedInView && !smallScreen ? 10 : 14;

  let viewportX, viewportY, viewportW, viewportH, defaultView;
  let activeNode;
  let currentTooltip;
  let currentButton;
  // --------------------------------------

  const zooms = function (e) {
    const transform = e.transform;
    let scale = transform.k,
      tbound = -canvasHeight * scale * 3,
      bbound = canvasHeight * scale * 3;
    scale = globalZoom ? globalZoom : scale;
    const currentTranslation = [0, 0];
    zoomsG = e.transform;
    globalZoom = null;
    globalTranslate = null;
    const translation = [
      globalTranslate
        ? globalTranslate[0]
        : currentTranslation[0] + transform.x,
      globalTranslate
        ? currentTranslation[1] + globalTranslate[1]
        : currentTranslation[1] + transform.y,
    ];
    select(".canvas").attr(
      "transform",
      "translate(" + translation + ")" + " scale(" + scale + ")"
    );
  };

  const zoomer = zoom().scaleExtent([0, 5]).duration(10000).on("zoom", zooms);

  calibrateViewPort();
  svg
    .attr("viewBox", defaultView)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .call(zoomer)
    .on("dblclick.zoom", null);
  if (select("svg .legend").empty() && select("svg .controls").empty())
    addLegend();

  const contentEqual = (node, other) =>
    node.content.split("-").slice(0, 1)[0] ==
    other.content.split("-").slice(0, 1)[0];

  const setActiveNode = (clickedNode) => {
    activeNode = findNodeByContent(clickedNode);
    return activeNode;
  };

  const findNodeByContent = (node) => {
    if (node === undefined || node.content === undefined) return;
    let found;
    rootData.each((n) => {
      if (contentEqual(n.data, node)) {
        found = n;
      }
    });
    return found;
  };

  const cousins = (node, root) =>
    root.descendants().filter((n) => n.depth == node.depth && n !== node);

  const greatAunts = (node, root) =>
    root.children.filter((n) => !node.ancestors().includes(n));

  const collapseAroundAndUnder = function (
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

  function calibrateViewPort() {
    viewportY = smallScreen ? -800 : -550;
    viewportW = canvasWidth;
    viewportX =
      viewportW / clickScale +
      clickScale * (!isDemo || smallScreen ? 3.5 : 10) * nodeRadius;
    viewportH = canvasHeight * 5;
    defaultView = `${viewportX} ${viewportY} ${viewportW} ${viewportH}`;
  }

  const reset = function () {
    if (zoomBase === undefined) return;
    scale = isDemo ? 8 : 14;
    svg.attr("viewBox", defaultView);
    expandTree();
    zoomClicked = {};
    activeNode = null;
    document.querySelector(".the-node.active") &&
      document.querySelector(".the-node.active").classList.remove("active");
    zoomBase.call(zoomer.transform, zoomIdentity);
  };

  const handleZoom = function (event, node, forParent = false) {
    if (!event || !node || event.deltaY >= 0 || deadNode(event)) return reset();
    globalZoom = clickScale;
    globalTranslate = [node.x, node.y];
    setActiveNode(forParent ? node.data : node.data);
    expand(node);
    updateCurrentHabit(node, false);
    renderTree(svg, isDemo, zoomer, {
      event: event,
      node: node,
      content: node.data,
      scale: clickedZoom ? clickScale : scale,
    });
  };

  // Re-fire the click event for habit-status changes and find the active node
  if (zoomClicked !== undefined) {
    if (zoomClicked.event !== undefined)
      clickedZoom(zoomClicked.event, zoomClicked.node);
    if (zoomClicked.content !== undefined) {
      setActiveNode(zoomClicked.content);
    }
  }

  const handleNodeToggle = function (event, node) {
    setActiveNode(node.data);
    activeNodeAnimation();
    const targ = event.target;
    if (targ.tagName == "circle") {
      if (
        targ.closest(".the-node").classList.contains("active") ||
        deadNode(event)
      )
        return reset();

      updateCurrentHabit(node, false);
      expand(node);

      zoomsG?.k && setNormalTransform(zoomClicked, zoomsG, clickScale);

      setHabitLabel(node.data);
      showHabitLabel();
      collapseAroundAndUnder(node, false, false);
      if (!isDemo) {
        const nodeContent = parseTreeValues(node.data.content);
        NodeStore.runCurrentFilterByMptt(nodeContent.left, nodeContent.right);
        HabitStore.runCurrentFilterByNode(NodeStore.current().id);
        pendingCalendarRefresh(true);
        populateCalendar().then(m.redraw);
      }
    }
  };

  const handleStatusChange = (event, node) => {
    event.preventDefault();
    if (node.children) return;
    setActiveNode(node.data);
    activeNodeAnimation();
    const opts = {
      event,
      node,
      content: node.data,
    };
    if (deadNode(event)) return reset();

    expand(node);
    renderTree(svg, isDemo, zoomer, opts);
    handleStatusToggle(node);

    setHabitLabel(node.data);
    handleZoom(event, node?.parent, true);
    // zoomsG?.k && setNormalTransform(zoomClicked, zoomsG, clickScale);
    renderTree(svg, isDemo, zoomer, opts);
    newRecord(true);
  };

  const handleHover = (e, d) => {
    // If it is an animated concentric circle, delegate to parent node
    if (e.target.classList.length === 0) {
      d = e.target.parentElement.__data__;
    }
    if (parseTreeValues(d.data.content).status === "") return;
    e.stopPropagation();
    // Hide labels if they are not part of the current subtree
    if (!(activeNode !== undefined && d.ancestors().includes(activeNode))) {
      return;
    }
    if (!currentTooltip) {
      svg.select("g.tooltip").transition();
      currentTooltip = svg.selectAll("g.tooltip").filter((t) => {
        return d == t;
      });
      currentTooltip.transition().duration(450).style("opacity", "1");
    }
    if (!currentButton) {
      svg.select("g.habit-label-dash-button").transition();
      currentButton = svg.selectAll("g.habit-label-dash-button").filter((t) => {
        return d == t;
      });
      currentButton.transition().delay(200).duration(850).style("opacity", "1");
    }
  };

  const handleEvents = function (selection) {
    selection
      .on("contextmenu", handleStatusChange)
      .on("mousewheel.zoom", handleZoom, { passive: true })
      .on("touchstart", handleHover, { passive: true })
      .on("touchend", handleNodeToggle, { passive: true })
      .on("click", handleNodeToggle, { passive: true })
      .on("mouseleave", function () {
        const g = select(this);
        g.select(".tooltip").transition().duration(50).style("opacity", "0");
        g.select(".habit-label-dash-button")
          .transition()
          .delay(1000)
          .duration(150)
          .style("opacity", "0");
        setTimeout(() => {
          currentButton = false;
        }, 100);
        setTimeout(() => {
          currentTooltip = false;
        }, 500);
      });

    // selection._groups[0].forEach((node) => {
    //   const manager = new Hammer.Manager(node);
    //   // Create a recognizer
    //   const singleTap = new Hammer.Tap({ event: "singletap" });
    //   const doubleTap = new Hammer.Tap({
    //     event: "doubletap",
    //     taps: 2,
    //     interval: 700,
    //   });
    //   manager.add([doubleTap, singleTap]);
    //   manager.get("singletap").requireFailure("doubletap");
    //   manager.on("doubletap", (ev) => {
    //     handleStatusChange(ev, node.__data__);
    //   });
    // });
  };
  function handleStatusToggle(node) {
    if (!rootData.leaves().includes(node) || node._children) return; // Non-leaf nodes have auto-generated cumulative status
    const nodeContent = parseTreeValues(node.data.content);
    NodeStore.runCurrentFilterByMptt(nodeContent.left, nodeContent.right);
    HabitStore.runCurrentFilterByNode(NodeStore.current().id);

    const currentStatus = nodeContent.status;
    node.data.content = node.data.content.replace(
      /true|false|incomplete/,
      oppositeStatus(currentStatus)
    );
    const nodeId = NodeStore.current().id;
    HabitStore.runCurrentFilterByNode(nodeId);
    if (!node.data.name.includes("Sub-Habit")) {
      // If this was not a 'ternarising' sub habit that we created for more even distribution
      return makePatchOrPutRequest(isDemo, currentStatus);
    }
  }

  function getTransform(node, xScale) {
    if (typeof node === "undefined") return;
    var x = node.__data__ ? node.__data__.x : node.x;
    var y = node.__data__ ? node.__data__.y : node.y;
    var bx = x * xScale;
    var by = y * xScale;
    var tx = -bx;
    var ty = -by;
    return { translate: [tx, ty], scale: xScale };
  }

  function clickedZoom(e, that) {
    if (e?.defaultPrevented || typeof that === "undefined") return; // panning, not clicking
    const transformer = getTransform(that, clickScale);
    select(".canvas")
      .transition()
      .ease(easePolyOut)
      .duration(isDemo ? 0 : 550)
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
  }

  function updateCurrentHabit(node, redraw = true) {
    const nodeContent = parseTreeValues(node.data.content);
    NodeStore.runCurrentFilterByMptt(nodeContent.left, nodeContent.right);
    HabitStore.current() &&
      HabitStore.runCurrentFilterByNode(NodeStore.current()?.id);
    redraw && m.redraw();
  }

  rootData.sum((d) => {
    // Return a binary interpretation of whether the habit was completed that day
    const thisNode = rootData.descendants().find((node) => node.data == d);
    console.log("thisNode :>> ", thisNode);
    let content = parseTreeValues(thisNode.data.content);
    if (content.status === "incomplete" || content.status === "") return 0;
    const statusValue = JSON.parse(content.status);
    return +statusValue;
  });

  while (rootData.descendants().some((node) => node.value > 1)) {
    // Convert node values to binary based on whether their descendant nodes are all completed
    rootData.each((node) => {
      if (node.value > 0) {
        node.value = cumulativeValue(node);
      }
    });
  }

  const treeLayout = tree().size(canvasWidth, canvasHeight).nodeSize([dy, dx]);
  treeLayout(rootData);

  const gLink = canvas
    .append("g")
    .classed("links", true)
    .attr("transform", `translate(${viewportW / 2},${scale})`);
  const gNode = canvas
    .append("g")
    .classed("nodes", true)
    .attr("transform", `translate(${viewportW / 2},${scale})`);

  const links = gLink.selectAll("line.link").data(rootData.links());

  const enteringLinks = links
    .enter()
    .append("path")
    .classed("link", true)
    .attr("stroke-opacity", (d) =>
      !activeNode || (activeNode && activeNode.descendants().includes(d.source))
        ? 0.55
        : 0.3
    )
    .attr(
      "d",
      linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)
    );

  const nodes = gNode.selectAll("g.node").data(rootData.descendants());

  const activeOrNonActiveOpacity = (d, dimmedOpacity) => {
    if (!activeNode || (activeNode && d.ancestors().includes(activeNode)))
      return "1";
    return !zoomClicked ? "1" : dimmedOpacity;
  };

  const enteringNodes = nodes
    .enter()
    .append("g")
    .attr("class", (d) =>
      activeNode && d.data.content === activeNode.data.content
        ? "the-node solid active"
        : "the-node solid"
    )
    .style("fill", nodeStatusColours)
    .style("opacity", (d) => activeOrNonActiveOpacity(d, "0.5"))
    .style("stroke-width", (d) =>
      activeNode !== undefined && d.ancestors().includes(activeNode)
        ? "2px"
        : "0"
    )
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .call(handleEvents);

  const gCircle = enteringNodes.append("g");

  activeNode && activeNodeAnimation();

  // Append circles and add hover event
  gCircle.append("circle").attr("r", nodeRadius).on("mouseenter", handleHover);

  const gTooltip = enteringNodes
    .append("g")
    .classed("tooltip", true)
    .attr("transform", `translate(${nodeRadius / scale}, 75), scale(2)`)
    .attr("opacity", (d) => activeOrNonActiveOpacity(d, "0"));

  gTooltip
    .append("rect")
    .attr("width", 3)
    .attr("height", 45)
    .attr("x", -6)
    .attr("y", -25);

  gTooltip
    .append("rect")
    .attr("width", 275)
    .attr("height", 100)
    .attr("x", -6)
    .attr("y", -10)
    .attr("rx", 15);

  // Split the name label into two parts:
  gTooltip
    .append("text")
    .attr("x", 5)
    .attr("y", 20)
    .text((d) => {
      const words = d.data.name.split(" ").slice(0, 6);
      return `${words[0] || ""} ${words[1] || ""} ${words[2] || ""} ${
        words[3] || ""
      }`;
    });
  gTooltip
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

  // MY LABELS (for modified tree traversal)
  // enteringNodes
  //   .append("text")
  //   .attr("class", "label")
  //   .attr("dx", 5)
  //   .attr("dy", 25)
  //   .style("fill", "green")
  //   .text(cumulativeValue);
  // enteringNodes //VALUE label
  //   .append("text")
  //   .attr("class", "label")
  //   .attr("dx", 45)
  //   .attr("dy", -25)
  //   .style("fill", "red")
  //   .text((d) => {
  //     return d.data.content;
  //   });

  //
  enteringNodes
    .append("g")
    .attr("transform", "translate(" + "-20" + "," + "55" + ") scale( 2.5 )")
    .append("path")
    .attr("class", "expand-arrow")
    .attr("d", (d) => {
      return d._children
        ? "M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
        : null;
    })
    .style("fill", "red");

  const gButton = gCircle
    .append("g")
    .classed("habit-label-dash-button", true)
    .attr("transform", `translate(${200}, -50), scale(2.75)`)
    .attr("style", "opacity: 0");

  gButton
    .append("rect")
    .attr("rx", 15)
    .attr("y", 5)
    .attr("width", 100)
    .attr("height", 30)
    .on("click", (e) => {
      e.stopPropagation();
    });
  gButton
    .append("text")
    .attr("x", 15)
    .attr("y", isDemo ? 25 : 30)
    .text((d) => "DETAILS")
    .on("click", (e, n) => {
      HabitStore.current(HabitStore.filterByName(n.data.name)[0]);
      let currentId = HabitStore.current()?.id;
      m.route.set(
        m.route.param("demo") ? `/habits/list?demo=true` : `/habits/list`,
        { currentHabit: currentId }
      );
    });
  if (!isDemo) {
    gButton
      .append("rect")
      .attr("rx", 15)
      .attr("y", -20)
      .attr("width", 100)
      .attr("height", 30)
      .on("click", (e) => {
        e.stopPropagation();
      });
    gButton
      .append("text")
      .attr("x", 15)
      .attr("y", (d) => (d.parent ? 2 : 5))
      .text((d) => "APPEND")
      .on("click", (e, n) => {
        openModal(true);
        updateCurrentHabit(n, false);
        modalType("d3vis");
        m.redraw();
      });
    gButton
      .append("rect")
      .attr("style", (d) => (d.parent ? "opacity: 0" : "opacity: 1"))
      .attr("rx", 15)
      .attr("y", -45)
      .attr("width", 100)
      .attr("height", 30)
      .on("click", (e) => {
        e.stopPropagation();
      });
    gButton
      .append("text")
      .attr("style", (d) => (d.parent ? "opacity: 0" : "opacity: 1"))
      .attr("x", 12)
      .attr("y", -20)
      .text((d) => "PREPEND")
      .on("click", (e, n) => {
        openModal(true);
        updateCurrentHabit(n, false);
        modalType("d3vis-prepend");
        m.redraw();
      });
  }

  function activeNodeAnimation() {
    // https://stackoverflow.com/questions/45349849/concentric-emanating-circles-d3
    // Credit: Andrew Reid
    const gCircle = svg.selectAll("g.the-node.solid.active g:first-child");
    gCircle.on("mouseover", handleHover);
    const pulseScale = scaleLinear()
      .range(["#d0790f", "#5568d2", "#3349c1"])
      .domain([0, 3 * nodeRadius]);
    const pulseData = [0, nodeRadius, nodeRadius * 2, nodeRadius * 2];
    const pulseCircles = gCircle
      .append("g")
      .classed("active-circle", true)
      .attr("stroke-opacity", (d) => {
        return activeNode && d.data.content === activeNode.data.content
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
          return d == 3 * nodeRadius ? 0 : d + nodeRadius;
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
          return d == 3 * nodeRadius ? 0 : 1;
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
};

function expandTree() {
  expand(TreeStore.root());
}

function collapseTree() {
  collapse(TreeStore.root());
}

function expand(d) {
  var children = d.children ? d.children : d._children;
  if (d._children) {
    d.children = d._children;
    d._children = null;
  }
  if (children) children.forEach(expand);
}
function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

const parseTreeValues = (valueString) => {
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

const oppositeStatus = (current) =>
  current === undefined || current === "false" || current == "incomplete"
    ? "true"
    : "false";

const nodeStatusColours = (d) => {
  if (typeof d === "undefined" || typeof d.data.content === "undefined")
    return neutralCol;
  const status = parseTreeValues(d.data.content).status;
  if (status == "false")
    // && rootData.leaves().includes(d)
    return negativeCol;
  if (status === "") return noNodeCol;
  switch (cumulativeValue(d)) {
    case 1:
      return positiveCol;
    case 0:
      return neutralCol;
    default:
      return negativeCol;
  }
};

const debounce = function (func, delay) {
  let timeout;
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func.apply(null, args), delay);
  };
};

export {
  renderTree,
  collapseTree,
  expandTree,
  debounce,
  makePatchOrPutRequest,
};
