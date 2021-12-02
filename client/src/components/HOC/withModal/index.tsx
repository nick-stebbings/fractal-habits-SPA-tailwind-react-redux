import React, { ComponentType, useEffect } from 'react'
// @ts-ignore
import { useAppSelector } from 'app/hooks';
import { getUIStatus } from 'features/ui/selectors';

// @ts-ignore
import { Modal } from 'components/Modal';

export const openModal = function ({open = true} = {open: true}) {
  const modalOverlay = document.querySelector("#modal_overlay");
  if (!modalOverlay) return;
  const modal = modalOverlay.querySelector("#modal");
  const modalCl = modal?.classList;
  if (!modalCl) return;
  if (open) {
    modalOverlay?.classList.remove("hidden");
    // [...document.querySelectorAll('div[id^="tippy"]')].forEach((tooltip) => {
    //   tooltip?.classList.add("hidden");
    // });
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

export function withModal<T>(Component: ComponentType<T>) {
  return React.memo((hocProps: T) => {
    useEffect(() => {
      openModal()
    },[])
    const uiStatus = useAppSelector(getUIStatus);
    const type = uiStatus?.responseStatus.status
    const confirmStatus = uiStatus?.confirmStatus
    switch (true) {
      case (type == 'ERROR'):
        return (
          <>
          <Modal type={'Error'} />
          <Component {...hocProps}></Component>
          </>
        )
      case (type == 'IDLE' && confirmStatus):
        return (
          <>
          <Modal type={uiStatus?.confirmType} toggle={openModal} />
          <Component {...hocProps}></Component>
          </>
        )
      // case (confirmStatus):
      //   return (
      //     <>
      //     <Modal type={'Confirm'} toggle={openModal} />
      //     <Component {...hocProps}></Component>
      //     </>
      //   )
      case (type == 'LOADING'):
        return (
          <>
          <Modal type={'Spinner'} />
          <Component {...hocProps}></Component>
          </>
        )
      default:
        return <Component {...hocProps}></Component>
    }
  })
}
