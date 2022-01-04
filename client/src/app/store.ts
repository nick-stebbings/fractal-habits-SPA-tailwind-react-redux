import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

// Import Reducers From Slices

import uiSlice from "features/ui/reducer";

import todoReducer from "features/todo/reducer";

import habitSlice from "features/habit/reducer";

import domainReducer from "features/domain/reducer";

import habitDateSlice from "features/habitDate/reducer";

import hierarchySlice from "features/hierarchy/reducer";

import nodeSlice from "features/node/reducer";

import spaceSlice from "features/space/slice";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    todo: todoReducer,
    habit: habitSlice.reducer,
    domain: domainReducer,
    habitDate: habitDateSlice.reducer,
    hierarchy: hierarchySlice.reducer,
    node: nodeSlice.reducer,
    space: spaceSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
