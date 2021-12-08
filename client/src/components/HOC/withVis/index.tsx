import React, { ComponentType, } from 'react'

import { useLocation } from 'react-router-dom';

import { RouteComponentProps, withRouter } from 'react-router-dom';


import useFetch from '../../../hooks/useFetch'
import { useLastLocation } from 'react-router-last-location';
import "../../../assets/styles/pages/d3vis.scss";

const margin = {
  top: 200,
  right: 0,
  bottom: 0,
  left: 0,
};

const d3SetupCanvas = function () {
  const { height,width } = document.body.getBoundingClientRect();
  const canvasHeight = height - margin.top - margin.bottom;
  const canvasWidth = width - margin.right - margin.left;

  return { canvasHeight, canvasWidth };
};

export function withVis<T> (C : ComponentType<T>) : React.FC {
  useFetch(true)
  let divId = 1;
  
  const withVisC: React.FC = (hocProps: T) => {
    const currentPath = useLocation().pathname
    const lastPath = useLastLocation()?.pathname

    const { canvasHeight, canvasWidth } = d3SetupCanvas()
    return (
      <C canvasHeight={canvasHeight} canvasWidth={canvasWidth} margin={margin} divId={1} {...hocProps} render={(currentVis) => {
        if (!!lastPath && currentVis.clearFirstRenderFlag && currentPath!==lastPath){// && (lastPath !== currentPath)) {
          currentVis.clearFirstRenderFlag();
          console.log('currentVis._hasRendered :>> ', currentVis._hasRendered);
          currentVis.render()
        }
        console.log('returned C :>> ',);
        return (<>
      {/* <button
        type="button"
        id="reset-tree"
        className="vis-button"
        onClick={() => currentVis.expand()}
      >
        <span>Reset Tree</span>
      </button> */}
      <button
            type="button"
            id="collapse-tree"
            className="vis-button"
            onClick={(e) => {
              const {target: { classList, textContent }} = e
              classList.toggle('active');
              try {
              textContent == "Collapse"
                ? currentVis.collapse()
                : currentVis.expand();

              e.target.textContent = textContent.includes("Collapse")
                ? "Expand"
                : "Collapse"; 
              } catch (error) {
                console.error("Could not mutate tree: ", error);
              }
            }}
      >
        <span>{currentVis?.rootData && (currentVis.rootData._children ? "Expand" : "Collapse")}</span>
      </button>
      </>
      )}} />)
    }
  return (withVisC)
}
