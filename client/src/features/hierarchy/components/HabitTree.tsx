import React, { useEffect } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { select } from "d3";
// @ts-ignore
import { selectCurrentTree } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";

import {VisProps} from '../types';
import Vis from "../visConstructor";
import { visActions } from "../reducer";
const { createVis } = visActions;
import { selectCurrentHierarchy } from "../selectors";
import { updateVisRootData } from "./helpers";

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
    currentHierarchy?.data.name !== "" && updateVisRootData(currentHabitTree, currentHierarchy)
  }, [JSON.stringify(currentHierarchy.data)])

  useEffect(() => {
    console.log(currentHierarchy?.data.name, 'currentRequestState === "SUCCESS" && !(currentHabitTree._svgId) :>> ', (currentRequestState === "SUCCESS" || currentRequestState === "IDLE")  && !(currentHabitTree._svgId));
    if (['','OOB',undefined].includes(currentHierarchy?.data.name)) return;
    if ((currentRequestState === "SUCCESS" || currentRequestState === "IDLE") && !(currentHabitTree._svgId)) {
      currentHabitTree = new Vis(
            `div${divId}`,
            currentHierarchy,
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
  }, [currentHierarchy?.data.name]);

  return (
      <>{render(currentHabitTree)}</>
  );
};

export default HabitTree;
