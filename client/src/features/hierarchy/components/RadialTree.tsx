import React, { useEffect, useState } from "react";
// @ts-ignore
import { useAppSelector, useAppDispatch } from "app/hooks";
import { hierarchy, select } from "d3";
// @ts-ignore
import { Selection } from "@types/d3-selection";
// @ts-ignore
import { selectCurrentRadial } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";
// @ts-ignore

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
  const [currentRadialData, setCurrentRadialData] = useState({
    data: { name: "" },
  });

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
    currentHierarchy && setCurrentRadialData(hierarchy(currentHierarchy));
    if (currentRadialData.data.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentRadial?._svgId) {
      currentRadial = new Vis(
            svg,
            `div${divId}`,
            currentRadialData,
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
  }, [currentHierarchy]);

  return (
    <div id="vis" className="w-full h-full mx-auto">
      {render(currentRadial)}
    </div>
  );
};

export default RadialTree;
