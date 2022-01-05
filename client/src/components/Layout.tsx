import React from 'react'
import {withVis} from './HOC/withVis'
import {isTouchDevice} from 'app/helpers'

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

        {isTouchDevice() && <>
          <h2 className='swipe-zone fixed text-xl uppercase bottom-20 left-1/3 lg:hidden'>Swipe Zone</h2>
          <svg className="controls-svg lg:hidden opacity-10 z-40 fixed bottom-0 border-2 left-0 w-full right-48">
          </svg>
      </>}
      
      <div id="vis" className="w-full h-full mx-auto" onContextMenuCapture={(e) => {
          if(e.target.tagName !== 'circle') return
            changesMade(true)
          }}>
        <div className="fixed bottom-0 h-28 w-1/3 md:w-48" style={{ bottom: "-40px"}}>
            <svg className="legend-svg w-full z-10"></svg>
        </div>

        <svg className="help-svg h-10 w-10 fixed bottom-2 lg:right-2 right-14" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6478E9">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </>
    ) : (
      {children}
    );
}
