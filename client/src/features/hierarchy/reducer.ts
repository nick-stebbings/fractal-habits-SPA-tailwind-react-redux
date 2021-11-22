import { actionCreators } from "./actions";
import { Hierarchy } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Dictionary } from "app/types";
import Visualization from "./visConstructor";

export const initialState: Dictionary<
  Hierarchy | Dictionary<typeof Visualization>
> = {
  current: {
    id: 0,
    json: JSON.stringify({ name: "", children: "" }),
  },
  treeVis: {},
};

export const hierarchySlice = createSlice({
  name: "hierarchy",
  initialState,
  reducers: {
    createTree(state, action: PayloadAction<typeof Visualization>) {
      if (state.treeVis?.id !== "undefined") state.treeVis = action.payload;
      return state;
    },
    createRadial(state, action: PayloadAction<typeof Visualization>) {
      if (state.radialVis?.id !== "undefined") state.radialVis = action.payload;
      return state;
    },
    updateViewConfig(state, action: PayloadAction<any>) {
      if (state.treeVis?.id !== "undefined")
        state.treeVis._viewConfig = action.payload;
      state.treeVis.render();
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("fetch_habit_tree/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      state.current.json = JSON.stringify(action.payload.data);
    });
  },
});

export default hierarchySlice.reducer;
export const visActions = hierarchySlice.actions;
