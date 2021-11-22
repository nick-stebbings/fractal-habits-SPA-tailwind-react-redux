import React from 'react'
import {VisLayout} from './VisLayout'

interface LayoutProps {
  isVis: boolean;
  children: JSX.Element
}

export const Layout: React.FC<LayoutProps> = ({isVis, children}) => {
  return isVis ? (
    <VisLayout>{children}</VisLayout>
    ) : (
    <>{children}</>
    );
}
