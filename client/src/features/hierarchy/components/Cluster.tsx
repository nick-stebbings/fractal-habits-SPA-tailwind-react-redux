import React, { useEffect } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { hierarchy, select } from "d3";
// @ts-ignore
import { selectCurrentCluster } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";

import {VisProps} from '../types';
import Vis from "../visConstructor";
import { visActions } from "../reducer";
const { createVis } = visActions;
import { selectCurrentHierarchy } from "../selectors";

export const Cluster: React.FC<VisProps> = ({
  canvasHeight,
  canvasWidth,
  margin,
  divId,
  render,
}) => {
  const dispatch = useAppDispatch();
  let currentCluster = useAppSelector(selectCurrentCluster);
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
      const newHier = hierarchy(currentHierarchy)
      const compareString = JSON.stringify(newHier.data)
      if (currentCluster?._svgId && JSON.stringify(currentCluster.rootData.data) !== compareString) {
        currentCluster._nextRootData = newHier
        currentCluster.render()
        _p("Rendered from component & updated ", {}, '!' )
      }
    }
  }, [JSON.stringify(currentHierarchy)])

  useEffect(() => {
    if (currentHierarchy.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentCluster._svgId) {
      currentCluster = new Vis(
            `div${divId}`,
            hierarchy(currentHierarchy),
            canvasHeight,
            canvasWidth,
            margin,
            "cluster"
          )
      dispatch(
        createVis(
          {
            label: 'clusterVis',
            vis: currentCluster
          }
        )
      );
      _p("Instantiated vis object :>> ", currentCluster, "info");
      currentCluster.render()
      _p("Rendered from component", {}, '!' )
    }
  }, [currentHierarchy.name]);

  return (
      <>{render(currentCluster)}</>
  );
};

export default Cluster;
