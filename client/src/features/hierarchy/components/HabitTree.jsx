import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { fetchHabitTreeREST } from "../actions";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";
import { selectCurrentTree } from "features/hierarchy/selectors";
import { selectCurrentDomain } from "features/domain/selectors";

import { select } from "d3-selection";
import { hierarchy } from "d3-hierarchy";
import {
  debounce,
  renderTree,
  collapseTree,
  expandTree,
} from "../../../assets/scripts/d3-utilities.js";

let canvasHeight, canvasWidth;
const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const d3SetupCanvas = function (document) {
  const { width, height } = document.body.getBoundingClientRect();

  canvasWidth = width - margin.right - margin.left;
  canvasHeight = height - margin.top - margin.bottom;

  return { canvasWidth, canvasHeight };
};

// import { addSwipeGestures } from "../../assets/scripts/animations";

import "../../../assets/styles/pages/d3vis.scss";

export const HabitTree = function () {
  const dispatch = useAppDispatch();
  const currentHierarchy = useAppSelector(selectCurrentTree);
  const currentDomain = useAppSelector(selectCurrentDomain);
  const currentRequestState = useAppSelector(getRequestStatus);

  const [currentTree, setCurrentTree] = useState({
    data: { name: "" },
  });

  let demoData = true;
  let canvasWidth;
  let canvasHeight;
  let svg;

  const debounceInterval = 350;
  const divId = 1;

  const loadData = async function () {
    await dispatch(fetchHabitTreeREST({ domainId: 1, dateId: 2 }));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentTree(hierarchy(JSON.parse(currentHierarchy.json)));

    if (currentTree.data.name == "") return;
    ({ canvasWidth, canvasHeight } = d3SetupCanvas(document));

    svg = select(`#div${divId}`)
      .classed("h-screen", true)
      .classed("w-full", true)
      .append("svg")
      .classed("vis-div", "true")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("style", "pointer-events: all");

    svg &&
      currentHierarchy &&
      renderTree(svg, false, {}, canvasWidth, canvasHeight, "vis", currentTree);
    return () => svg.selectAll("*").remove();
  }, [currentRequestState]);

  return (
    <div id="vis" className="w-full h-full mx-auto">
      <svg id="div1" />
      <button type="button" id="reset-tree" on onClick={() => expandTree()}>
        <span>Reset Tree</span>
      </button>
      <button
        type="button"
        id="collapse-tree"
        on
        onClick={() => collapseTree()}
      >
        <span>Collapse</span>
      </button>
    </div>
  );
};

export default HabitTree;
