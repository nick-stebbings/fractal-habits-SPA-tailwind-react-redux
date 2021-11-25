import React from 'react'
import {withVis} from './HOC/withVis'

interface LayoutProps {
  isVis: boolean,
  children?: JSX.Element
}

export const Layout: React.FC<LayoutProps> = ({ isVis, children }) => {
  console.log('rendered layour :>> ');
  const LayoutWithVis = React.Children.only(children) && React.memo(withVis(children.type))
  return isVis ? (
    <LayoutWithVis />
    ) : (
      {children}
    );
}
