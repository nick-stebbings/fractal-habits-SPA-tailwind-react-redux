import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  HabitDate,
  NewHabitDatePayload,
  DeleteHabitDatePayload,
  UpdateHabitDatePayload,
} from "./types";
import { Dictionary } from "app/types";

import merge from "deepmerge";
import luxon from "luxon";

export const initialState: Dictionary<HabitDate> = {
  myHabitDates: {
    timeframe: {
      fromDate: luxon.DateTime.local().startOf("day"),
      toDate: luxon.DateTime.local().endOf("day"),
      length: luxon.Duration.fromObject({ days: 1 }),
    },
  },
};

export const habitDateSlice = createSlice({
  name: "habitDate",
  initialState,
  reducers: {
    createHabitDate(state, action: PayloadAction<NewHabitDatePayload>) {
      const { habitDates, id } = action.payload.habitDate;
      return {
        ...state,
        [String(id)]: { habitDate: habitDate || [] },
      };
    },
    deleteHabitDate(state, action: PayloadAction<DeleteHabitDatePayload>) {
      delete state[action.payload.id];
    },
    updateHabitDate(state, action: PayloadAction<NewHabitDatePayload>) {
      const { habitDate, id } = action.payload.habitDate;
      return {
        ...state,
        [String(id)]: { habitDates },
      };
    },
  },
});

export default habitDateSlice.reducer;
