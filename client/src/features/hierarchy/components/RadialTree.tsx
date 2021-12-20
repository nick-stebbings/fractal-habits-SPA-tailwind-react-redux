import React, { useEffect } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { selectCurrentRadial } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";

import {VisProps} from '../types';
import Vis from "../visConstructor";
import { visActions } from "../reducer";
import { appendSvg, updateVisRootData } from "./helpers";
const { createVis } = visActions;
import { selectCurrentHierarchy } from "../selectors";

export const RadialTree: React.FC<VisProps> = ({
  canvasHeight,
  canvasWidth,
  margin,
  divId,
  render,
  routeChanged,
  deleteCompleted
}) => {
  const dispatch = useAppDispatch();

  let currentRadial = useAppSelector(selectCurrentRadial);
  const currentRequestState = useAppSelector(getRequestStatus);
  const currentHierarchy = useAppSelector(selectCurrentHierarchy);

  useEffect(() => {
    appendSvg(divId)
  }, []);

  useEffect(() => {
    if (!currentRadial || currentHierarchy?.data.name == "") return
    
    updateVisRootData(currentRadial, currentHierarchy, routeChanged);

  }, [routeChanged])

  useEffect(() => {
    if (['','OOB',undefined].includes(currentHierarchy?.data.name)) return;
    if (currentRequestState === "IDLE" && !currentRadial._svgId) {
      currentRadial = new Vis(
            `div${divId}`,
            currentHierarchy,
            canvasHeight,
            canvasWidth,
            margin,
            "radial"
          )
      dispatch(
        createVis(
          {
            label: 'radialVis',
            vis: currentRadial
          }
        )
      );
      _p("Instantiated vis object :>> ", currentRadial, "info");
    }
  }, [currentHierarchy.name]);

  return (
      <>{render(currentRadial)}</>
  );
};

export default RadialTree;
