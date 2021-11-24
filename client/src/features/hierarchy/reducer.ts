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
  radialVis: {},
  clusterVis: {},
};

export const hierarchySlice = createSlice({
  name: "hierarchy",
  initialState,
  reducers: {
    createVis(
      state,
      action: PayloadAction<Dictionary<string | typeof Visualization>>
    ) {
      const { vis, label } = action.payload;
      if (typeof state[label]?.id == "undefined") state[label] = vis;
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
