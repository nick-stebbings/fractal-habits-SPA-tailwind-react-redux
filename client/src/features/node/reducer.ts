import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Node,
  // NewNodePayload,
  // DeleteNodePayload,
  // UpdateNodePayload,
} from "./types";
import { Dictionary } from "app/types";

import { crudReducer, isCrud } from "app/store_utils";
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export default nodeSlice.reducer;
