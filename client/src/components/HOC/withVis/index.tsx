import React, { ComponentType, useState, useEffect } from 'react'
// @ts-ignore
import { store } from "app/store";
// @ts-ignore
import { getRequestStatus } from "features/ui/selectors";
// @ts-ignore
import { selectCurrentDomain } from "features/domain/selectors";
// @ts-ignore
import { selectCurrentRadial } from 'features/hierarchy/selectors';
// @ts-ignore
import {
  selectCurrentHierarchy,
} from "features/hierarchy/selectors";
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

  return { canvasHeight, canvasWidth };
};

const currentHierarchyJson = selectCurrentHierarchy(store.getState())?.json;

export function withVis<T> (C : ComponentType<T>) : React.FC {
  const debounceInterval = 350
  const divId = 1;
  const { canvasHeight, canvasWidth} = d3SetupCanvas()

  const NewC: React.FC = (hocProps: T) => {
    const currentVis = selectCurrentRadial(store.getState());
    
    console.log('rendered :>> ');
    
    return (
      <C canvasHeight={canvasHeight} canvasWidth={canvasWidth} divId={'1'} currentHierarchyJson={currentHierarchyJson} {...hocProps} render={(  ) => <div id="vis" className="w-full h-full mx-auto">
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
    </div>  
      } />
    );
  }
  return NewC
}
