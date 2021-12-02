import { RootState } from "app/store";

export const getUIStatus = (state: RootState) => {
  return state?.ui;
};

export const getRequestStatus = (state: RootState) => {
  return state?.ui.responseStatus.status;
};

export const getConfirmStatus = (state: RootState) => {
  return state?.ui.confirmStatus;
};
