import React, { useEffect } from "react";


import { useAppSelector, useAppDispatch } from "app/hooks";

import { selectCurrentTree } from "features/hierarchy/selectors";

import { getRequestStatus } from "features/ui/selectors";

import {VisProps} from '../types';
import Vis from "../visConstructor";
import { visActions } from "../reducer";
const { createVis } = visActions;
import { selectCurrentHierarchy } from "../selectors";
import { updateVisRootData, appendSvg } from "./helpers";

export const HabitTree: React.FC<VisProps> = ({
  canvasHeight,
  canvasWidth,
  margin,
  divId,
  render,
  routeChanged,
  deleteCompleted,
  changesMade
}) => {
  const dispatch = useAppDispatch();
  let currentHabitTree = useAppSelector(selectCurrentTree);
  const currentRequestState = useAppSelector(getRequestStatus);
  const currentHierarchy = useAppSelector(selectCurrentHierarchy);

  useEffect(() => {
    appendSvg(divId)
  }, []);

  useEffect(() => {
    if (!currentHabitTree?._svgId || currentHierarchy?.data.name == "") return
    
    updateVisRootData(currentHabitTree, currentHierarchy, routeChanged);

  }, [routeChanged,currentHierarchy?.data.name])

  useEffect(() => {
    if (['','OOB',undefined].includes(currentHierarchy?.data.name)) return;
    if ((currentRequestState === "IDLE") && !(currentHabitTree._svgId)|| (typeof currentHabitTree == 'object' && Object.keys(currentHabitTree).length == 0 )) {
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
      _p("Instantiated vis object :>> ", {}, "info");
    }
  }, [currentHierarchy?.data.name]);
  // _p("renderedd from component", {currentHier: currentHierarchy?.data.name, routeChanged}, '!' )
  return (
      <>{render(currentHabitTree)}</>
  );
};

export default HabitTree;
