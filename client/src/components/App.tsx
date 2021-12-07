import React from 'react'
import { Header } from "./Header";
import { Layout } from "./Layout";

import { useModal } from '../hooks/useModal';

interface indexProps {
  isVisComponent?: boolean
  children?: JSX.Element
}

export default function App ({isVisComponent, children}: indexProps) {
  console.log('render app :>> ');
  return (
    <>
      {useModal()}
      <Header isVis={isVisComponent} />
      <Layout children={children} isVis={isVisComponent} />
      </>
  );
};