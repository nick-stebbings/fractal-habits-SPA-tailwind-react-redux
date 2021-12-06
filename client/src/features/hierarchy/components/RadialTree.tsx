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
}) => {
  const dispatch = useAppDispatch();

  let currentRadial = useAppSelector(selectCurrentRadial);
  const currentRequestState = useAppSelector(getRequestStatus);
  const currentHierarchy = useAppSelector(selectCurrentHierarchy);

  useEffect(() => {
    appendSvg(divId)
  }, []);

    useEffect(() => {
    currentHierarchy.name !== "" && updateVisRootData(currentRadial, currentHierarchy)
  }, [currentHierarchy.name])


  useEffect(() => {
    if (currentHierarchy.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentRadial._svgId) {
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
