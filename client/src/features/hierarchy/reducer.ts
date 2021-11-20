import { Hierarchy } from "./types";
import { createSlice } from "@reduxjs/toolkit";

import { crudReducer, isCrud } from "app/store_utils";
import { actionCreators } from "./actions";
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
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     (action) => isCrud(action, ...actionCreators),
  //     (state, action) => crudReducer(state, action, ...actionCreators)
  //   );
  // },
});

export default hierarchySlice.reducer;
