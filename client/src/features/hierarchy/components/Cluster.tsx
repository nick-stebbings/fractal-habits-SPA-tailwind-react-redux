import React, { useEffect } from "react";

// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { selectCurrentCluster } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";

import {VisProps} from '../types';
import Vis from "../visConstructor";
import { visActions } from "../reducer";
const { createVis } = visActions;
import { selectCurrentHierarchy } from "../selectors";
import { appendSvg, updateVisRootData } from "./helpers";

export const Cluster: React.FC<VisProps> = ({
  canvasHeight,
  canvasWidth,
  margin,
  divId,
  render,
  routeChanged,
  deleteCompleted
}) => {
  const dispatch = useAppDispatch();
  let currentCluster = useAppSelector(selectCurrentCluster);
  const currentRequestState = useAppSelector(getRequestStatus);
  const currentHierarchy = useAppSelector(selectCurrentHierarchy);

  useEffect(() => {
    appendSvg(divId)
  }, []);
  
  useEffect(() => {
    if (!currentCluster || currentHierarchy?.data.name == "") return
    
    updateVisRootData(currentCluster, currentHierarchy, routeChanged);
  }, [routeChanged,currentHierarchy?.data.name])

  useEffect(() => {
    if (['','OOB',undefined].includes(currentHierarchy?.data.name)) return;
    if ((currentRequestState === "IDLE") && !currentCluster._svgId || currentHierarchy?.data.name == "RESET") {
      currentCluster = new Vis(
            `div${divId}`,
            currentHierarchy,
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
      _p("Instantiated vis object :>> ", {}, "info");
    }
  }, [currentHierarchy?.data.name]);

  _p("renderedd from component", {currentHier: currentHierarchy?.data.name, routeChanged}, '!' )
  return (
      <>{render(currentCluster)}</>
  );
};

export default Cluster;
