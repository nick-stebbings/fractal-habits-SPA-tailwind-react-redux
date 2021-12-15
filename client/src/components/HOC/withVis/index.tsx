import React, { ComponentType, } from 'react'

import useFetch from '../../../hooks/useFetch'
import { useLocation } from 'react-router-dom';
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
  // let divId = 1;
  
  const withVisC: React.FC = (hocProps: T) => {
    const currentPath = useLocation().pathname
    const lastPath = useLastLocation()?.pathname
    const routeChanged = !!lastPath && (currentPath !== lastPath);

    const { canvasHeight, canvasWidth } = d3SetupCanvas()
  
    return (
      <C canvasHeight={canvasHeight} canvasWidth={canvasWidth} margin={margin} divId={1} {...hocProps} routeChanged={routeChanged} render={(currentVis) => {
        console.log('returned C :>> ',);
        return (<>
      <button
            type="button"
            id="collapse-tree"
            className="vis-button"
            onClick={(e) => {
              const {target} = e
              target.parentNode.classList.toggle('active');
              try {
              target.textContent == "Collapse"
                ? currentVis.collapse()
                : currentVis.expand();
              target.textContent = target.textContent.includes("Collapse")
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
