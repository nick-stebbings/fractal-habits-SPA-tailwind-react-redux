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
  return (
    // action.type.endsWith("nodes/fulfilled") ||
    action.type.endsWith("habit_dates/fulfilled")
  );
};

export const isErrorAction = (action: AnyAction) => {
  return action.type.endsWith("/rejected");
};

export const isLoadingAction = (action: AnyAction) => {
  return action.type.endsWith("/pending");
};

const initialState: Dictionary<boolean | string> = {
  responseStatus: idleState,
  confirmStatus: false,
  confirmType: "",
};

const uiStatus = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleConfirm(state, action) {
      const type = action?.payload?.type;
      if (typeof type !== "undefined") {
        state.confirmType = type;
        state.confirmStatus = true;
      } else {
        state.confirmStatus = !state.confirmStatus;
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isDataAction, (state) => {
      state.responseStatus = dataState;
    });
    builder.addMatcher(isLoadingAction, (state) => {
      if (state.responseStatus.status == "ERROR") return state;
      state.responseStatus = loadingState;
    });
    builder.addMatcher(isErrorAction, (state) => {
      state.responseStatus = errorState;
    });
    builder.addDefaultCase((state) => ({
      ...state,
      responseStatus: idleState,
    }));
  },
});

export default uiStatus;
