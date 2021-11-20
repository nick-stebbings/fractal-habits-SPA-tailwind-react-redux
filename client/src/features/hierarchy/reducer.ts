import { actionCreators } from "./actions";
import { Hierarchy } from "./types";
import { createSlice } from "@reduxjs/toolkit";

import { Dictionary } from "app/types";

export const initialState: Dictionary<Hierarchy> = {
  current: {
    id: 0,
    json: JSON.stringify({ name: "", children: "" }),
  },
};

export const hierarchySlice = createSlice({
  name: "hierarchy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase("fetch_habit_tree/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      state.current.json = JSON.stringify(action.payload.data);
    });
  },
});

export default hierarchySlice.reducer;
