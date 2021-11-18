import React, { ComponentType } from 'react'
// @ts-ignore
import { store } from 'app/store';
// @ts-ignore
import { getRequestStatus } from 'features/ui/selectors';

export function withSpinner<T> (Component : ComponentType<T>) {
  return (hocProps: T) => {
    switch (true) {
      case (getRequestStatus(store.getState())== 'ERROR'):
        return (<>
          <p>{'hiii'}</p>
          <Component {...hocProps}></Component>
        </>)
      default:
        return <Component {...hocProps}></Component>
    }
  }
}
