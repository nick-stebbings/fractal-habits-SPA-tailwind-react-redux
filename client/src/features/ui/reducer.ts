import { createSlice, AnyAction } from "@reduxjs/toolkit";
import { Dictionary } from "app/types";
import { RequestState } from "./types";

export const dataState: RequestState = {
  status: "SUCCESS",
};
export const loadingState: RequestState = {
  status: "LOADING",
};
export const errorState: RequestState = {
  status: "ERROR",
};
export const idleState: RequestState = {
  status: "IDLE",
};

export const isDataAction = (action: AnyAction) => {
  // return action.type.endsWith("/fulfilled");
  return action.type.endsWith("nodes/fulfilled");
};

export const isErrorAction = (action: AnyAction) => {
  return action.type.endsWith("/rejected");
};

export const isLoadingAction = (action: AnyAction) => {
  return (
    !action.type.endsWith("createVis") &&
    !action.type.endsWith("nodes/fulfilled")
  );
};

const initialState: Dictionary<boolean | string> = {
  responseStatus: idleState,
  confirmStatus: false,
};

const uiStatus = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleConfirm(state) {
      state.confirmStatus = !state.confirmStatus;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isDataAction, (state) => {
      state.responseStatus = dataState;
    });
    builder.addMatcher(isLoadingAction, (state) => {
      state.responseStatus = loadingState;
    });
    builder.addMatcher(isErrorAction, (state) => {
      state.responseStatus = errorState;
    });
    builder.addDefaultCase((state) => ({
      confirmStatus: false,
      responseStatus: idleState,
    }));
  },
});

export default uiStatus;
