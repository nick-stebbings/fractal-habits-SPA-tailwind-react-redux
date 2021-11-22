import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { fetchHabitTreeREST } from "../actions";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";

import {
  selectCurrentTree,
  selectCurrentHierarchy,
} from "features/hierarchy/selectors";
import { visActions } from "features/hierarchy/reducer";
const { createTree } = visActions;

import { selectCurrentDomain } from "features/domain/selectors";

import { select } from "d3-selection";
import { hierarchy } from "d3-hierarchy";
import Vis from "../visConstructor";

// import {
//   renderTree,
//   collapseTree,
//   expandTree,
// } from "../../../assets/scripts/d3-utilities.js";

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
  const currentDomain = useAppSelector(selectCurrentDomain);
  const currentRequestState = useAppSelector(getRequestStatus);

  const currentHierarchy = useAppSelector(selectCurrentHierarchy);
  const currentTree = useAppSelector(selectCurrentTree);
  const [currentTreeData, setCurrentTreeData] = useState({
    data: { name: "" },
  });

  const debounceInterval = 350;
  const divId = 1;
  const [svg, setSvg] = useState(null);

  const loadData = async function () {
    await dispatch(fetchHabitTreeREST({ domainId: 1, dateId: 2 }));
  };

  useEffect(() => {
    setSvg(
      select(`#vis`)
        .classed("h-screen", true)
        .classed("w-full", true)
        .append("svg")
        .attr("id", "div1")
        .classed("vis-div", "true")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style", "pointer-events: all")
    );
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentTreeData(hierarchy(JSON.parse(currentHierarchy.json)));

    if (currentTreeData.data.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentTree?._svgId) {
      ({ canvasWidth, canvasHeight } = d3SetupCanvas(document));

      dispatch(
        createTree(
          new Vis(
            svg,
            `#div${divId}`,
            currentTreeData,
            canvasHeight,
            canvasWidth
          )
        )
      );
      console.log("Instantiated vis object :>> ");
    }
    currentTree?.render && currentTree.render();
  }, [currentRequestState, JSON.stringify(currentHierarchy)]);

  return (
    <div id="vis" className="w-full h-full mx-auto">
      <button
        type="button"
        id="reset-tree"
        onClick={() => currentVis.expandTree()}
      >
        <span>Reset Tree</span>
      </button>
      <button
        type="button"
        id="collapse-tree"
        onClick={() => currentVis.collapseTree()}
      >
        <span>Collapse</span>
      </button>
    </div>
  );
};

export default HabitTree;
