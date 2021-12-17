import _ from "lodash";
import { hierarchy } from "d3";
import { Hierarchy } from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Dictionary } from "app/types";
import Visualization, { accumulateTree } from "./visConstructor";

export const initialState: Dictionary<
  Hierarchy | Dictionary<typeof Visualization>
> = {
  current: {
    id: 0,
    hier: { x: 0, y: 0, data: { name: "", children: "", content: "" } },
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
    updateVis(
      state,
      action: PayloadAction<Dictionary<string | typeof Visualization>>
    ) {
      const { vis, label } = action.payload;
      if (typeof state[label]?.id == "undefined") state[label] = vis;
    },
    clearFutureCache(state, action: PayloadAction<number>) {
      const { currentDateId } = action.payload;
      Object.keys(state.myRecords)
        .filter((id) => id > currentDateId)
        .forEach((id) => {
          delete state.myRecords[id];
        });
    },
    updateCurrentHierarchy(state, action: PayloadAction<any>) {
      const { nextDateId } = action.payload;
      if (state.myRecords[nextDateId]) {
        state.current.hier = state.myRecords[nextDateId];
      } else {
        state.current = {
          id: 0,
          hier: {
            name: "OOB",
            content: "",
            data: { content: "", children: "" },
          },
        };
      }
      return state;
    },
    updateCachedHierarchyForDate(state, action: PayloadAction<any>) {
      const { dateId, newHierarchy } = action.payload;
      if (state.myRecords[dateId]) {
        state.myRecords[dateId] = newHierarchy;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("fetch_habit_tree/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      const newJsonTree = hierarchy(action.payload.data);
      accumulateTree(newJsonTree);

      state.myRecords[action.meta.arg.dateId] = newJsonTree;
      state.current.hier = newJsonTree;
    });

    builder.addCase("fetch_habit_trees/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      const { data: treeJsons } = action.payload;
      const dateIds = Object.keys(treeJsons);
      const newRecords = {};

      const newTreeJsons = dateIds.map((dateId) => {
        const jsonTree = hierarchy(JSON.parse(treeJsons[dateId]));
        accumulateTree(jsonTree);
        newRecords[dateId] = jsonTree;
        return jsonTree;
      });
      state.myRecords = {
        ..._.merge(state.myRecords, newRecords),
      };
    });
  },
});

export default hierarchySlice;
export const visActions = hierarchySlice.actions;
