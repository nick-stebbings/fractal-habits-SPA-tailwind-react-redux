import _ from "lodash";
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
    hier: { x: 0, y: 0, data: { name: "", children: "" } },
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
  },
  extraReducers: (builder) => {
    builder.addCase("fetch_habit_tree/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      const newJsonTree = hierarchy(action.payload.data);
      Visualization.sumHierarchyData.call(null, newJsonTree);
      Visualization.accumulateNodeValues.call(null, newJsonTree);

      state.myRecords[action.meta.arg.dateId] = newJsonTree;
      state.current.hier = newJsonTree;
    });

    builder.addCase("fetch_habit_trees/fulfilled", (state, action) => {
      if (!action?.payload) return state;
      const { data: treeJsons } = action.payload;
      const dateIds = Object.keys(treeJsons);

      const newTreeJsons = dateIds.map((dateId) => {
        try {
          const jsonTree = hierarchy(JSON.parse(treeJsons[dateId]));
          Visualization.sumHierarchyData.call(null, jsonTree);
          Visualization.accumulateNodeValues.call(null, jsonTree);
          return jsonTree;
        } catch (error) {
          console.error("Failed accumulating weekly tree jsons: ", error);
        }
      });
      state.myRecords = {
        ..._.merge(state.myRecords, Object.assign({}, newTreeJsons)),
      };
    });
  },
});

export default hierarchySlice.reducer;
export const visActions = hierarchySlice.actions;
