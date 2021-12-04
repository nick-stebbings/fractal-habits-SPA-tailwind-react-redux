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
  myRecords: {},
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
    updateVisRootData(state, action: PayloadAction<any>) {
      // const { vis, label } = action.payload;
      // if (state.treeVis?.id !== "undefined")
      //   state.treeVis._viewConfig = action.payload;
      // state.treeVis.render();
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("fetch_habit_tree/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      debugger;
      state.myRecords[action.meta.arg.dateId] = JSON.stringify(
        action.payload.data
      );
      state.current.json = JSON.stringify(action.payload.data);
    });
  },
});

export default hierarchySlice.reducer;
export const visActions = hierarchySlice.actions;
