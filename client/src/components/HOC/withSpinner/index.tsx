import React, { ComponentType } from 'react'

interface withSpinnerProps<T> {
  component: ComponentType<T>;
}

export function withSpinner<T> ({component} : withSpinnerProps<T>) {
  return (hocProps: T) => {
   return (   
    <p> {'state'}</p>
    );
  }
}
