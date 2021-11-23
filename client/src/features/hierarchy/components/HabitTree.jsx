import React, { useEffect, useState } from "react";
import { useAppSelector } from "app/hooks";
// // @ts-ignore
import { selectCurrentTree } from "features/hierarchy/selectors";
import { hierarchy } from "d3-hierarchy";
import { getRequestStatus } from "features/ui/selectors";

import { visActions } from "features/hierarchy/reducer";
const { createTree } = visActions;

import { select } from "d3-selection";
import Vis from "../visConstructor";

export const HabitTree = function ({
  canvasHeight,
  canvasWidth,
  divId,
  currentHierarchyJson,
}) {
  const dispatch = useAppDispatch();
  const currentTree = useAppSelector(selectCurrentTree);
  const [currentTreeData, setCurrentTreeData] = useState({
    data: { name: "" },
  });

  const [svg, setSvg] = useState(null);
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

  const currentRequestState = useAppSelector(getRequestStatus);

  useEffect(() => {
    setCurrentTreeData(hierarchy(JSON.parse(currentHierarchyJson.json)));

    if (currentTreeData.data.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentTree?._svgId) {
      dispatch(
        createTree(
          new Vis(
            svg,
            `#div${divId}`,
            currentTreeData,
            canvasHeight,
            canvasWidth,
            "tree"
          )
        )
      );
      _p("Instantiated vis object :>> ", {}, "info");
    }
    currentTree?.render && currentTree.render();
  }, [currentRequestState, JSON.stringify(currentHierarchyJson)]);

  return (
    <div id="vis" className="w-full h-full mx-auto">
      <button
        type="button"
        id="reset-tree"
        onClick={() => currentTree.expand()}
      >
        <span>Reset Tree</span>
      </button>
      <button
        type="button"
        id="collapse-tree"
        onClick={() => currentTree.collapse()}
      >
        <span>Collapse</span>
      </button>
    </div>
  );
};

export default HabitTree;
