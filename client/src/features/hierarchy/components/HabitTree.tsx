import React, { useEffect, useState } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { hierarchy, select } from "d3";
// @ts-ignore
import { Selection } from "@types/d3-selection";
// @ts-ignore
import { selectCurrentTree } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";

import {VisProps} from '../types';
import Vis from "../visConstructor";
import { visActions } from "../reducer";
const { createVis } = visActions;
import { selectCurrentHierarchy } from "../selectors";

export const HabitTree: React.FC<VisProps> = ({
  canvasHeight,
  canvasWidth,
  margin,
  divId,
  render,
}) => {
  const dispatch = useAppDispatch();
  let currentHabitTree = useAppSelector(selectCurrentTree);
  const currentRequestState = useAppSelector(getRequestStatus);
  const currentHierarchy = useAppSelector(selectCurrentHierarchy);
  const [currentHabitTreeData, setCurrentHabitTreeData] = useState({
    data: { name: "" },
  });

  const [svg, setSvg] = useState<Selection<SVGGElement, any, any, any> | null>(null);
  useEffect(() => {
    setSvg(
      select(`#vis`)
        .append<SVGGElement>("svg")
        .attr("id", `div${divId}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style", "pointer-events: all")
    );
  }, []);

  useEffect(() => {
    currentHierarchy && setCurrentHabitTreeData(hierarchy(currentHierarchy));
    if (currentHabitTreeData.data.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentHabitTree?._svgId) {
      currentHabitTree = new Vis(
            svg,
            `div${divId}`,
            currentHabitTreeData,
            canvasHeight,
            canvasWidth,
            margin,
            "tree"
          )
      dispatch(
        createVis(
          {
            label: 'treeVis',
            vis: currentHabitTree
          }
        )
      );
      _p("Instantiated vis object :>> ", currentHabitTree, "info");
      _p("Rendered from component", {}, '!' )
      currentHabitTree.render();
    }
  }, [currentHierarchy]);

  return (
    <div id="vis" className="w-full h-full mx-auto">
      {render(currentHabitTree)}
    </div>
  );
};

export default HabitTree;
