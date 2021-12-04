import { hierarchy } from "d3";
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
    updateCurrentHierarchy(state, action: PayloadAction<any>) {
      const { nextDateId } = action.payload;
      if (state.myRecords[nextDateId]) {
        state.current.json = state.myRecords[nextDateId];
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("fetch_habit_tree/fulfilled", (state, action) => {
      if (!action?.payload) return state;

      state.myRecords[action.meta.arg.dateId] = JSON.stringify(
        action.payload.data
      );
      state.current.json = JSON.stringify(action.payload.data);
    });
    builder.addCase("fetch_habit_trees/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      const { data: treeJsons } = action.payload;
      const dateIds = Object.keys(treeJsons);

      dateIds.map((dateId) => {
        try {
          const jsonTree = hierarchy(JSON.parse(treeJsons[dateId]));

          Visualization.sumHierarchyData.call(null, jsonTree);
          Visualization.accumulateNodeValues.call(null, jsonTree);
        } catch (error) {
          console.error("Failed accumulating weekly tree jsons: ", error);
        }
      });

      state.myRecords = {
        ...state.myRecords,
        ...treeJsons,
      };
    });
  },
});

export default hierarchySlice.reducer;
export const visActions = hierarchySlice.actions;
