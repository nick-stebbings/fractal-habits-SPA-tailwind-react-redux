import React from 'react'

interface LayoutProps {
  children: JSX.Element
}

export const VisLayout: React.FC<LayoutProps> = ({children}) => {
  return (
    <>{children}</>
    );
}
