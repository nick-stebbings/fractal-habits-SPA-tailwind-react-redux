import React from 'react'

interface LayoutProps {
  children: JSX.Element
}

export const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
    <div
      id="app"
      className="bg-gray-50 flex flex-col items-center m-0 overflow-x-hidden"
      >{children}</div>
    );
}
