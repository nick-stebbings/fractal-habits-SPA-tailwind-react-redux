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
        <Header isVis={isVisComponent}/>
        <Layout children={children} isVis={isVisComponent} />
      </>
  );
};
