import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";
// @ts-ignore
import { hierarchy } from "d3-hierarchy";
// @ts-ignore
import { Selection } from "@types/d3-selection";
// @ts-ignore
import { selectCurrentRadial } from "features/hierarchy/selectors";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";
// @ts-ignore
import { visActions } from "features/hierarchy/reducer";
const { createRadial } = visActions;

import { select } from "d3-selection";
import Vis from "../visConstructor";
import { selectCurrentHierarchy } from "../selectors";

interface VisProps {
  canvasHeight: number
  canvasWidth: number
  divId: number
  render: any //(_:any):void
}

export const RadialTree: React.FC<VisProps> = ({
  canvasHeight,
  canvasWidth,
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
            `#div${divId}`,
            currentRadialData,
            canvasHeight,
            canvasWidth,
            "cluster"
          )
      dispatch(
        createRadial(
          currentRadial
        )
      );
      _p("Instantiated vis object :>> ", currentRadial, "info");
      _p("Rendered from component", {}, '!' )
      currentRadial.render();
    }
  }, [currentHierarchy]);
  return <div id="vis" className="w-full h-full mx-auto">{render(currentRadial)}</div>;
};

export default RadialTree;
