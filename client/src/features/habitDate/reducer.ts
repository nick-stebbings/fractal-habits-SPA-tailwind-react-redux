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
  unPersistedForDate: [],
  myRecords: {},
};

export const habitDateSlice = createSlice({
  name: "habitDate",
  initialState,
  reducers: {
    createHabitDate(state, action: PayloadAction<Node>) {
      const { habitId, dateId, completed } = action.payload;
      state.unPersistedForDate.push({
        habit_id: habitId,
        date_id: dateId,
        completed_status: completed,
      });
    },
    updateHabitDateForNode(state, action: PayloadAction<any>) {
      const { habitId, dateId, completed, fromDateForToday } = action.payload;
      let habitDateForUpdateIdx = state.unPersistedForDate.findIndex((hd) => {
        return hd.habit_id == habitId && hd.date_id == dateId;
      });

      // Check if we have a temp persisted habit date
      if (habitDateForUpdateIdx !== -1) {
        state.unPersistedForDate[habitDateForUpdateIdx].completed_status =
          completed;
        state.current = state.unPersistedForDate[habitDateForUpdateIdx];
      } else {
        habitDateForUpdateIdx = state.myRecords[habitId]?.findIndex(
          (hd: any) =>
            hd.timeframe.fromDate == fromDateForToday && +hd.habitId == habitId
        );
        if (
          typeof habitDateForUpdateIdx !== "undefined" &&
          habitDateForUpdateIdx !== -1
        ) {
          // it was in the currentRecords, but now place it in the temp store ready for re-persisting in the DB
          let updatedHabitDate = {
            habit_id: habitId,
            date_id: dateId,
            completed_status: completed,
          };

          delete state.myRecords[habitDateForUpdateIdx];

          state.unPersistedForDate.push(updatedHabitDate);

          state.current = updatedHabitDate;
        }
      }
    },
    clearUnpersistedHabitDateCache(state, action) {
      const { currentSpaceTimeframe } = action.payload;

      const todaysHabitDate = (hd: HabitDate) =>
        hd.timeframe.fromDate == currentSpaceTimeframe.fromDate;

      // First update the persisted records in the store to prevent immediate refetch
      state.unPersistedForDate.forEach((hd: any) => {
        const habitRecords = state.myRecords[hd.habit_id];

        if (habitRecords) {
          const indexOfDateForHabit = habitRecords.findIndex(todaysHabitDate);

          if (indexOfDateForHabit !== -1) {
            if (!hd.completed_status) delete habitRecords[indexOfDateForHabit];
          }
          if (!hd.completed_status) return; // We don't persist 'false' completed values any further

          habitRecords.push({
            habitId: hd.habit_id,
            timeframe: { ...currentSpaceTimeframe },
          });
        }
      });

      state.unPersistedForDate = [];
    },
    clearPersistedHabitDateCache(state) {
      state.myRecords = {};
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

//  TODO: ENACT parentCompleted LOGIC

// A:
//\ Set a new constant for node color 'parentCompleted', to yellow.

// - WHEN a node is toggled and it is a parent
//   - AND it is incomplete
//   - AND it is complete

// - WHEN a node is completed and a child is appended
//   - THEN its new
//   -
