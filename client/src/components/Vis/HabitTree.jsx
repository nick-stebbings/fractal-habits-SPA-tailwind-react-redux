import React, { useEffect } from "react";

import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import {
  debounce,
  zooms,
  d3SetupCanvas,
  renderTree,
  collapseTree,
  expandTree,
} from "../../assets/scripts/d3-utilities.js";

// @ts-ignore
import { selectCurrentTree } from "app/features/hierarchy/selectors";

const currentTree = useAppSelector(selectCurrentTree);
// import { addSwipeGestures } from "../../assets/scripts/animations";

import "../../assets/styles/pages/d3vis.scss";

export const HabitTree = function () {
  let demoData = true;
  let canvasWidth;
  let canvasHeight;
  let svg;

  const debounceInterval = 350;
  const zoomer = zoom().scaleExtent([0, 5]).duration(10000).on("zoom", zooms);
  const divId = 1;
  function updateStoresAndRenderTree(modalType) {
    // DateStore.current()?.id &&
    //   TreeStore.index(
    //     demoData,
    //     DomainStore.current().id,
    //     DateStore.current().id
    //   )
    //     .then(() => {
    //       DateStore.indexDatesOfHabit(HabitStore.current());
    //       !demoData &&
    //         HabitStore.current() &&
    //         HabitDateStore.index().then(() =>
    //           NodeStore.runCurrentFilterByHabit(HabitStore.current())
    //         );
    //     })
    //     .then(() => {
    //       TreeStore.root() &&
    //         svg &&
    //         renderTree(
    //           svg,
    //           demoData,
    //           zoomer,
    //           {},
    //           canvasWidth,
    //           canvasHeight,
    //           modalType
    //         );
    //     });
  }

  useEffect(() => {
    svg = select(`div${divId}`)
      .classed("h-screen", true)
      .classed("w-full", true)
      .append("svg")
      .classed("vis-div", "true")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("style", "pointer-events: all");

    ({ canvasWidth, canvasHeight } = d3SetupCanvas(document));

    svg &&
      renderTree(
        svg,
        false,
        zoomer,
        {},
        canvasWidth,
        canvasHeight,
        "vis",
        currentTree
      );
  }, []);

  return (
    <div id="vis" className="w-full h-full mx-auto">
      <svg id="div1" />
      <button type="button" id="reset-tree">
        <span>Reset Tree</span>
      </button>
      <button type="button" id="collapse-tree">
        <span>Collapse</span>
      </button>
    </div>
  );
};

export default HabitTree;
