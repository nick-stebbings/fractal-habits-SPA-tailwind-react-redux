import React, { ComponentType, } from 'react'

import useFetch from '../../../hooks/useFetch'
import "../../../assets/styles/pages/d3vis.scss";

const margin = {
  top: 100,
  right: 0,
  bottom: 0,
  left: -100,
};

const d3SetupCanvas = function () {
  const { height,width } = document.body.getBoundingClientRect();
  const canvasHeight = height - margin.top - margin.bottom;
  const canvasWidth = width - margin.right - margin.left;

  return { canvasHeight, canvasWidth };
};

export function withVis<T> (C : ComponentType<T>) : React.FC {
  const debounceInterval = 350
  const divId = 1;
  useFetch(true)
  
  const NewC: React.FC = (hocProps: T) => {
    const { canvasHeight, canvasWidth } = d3SetupCanvas()
    return (
      <C canvasHeight={canvasHeight} canvasWidth={canvasWidth} margin={margin} divId={'1'} {...hocProps} render={(currentVis) => {
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
              console.log('textContent :>> ', textContent);
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
  return React.memo(NewC)
}
