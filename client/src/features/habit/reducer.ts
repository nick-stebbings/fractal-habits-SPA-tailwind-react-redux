import { DateTime, Duration } from "luxon";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Habit, NewHabitPayload, UpdateHabitPayload } from "./types";

// @ts-ignore
import { Dictionary } from "app/types";

// @ts-ignore
import { crudReducer, isCrud } from "app/storeHelpers";
import { actionCreators } from "./actions";

export const initialState: Dictionary<Habit | Habit[]> = {
  current: {
    timeframe: {
      fromDate: DateTime.local().startOf("day")!.ts,
      toDate: DateTime.local().endOf("day")!.ts,
      length: Duration.fromObject({ days: 1 }).toString(),
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
      state.current.meta = {
        ...action.payload.habit.meta,
        id: action.payload.id,
      };
      state.current.timeframe = action.payload.habit.timeframe;
    },
    deleteCurrentHabit(state, _: PayloadAction<any>) {
      delete state.current.meta;
    },
    updateHabit(state, action: PayloadAction<UpdateHabitPayload>) {
      const { id, habitPatch } = action.payload;
      if (id !== state.current.meta.id && state.current.meta.id !== 0)
        return state;
      return {
        ...state,
        current: { ...habitPatch, ...state.current },
      };
    },
    updateCurrentHabit(state, action: PayloadAction<Habit>) {
      state.current = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export default habitSlice;
