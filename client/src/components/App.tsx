import React from 'react'
import { Header } from "./Header";
import { Layout } from "./Layout";

interface indexProps {
  isVisComponent?: boolean
  children?: JSX.Element
}

export default function App ({isVisComponent, children}: indexProps) {
  console.log('render app :>> ');
  return (
      <>
        <Header isVis={isVisComponent} />
        <Layout children={children} isVis={isVisComponent} />
        {isVisComponent && <div id="vis" className="w-full h-full mx-auto">
          <div className="fixed bottom-0 h-28 w-1/2 lg:w-1/4">
            <svg className="legend-svg"></svg>
            <svg className="controls-svg -bottom-4 w-1/2 lg:w-1/4 fixed lg:left-16 sm:left-24 left:16 h-24 hidden"></svg>
          </div>
      </div>}
      </>
  );
};