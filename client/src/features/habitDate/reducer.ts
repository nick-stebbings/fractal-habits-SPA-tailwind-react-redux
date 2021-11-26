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

// P:
//     When a habit has been completed in the past as an atom, and it gets consequently subdivided, it's recorded state will be completed.

//     However, there is an upwards cascading logic for completing habits, such that for a habit to be completed at a high level it must have all ancestor habits also completed.

// Devise a consistent way of maintaining the 'previous completion state' of a previous atomic habit.

// RULES:

// If a habit was historically completed as an atom, that day's tree should commemorate that. (it should be green)

// If a habit is green on the tree it should be green in the calendar widget and the same with other colours.

// If a completed habit has new child nodes added, it should become 'semi completed'. This means it can only achieve full completion once all ancestor nodes are complete.

// If a habit didn't exist on a day, it should not be rendered

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
