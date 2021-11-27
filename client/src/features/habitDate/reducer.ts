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

//// \ If a habit didn't exist on a day, it should not be rendered

// - WHEN a node is toggled and it is a parent
//   - AND it is incomplete
//     - THEN ask the user if all descendants should be complete,
//     - AND add positive habit_nodes for all descendants
//      - AND potentially collapse the node

//    - OR if it should just become parentCompleted status
//      - AND No new habit_dates are created for the descendants, but the node in question has habit_date toggled

//   - AND it is complete
//     - THEN ask the user if all descendants should be incomplete
//     - AND add negative habit_nodes for all descendants
//    - OR if it should just become incomplete status - the node in question has habit_date toggled

// - WHEN a node is completed and a child is appended
//   - THEN appended nodes don't yet have habit_dates
//   - AND the view should update parent completed node to parentCompleted colour

// E:

// A:
//\ Set a new constant for node color 'parentCompleted', to yellow.

// - WHEN a node is toggled and it is a parent
//   - AND it is incomplete
//   - AND it is complete

// - WHEN a node is completed and a child is appended
//   - THEN its new
//   -

// Set the calendar widget and tree to display the parentCompleted colour when a node is completed but it has children

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
    // deleteHabitDate(state, action: PayloadAction<number>) {
    //   delete state[action.payload];
    // },
    updateHabitDateForNode(state, action: PayloadAction<any>) {
      const { habitId, value } = action.payload;
      state.tempForCurrentDate;
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
