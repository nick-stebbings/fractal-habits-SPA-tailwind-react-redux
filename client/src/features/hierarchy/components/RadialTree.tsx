import React, { useEffect } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { hierarchy, select } from "d3";
// @ts-ignore
import { selectCurrentRadial } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";

import {VisProps} from '../types';
import Vis from "../visConstructor";
import { visActions } from "../reducer";
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
      if (currentRadial?._svgId && JSON.stringify(currentRadial.rootData.data) !== compareString) {
        currentRadial._nextRootData = newHier
        currentRadial.render()
        _p("Rendered from component & updated ", {}, '!' )
      }
    }
  }, [JSON.stringify(currentHierarchy)])

  useEffect(() => {
    if (currentHierarchy.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentRadial._svgId) {
      currentRadial = new Vis(
            `div${divId}`,
            hierarchy(currentHierarchy),
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
      currentRadial.render()
      _p("Rendered from component", {}, '!' )
    }
  }, [currentHierarchy.name]);

  return (
      <>{render(currentRadial)}</>
  );
};

export default RadialTree;
