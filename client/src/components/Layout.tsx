import React from 'react'
import {withVis} from './HOC/withVis'

interface LayoutProps {
  isVis: boolean,
  children?: JSX.Element
}

export const Layout: React.FC<LayoutProps> = ({ isVis, children }) => {
  // console.log('rendered layour :>> ');
  const LayoutWithVis = React.Children.only(children) && withVis(children.type)
  return isVis ? (
    <>
      <LayoutWithVis />
          <div id="vis" className="w-full h-full mx-auto">
            <div className="fixed bottom-0 h-28 md:w-1/5 lg:w-1/4">
              <svg className="legend-svg"></svg>
              <svg className="controls-svg -bottom-4 w-1/2 lg:w-1/4 fixed lg:left-16 sm:left-24 left:16 h-24 hidden"></svg>
            </div>
        </div>
    </>
    ) : (
      {children}
    );
}
