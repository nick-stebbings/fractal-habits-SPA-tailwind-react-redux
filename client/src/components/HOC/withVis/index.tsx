import React, { ComponentType, useEffect} from 'react'

import useFetch from '../../../hooks/useFetch'
import { useLocation,  Redirect } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import "../../../assets/styles/components/vis.scss";

import { useAppSelector, useAppDispatch } from 'app/hooks';
import UISlice from 'features/ui/reducer';
const { resetDeleteCompleted } = UISlice.actions;
import HabitSlice from 'features/habit/reducer';
const { updateCurrentHabit } = HabitSlice.actions;

import { selectDeleteCompleted } from 'features/ui/selectors';

const margin = {
  top: (document.body.getBoundingClientRect().height / 8),
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
  
  const withVisC: React.FC = (hocProps: T) => {
    let deleteCompleted = useAppSelector(selectDeleteCompleted)
    const dispatch = useAppDispatch();
    const { canvasHeight, canvasWidth } = d3SetupCanvas()
    
    const currentPath = useLocation()
    const lastPath = useLastLocation()
    const routeChanged = !!lastPath && (currentPath.pathname !== lastPath?.pathname);
    
    return (
      <C canvasHeight={canvasHeight} routeChanged={routeChanged} canvasWidth={canvasWidth} margin={margin} divId={1} {...hocProps} deleteCompleted={deleteCompleted} render={(currentVis) => {
        useEffect(() => {
          if (deleteCompleted) {
            currentVis.render()
            dispatch(resetDeleteCompleted())
          }
        }, [deleteCompleted])
        
        if (routeChanged) {
          return (<Redirect to={currentPath} />)
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
                    currentVis.resetForExpandedMenu({justTranslation: false})
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
