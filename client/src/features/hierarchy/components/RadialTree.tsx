import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "app/hooks";
// // @ts-ignore
import { hierarchy } from "d3-hierarchy";
import { Selection } from "@types/d3-selection";
import { selectCurrentRadial } from "features/hierarchy/selectors";
import { getRequestStatus } from "features/ui/selectors";
import { visActions } from "features/hierarchy/reducer";
const { createRadial } = visActions;

import { select } from "d3-selection";
import Vis from "../visConstructor";

interface VisProps {
  canvasHeight: number
  canvasWidth: number
  divId: number
  currentHierarchyJson: string
  render: any //(_:any):void
}

export const RadialTree: React.FC<VisProps> = ({
  canvasHeight,
  canvasWidth,
  divId,
  currentHierarchyJson,
  render,
}) => {
  const dispatch = useAppDispatch();
  const currentRadial = useAppSelector(selectCurrentRadial);
  const currentRequestState = useAppSelector(getRequestStatus);
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
    console.log('DID IT :>> ', currentRadial);
    currentHierarchyJson && setCurrentRadialData(hierarchy(JSON.parse(currentHierarchyJson)));

    if (currentRadialData.data.name == "") return;
    if (currentRequestState === "SUCCESS" && !currentRadial?._svgId) {
      dispatch(
        createRadial(
          new Vis(
            svg,
            `#div${divId}`,
            currentRadialData,
            canvasHeight,
            canvasWidth,
            "cluster"
          )
        )
      );
      _p("Instantiated vis object :>> ", {}, "info");
    }
    currentRadial?.render && currentRadial.render();
  }, [currentHierarchyJson, currentRequestState]);

  return render();
};

export default RadialTree;
