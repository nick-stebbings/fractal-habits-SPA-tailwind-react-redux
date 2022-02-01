import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Domain,
  NewDomainPayload,
  DeleteDomainPayload,
  UpdateDomainPayload,
} from "./types";

import { Dictionary } from "app/types";

import { crudReducer, isCrud } from "app/storeHelpers";
import { actionCreators } from "./actions";

export const initialState: Dictionary<Domain | Domain[]> = {
  currentIndex: 1,
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
    updateCurrentIndex(state, action: PayloadAction<Number>) {
      const newIndex = action.payload;

      return {
        ...state,
        currentIndex: newIndex + 1,
      };
    },
    updateCurrentDomainFromIndex(state, action: PayloadAction<Number>) {
      const newIndex = action.payload;
      const newDomain = state.myRecords[newIndex];

      return !!newDomain
        ? {
            ...state,
            current: newDomain,
          }
        : state;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => isCrud(action, ...actionCreators),
      (state, action) => crudReducer(state, action, ...actionCreators)
    );
  },
});

export const domainActions = domainSlice.actions;

export default domainSlice.reducer;
