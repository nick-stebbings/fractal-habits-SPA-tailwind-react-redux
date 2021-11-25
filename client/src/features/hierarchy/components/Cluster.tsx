import React, { useEffect, useState } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { hierarchy, select } from "d3";
// @ts-ignore
import { Selection } from "@types/d3-selection";
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
  const [currentClusterData, setCurrentClusterData] = useState({ name: "" });

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
    if (currentHierarchy.name == "") {
      return;
    } else {
      setCurrentClusterData(currentHierarchy);
      if (currentCluster?.svgId) {
        currentCluster.rootData = hierarchy(currentClusterData)
      }
    }
    console.log('currentCluster :>> ', currentCluster);
  }, [currentHierarchy])

  useEffect(() => {
    if (currentClusterData.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentCluster?._svgId) {
      currentCluster = new Vis(
            svg,
            `div${divId}`,
            hierarchy(currentClusterData),
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
      _p("Rendered from component", {}, '!' )
      currentCluster.render();
    }
  }, [currentHierarchy]);

  return (
    <div id="vis" className="w-full h-full mx-auto">
      {render(currentCluster)}
    </div>
  );
};

export default Cluster;
