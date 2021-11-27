import React, { useEffect } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { hierarchy, select } from "d3";
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

  useEffect(() => {
    select(`#div${divId}`).empty() &&
      select(`#vis`)
        .append<SVGGElement>("svg")
        .attr("id", `div${divId}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style", "pointer-events: all")
  }, []);

    useEffect(() => {
    if (currentHierarchy.name == "") {
      return;
    } else {
      // Check if the hierarchy in the store is a new one (a new tree needs rendering)
      const newHier = hierarchy(currentHierarchy)
      const compareString = JSON.stringify(newHier.data)
      if (currentHabitTree?._svgId && JSON.stringify(currentHabitTree.rootData.data) !== compareString) {
        currentHabitTree._nextRootData = newHier
        currentHabitTree.render()
        _p("Rendered from component & updated ", {}, '!' )
      }
    }
  }, [JSON.stringify(currentHierarchy)])

  useEffect(() => {
    if (currentHierarchy.name == "") return;
    if (currentRequestState === "SUCCESS" && !(currentHabitTree._svgId)) {
      currentHabitTree = new Vis(
            `div${divId}`,
            hierarchy(currentHierarchy),
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
      currentHabitTree.render()
      _p("Rendered from component", {}, '!' )
    }
  }, [currentHierarchy.name]);

  return (
      <>{render(currentHabitTree)}</>
  );
};

export default HabitTree;
