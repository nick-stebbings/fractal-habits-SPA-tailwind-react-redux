import * as luxon from "luxon";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Habit,
  NewHabitPayload,
  DeleteHabitPayload,
  UpdateHabitPayload,
} from "./types";

// @ts-ignore
import { Dictionary } from "app/types";

// @ts-ignore
import { crudReducer, isCrud } from "app/utils";
import { actionCreators } from "./actions";

export const initialState: Dictionary<Habit | Habit[]> = {
  current: {
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
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export default habitSlice.reducer;
