import React, { ComponentType, useEffect} from 'react'

import useFetch from '../../../hooks/useFetch'
import { useLocation,  Redirect } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import "./vis.scss";

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {isTouchDevice} from 'app/helpers'
import UISlice from 'features/ui/reducer';
const { resetDeleteCompleted } = UISlice.actions;

import { selectDeleteCompleted } from 'features/ui/selectors';

const margin = {
  top: (document.body.getBoundingClientRect().height / (document.body.getBoundingClientRect().height > 1025 ? 6 : 4)),
  right: 0,
  bottom: 0,
  left: 200,
};

const d3SetupCanvas = function () {
  const { height,width } = document.body.getBoundingClientRect();
  const canvasHeight = height - margin.top - margin.bottom;
  const canvasWidth = width - margin.right - margin.left;

  return { canvasHeight, canvasWidth };
};

export function withVis<T> (C : ComponentType<T>) : React.FC {
  useFetch(true)
  
  const withVisC: React.FC = (hocProps: T) => {
    const { changesMade } = hocProps;
    let deleteCompleted = useAppSelector(selectDeleteCompleted)

    const dispatch = useAppDispatch();
    const { canvasHeight, canvasWidth } = d3SetupCanvas()
    
    const currentPath = useLocation()
    const lastPath = useLastLocation()
    const routeChanged = !!lastPath && (currentPath.pathname !== lastPath?.pathname);
    
    return (
      <C canvasHeight={canvasHeight} canvasWidth={canvasWidth} margin={margin} divId={1} changesMade={changesMade} deleteCompleted={deleteCompleted} routeChanged={routeChanged} render={(currentVis:any) => {

        // Propagate changes to the App component so that it can post new habitDates only after a doubletap event is handled
        useEffect(() => {
          if (currentVis?._manager) { // If mobile event handlers have been bound
            const f = currentVis.eventHandlers.rgtClickOrDoubleTap.bind(null)
            currentVis.eventHandlers.rgtClickOrDoubleTap = function (e:any, d:any) {
              f.call(null, e, d) // Call the original function
              
              changesMade(true)
            }.bind(currentVis)
            }
        }, [])
  
        useEffect(() => {
          if (deleteCompleted) {
            currentVis.render()
            dispatch(resetDeleteCompleted())
          }
        }, [deleteCompleted])
        
        if (routeChanged) {
          if (currentVis?.rootData) {
            currentVis.rootData.routeChanged = true
          }
          return (<Redirect to={currentPath.pathname} />)
        }

        return (
          <>
          <button
                type="button"
                id="collapse-tree"
                className="vis-button"
                onClick={(e) => {
                  const {target} = e
                  target.classList.toggle('active');
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
          <button
                type="button"
                id="reset-tree"
                className="vis-button"
                onClick={(e) => {
                  window.scrollTo(0,0)
                  try {
                    currentVis?.resetForExpandedMenu && currentVis.resetForExpandedMenu({justTranslation: false})
                  } catch (error) {
                    console.error("Could not mutate tree: ", error);
                  }
                }}
          >
            <span>RESET VIEW</span>
          </button>
       </>
      )}} />)
    }
  return (withVisC)
}
