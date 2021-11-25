import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HabitDate } from "./types";
import { Dictionary } from "app/types";

import { crudReducer, isCrud } from "app/storeHelpers";
import { actionCreators } from "./actions";
import * as luxon from "luxon";

export const initialState: Dictionary<HabitDate[]> = {
  current: {
    habitId: 0,
    timeframe: {
      fromDate: luxon.DateTime.local().startOf("day").ts,
      toDate: luxon.DateTime.local().endOf("day").ts,
      length: luxon.Duration.fromObject({ days: 1 }).toString(),
    },
  },
};

export const habitDateSlice = createSlice({
  name: "habitDate",
  initialState,
  reducers: {
    // createHabitDate(state, action: PayloadAction<NewHabitDatePayload>) {
    //   const { habitDates, id } = action.payload.habitDate;
    //   return {
    //     ...state,
    //     myRecords: { habitDate: habitDate || [] },
    //   };
    // },
    // deleteHabitDate(state, action: PayloadAction<DeleteHabitDatePayload>) {
    //   delete state[action.payload.id];
    // },
    updateHabitDateForNode(state, action: PayloadAction<any>) {
      const { habitId, value } = action.payload;
      // store.dispatch(
      // fetchHabitDatesREST({ id: firstHabitId, periodLength: 7 })
      // );
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export default habitDateSlice;
