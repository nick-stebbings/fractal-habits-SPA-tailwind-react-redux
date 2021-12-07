import React, { useEffect } from "react";

// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { selectCurrentTree } from "features/hierarchy/selectors";
// @ts-ignore
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
}) => {
  const dispatch = useAppDispatch();
  
  let currentHabitTree = useAppSelector(selectCurrentTree);
  const currentRequestState = useAppSelector(getRequestStatus);
  const currentHierarchy = useAppSelector(selectCurrentHierarchy);

  useEffect(() => {
    appendSvg(divId)
  }, []);

    useEffect(() => {
    currentHierarchy?.data.name !== "" && updateVisRootData(currentHabitTree, currentHierarchy)
  }, [currentHierarchy?.id])

  useEffect(() => {
    if (['','OOB',undefined].includes(currentHierarchy?.data.name)) return;
    if ((currentRequestState === "IDLE") && !(currentHabitTree._svgId)) {
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
    }
  }, [currentHierarchy?.data.name]);
  
  return (
      <>{render(currentHabitTree)}</>
  );
};

export default HabitTree;
