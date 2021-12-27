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
  return (
    !action.type.startsWith("habit_trees") && // This multiple day fetch is always done in the background so no spinner needed
    action.type.endsWith("habit_dates/fulfilled")
  );
};

export const isDeleteDataAction = (action: AnyAction) =>
  action.type.startsWith("destroy_habit") && action.type.endsWith("fulfilled"); // For every habit deleted a node will be deleted, so pickup this action

export const isErrorAction = (action: AnyAction) => {
  return action.type.endsWith("/rejected");
};

export const isLocalAction = (action: AnyAction) => {
  return (
    !action.type.endsWith("/pending") &&
    !action.type.endsWith("/fulfilled") &&
    !action.type.endsWith("/pending")
  );
};

const isFirstHabitDatesAction = (action: AnyAction) => {
  return action.type === "fetch_habit_dates/pending" && action.meta.arg.id == 1;
};

export const isLoadingAction = (action: AnyAction) => {
  return (
    isFirstHabitDatesAction(action) ||
    (action.type != "fetch_habit_dates/pending" &&
      action.type.endsWith("/pending")) ||
    [
      "fetch_domains/fulfilled",
      "fetch_habits/fulfilled",
      "fetch_nodes/fulfilled",
      "create_habit/fulfilled",
    ].includes(action.type)
  ); // These actions are always followed by more fetches and so loading can be considered in progress;
};

const initialState: Dictionary<boolean | string> = {
  responseStatus: idleState,
  confirmStatus: false,
  confirmType: "",
  deleteCompleted: false,
  routeChanged: false,
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
    resetDeleteCompleted(state) {
      state.deleteCompleted = false;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isDataAction, (state) => {
      state.responseStatus = dataState;
    });
    builder.addMatcher(isDeleteDataAction, (state) => {
      state.deleteCompleted = true;
    });
    builder.addMatcher(isLoadingAction, (state) => {
      if (state.responseStatus.status == "ERROR") return state;
      state.responseStatus = loadingState;
    });
    builder.addMatcher(isErrorAction, (state) => {
      state.responseStatus = errorState;
    });
    builder.addMatcher(isLocalAction, (state) => state);
    builder.addDefaultCase((state) => ({
      ...state,
      responseStatus: idleState,
    }));
  },
});

export default uiStatus;
