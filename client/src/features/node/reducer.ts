import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Node,
  // NewNodePayload,
  // DeleteNodePayload,
  // UpdateNodePayload,
} from "./types";
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
};

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    updateCurrentNode(state, action: PayloadAction<Node>) {
      console.log("state, action.payload :>> ", state, action.payload);
      state.current = action.payload;
    },
    updateNodeStatus(state, action: PayloadAction<any>) {
      // if (state.treeVis?.id !== "undefined")
      //   state.treeVis._viewConfig = action.payload;
      // state.treeVis.render();
      return state;
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
