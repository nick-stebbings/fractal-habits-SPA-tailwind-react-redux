import React from 'react'
import { Header } from "./Header";
import { Layout } from "./Layout";

import { withModal } from '../components/HOC/withModal'

interface indexProps {
  isVisComponent?: boolean
  children?: JSX.Element
}

export default function App ({isVisComponent, children}: indexProps) {
  const LayoutWithModal = withModal(Layout)
  console.log('render app :>> ');
  return (
      <>
        <Header isVis={isVisComponent}/>
        <LayoutWithModal children={children} isVis={isVisComponent} />
      </>
  );
};
