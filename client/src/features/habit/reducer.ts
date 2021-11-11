import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Habit,
  NewHabitPayload,
  DeleteHabitPayload,
  UpdateHabitPayload,
} from "./types";
import { HabitFractActionTypes } from "services/restApis";
import { Dictionary } from "app/types";

import merge from "deepmerge";
import * as luxon from "luxon";

export const initialState: Dictionary<Habit> = {
  currentHabit: {
    timeframe: {
      fromDate: luxon.DateTime.local().startOf("day").ts,
      toDate: luxon.DateTime.local().endOf("day").ts,
      length: luxon.Duration.fromObject({ days: 1 }).toString(),
    },
    meta: {
      name: "",
      id: 0,
    },
  },
};

export const habitSlice = createSlice({
  name: "habit",
  initialState,
  reducers: {
    createHabit(state, action: PayloadAction<NewHabitPayload>) {
      const { id, habit } = action.payload;
      return {
        ...state,
        [String(id)]: { habit },
      };
    },
    deleteHabit(state, action: PayloadAction<DeleteHabitPayload>) {
      delete state[action.payload.id];
    },
    updateHabit(state, action: PayloadAction<NewHabitPayload>) {
      const { id, habit } = action.payload;
      return {
        ...state,
        [String(id)]: { habit },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HabitFractActionTypes["1"], (state, action) => {
      debugger;
      return { ...state };
    });
    //  builder.addMatcher(isLoadingAction, (state) => ({
    //    responseStatus: loadingState,
    //  }));
    //  builder.addMatcher(isErrorAction, (state) => ({
    //    responseStatus: errorState,
    //  }));
    //  builder.addDefaultCase((state) => ({
    //    responseStatus: idleState,
    //  }));
  },
});

export default habitSlice.reducer;
