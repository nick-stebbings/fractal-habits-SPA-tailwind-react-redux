import React, { ComponentType, useState } from 'react'
import "../../../assets/styles/pages/d3vis.scss";

const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const d3SetupCanvas = function () {
  const { height,width } = document.body.getBoundingClientRect();
  const canvasHeight = height - margin.top - margin.bottom;
  const canvasWidth = width - margin.right - margin.left;
  console.log('canvasHeight, canvasWidth :>> ', canvasHeight, canvasWidth);

  return { canvasHeight, canvasWidth };
};

export function withVis<T> (C : ComponentType<T>) : React.FC {
  const debounceInterval = 350
  const divId = 1;
  const { canvasHeight, canvasWidth } = d3SetupCanvas()

  const NewC: React.FC = (hocProps: T) => {
    return (
      <C canvasHeight={canvasHeight} canvasWidth={canvasWidth} divId={'1'} {...hocProps} render={(currentVis) => {
        currentVis?.render && currentVis.render()
        return (<>
      <button
        type="button"
        id="reset-tree"
        onClick={() => currentVis.expand()}
      >
        <span>Reset Tree</span>
      </button>
      <button
        type="button"
        id="collapse-tree"
        onClick={() => currentVis.collapse()}
      >
        <span>Collapse</span>
      </button>
      </>
      )}} />)
    }
  return React.memo(NewC)
}
