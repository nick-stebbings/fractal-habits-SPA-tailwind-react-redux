import React from 'react'
import {withVis} from './HOC/withVis'

interface LayoutProps {
  isVis: boolean,
  changesMade: Function, // Set a 'edited' state in the App component to signify a DB POST call is needed
  children?: JSX.Element,
}

export const Layout: React.FC<LayoutProps> = ({ isVis,changesMade, children }) => {

  const LayoutWithVis = React.Children.only(children) && withVis(children.type)
  return isVis ? (
    <>
      <LayoutWithVis />
      <div id="vis" className="w-full h-full mx-auto" onContextMenuCapture={(e) => {
          if(e.target.tagName !== 'circle') return
            changesMade(true)
          }}>
        <div className="fixed bottom-0 h-28 w-1/3 md:w-48" style={{ bottom: "-40px"}}>
              <svg className="legend-svg w-full"></svg>
              <svg className="controls-svg -bottom-4 w-1/2 lg:w-1/4 fixed lg:left-16 sm:left-24 left:16 h-24 hidden"></svg>
            </div>
        </div>
    </>
    ) : (
      {children}
    );
}
