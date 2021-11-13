import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  HabitDate,
  NewHabitDatePayload,
  DeleteHabitDatePayload,
  UpdateHabitDatePayload,
} from "./types";
import { Dictionary } from "app/types";

import { crudReducer, isCrud } from "app/utils";
import { actionCreators } from "./actions";
import * as luxon from "luxon";

export const initialState: Dictionary<HabitDate[]> = {
  myRecords: [
    {
      habitId: 0,
      timeframe: {
        fromDate: luxon.DateTime.local().startOf("day").ts,
        toDate: luxon.DateTime.local().endOf("day").ts,
        length: luxon.Duration.fromObject({ days: 1 }).toString(),
      },
    },
  ],
};

export const habitDateSlice = createSlice({
  name: "habitDate",
  initialState,
  reducers: {
    createHabitDate(state, action: PayloadAction<NewHabitDatePayload>) {
      const { habitDates, id } = action.payload.habitDate;
      return {
        ...state,
        myRecords: { habitDate: habitDate || [] },
      };
    },
    deleteHabitDate(state, action: PayloadAction<DeleteHabitDatePayload>) {
      delete state[action.payload.id];
    },
    updateHabitDate(state, action: PayloadAction<NewHabitDatePayload>) {
      const { habitDate, id } = action.payload.habitDate;
      return {
        ...state,
        myHabitDates: { habitDate },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export default habitDateSlice.reducer;
