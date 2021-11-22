import * as luxon from "luxon";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Domain,
  NewDomainPayload,
  DeleteDomainPayload,
  UpdateDomainPayload,
} from "./types";

// @ts-ignore
import { Dictionary } from "app/types";

// @ts-ignore
import { crudReducer, isCrud } from "app/storeHelpers";
import { actionCreators } from "./actions";

export const initialState: Dictionary<Domain | Domain[]> = {
  current: {
    meta: {
      id: 0,
      name: "",
      description: "",
      hashtag: "",
      rank: 1,
    },
  },
};

export const domainSlice = createSlice({
  name: "domain",
  initialState,
  reducers: {
    createDomain(state, action: PayloadAction<NewDomainPayload>) {
      state.current.meta = {
        ...action.payload.domain.meta,
        id: action.payload.id,
      };
    },
    deleteDomain(state, _: PayloadAction<DeleteDomainPayload>) {
      delete state.current.meta;
    },
    updateDomain(state, action: PayloadAction<UpdateDomainPayload>) {
      const { id, domainPatch } = action.payload;
      if (id !== state.current.meta.id && state.current.meta.id !== 0)
        return state;
      return {
        ...state,
        current: { ...domainPatch, ...state.current },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export default domainSlice.reducer;
