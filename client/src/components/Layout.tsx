import React from 'react'

interface LayoutProps {
  children: JSX.Element
}

export const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
    <>{children}</>
    );
}
