import React, { ComponentType } from 'react'
// @ts-ignore
import { store } from 'app/store';
import { Modal } from 'components/Modal';
// @ts-ignore
import { getRequestStatus } from 'features/ui/selectors';


const openModal = function (open = true) {
  const modalOverlay = document.querySelector("#modal_overlay");
  if (!modalOverlay) return;
  const modal = modalOverlay.querySelector("#modal");
  const modalCl = modal?.classList;
  if (!modalCl) return;
  if (open) {
    modalOverlay?.classList.remove("hidden");
    [...document.querySelectorAll('div[id^="tippy"]')].forEach((tooltip) => {
      tooltip?.classList.add("hidden");
    });
      modalCl.remove("opacity-0");
      modalCl.remove("-translate-y-full");
      modalCl.remove("scale-150");
      modal.style["z-index"] = 101;
      document.documentElement.style.overflow = "hidden";
  } else {
    modalCl.add("-translate-y-full");
    setTimeout(() => {
      modalCl.add("opacity-0");
      modalCl.add("scale-150");
      modal.style["z-index"] = -101;
      document.documentElement.style.overflow = "initial";
    }, 100);
    setTimeout(() => modalOverlay.classList.add("hidden"), 300);
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

export function withModal<T> (Component : ComponentType<T>) {
  return (hocProps: T) => {
    switch (true) {
      case true:
        openModal()
      case (getRequestStatus(store.getState()) == 'LOADING'):
        return (
          <>
          <Modal type={'Spinner'} />
          <Component {...hocProps}></Component>
          </>
        )
      case (getConfirmStatus(store.getState()) == 'IDLE'):
        return (
          <>
          <Modal type={'Confirm'} />
          <Component {...hocProps}></Component>
          </>
        )
      case (getRequestStatus(store.getState()) == 'ERROR'):
        return (
          <>
          <Modal type={'Error'} />
          <Component {...hocProps}></Component>
          </>
        )
      case (getRequestStatus(store.getState()) == 'IDLE'):
        openModal(false)
        return <Component {...hocProps}></Component>
    }
  }
}
