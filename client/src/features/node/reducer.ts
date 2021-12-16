import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node } from "./types";
import { Dictionary } from "app/types";

import { crudReducer, isCrud } from "app/storeHelpers";
import { actionCreators } from "./actions";

export const initialState: Dictionary<Dictionary<Node | Node[]>> = {
  current: {
    id: 0,
    lft: 1,
    rgt: 2,
    parentId: 0,
  },
  myRecords: [],
  unPersistedForDate: [],
};

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    createNode(state, action: PayloadAction<Node>) {
      const { habitId, dateId, completed } = action.payload;
      console.log("state :>> ", state.myRecords);
      state.unPersistedForDate.push({
        habit_id: habitId,
        date_id: dateId,
        completed_status: completed,
      });
    },
    updateCurrentNode(state, action: PayloadAction<Node>) {
      state.current = action.payload;
    },
    deleteCurrentNode(state, _: PayloadAction<any>) {
      if (!!state?.myRecords) {
        state.myRecords = [...state.myRecords].filter(
          (r) => r.id !== state.current.id
        );
      }
      state.current = state.myRecords[0] || initialState.current;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export default nodeSlice;
