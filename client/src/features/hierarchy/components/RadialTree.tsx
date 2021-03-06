import React, { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "app/hooks";

import { selectCurrentRadial } from "features/hierarchy/selectors";

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
  deleteCompleted,
  changesMade
}) => {
  const dispatch = useAppDispatch();

  let currentRadial = useAppSelector(selectCurrentRadial);
  const currentRequestState = useAppSelector(getRequestStatus);
  const currentHierarchy = useAppSelector(selectCurrentHierarchy);

  useEffect(() => {
    appendSvg(divId)
  }, []);

  useEffect(() => {
    if (!currentRadial?._svgId || currentHierarchy?.data.name == "") return
    
    updateVisRootData(currentRadial, currentHierarchy, routeChanged);

  }, [routeChanged,currentHierarchy?.data.name])

  useEffect(() => {
    if (['','OOB',undefined].includes(currentHierarchy?.data.name)) return;
    if (currentRequestState === "IDLE" && !currentRadial._svgId || (typeof currentRadial == 'object' && Object.keys(currentRadial).length == 0 )) {
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
      _p("Instantiated vis object :>> ", {}, "info");
    }
  }, [currentHierarchy?.data.name]);

  // _p("renderedd from component", {currentHier: currentHierarchy?.data.name, routeChanged}, '!' )
  return (
      <>{render(currentRadial)}</>
  );
};

export default RadialTree;
