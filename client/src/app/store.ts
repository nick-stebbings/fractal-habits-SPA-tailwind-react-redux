import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

// Import Reducers From Slices

// @ts-ignore
import uiSlice from "features/ui/reducer";

// @ts-ignore
import todoReducer from "features/todo/reducer";

// @ts-ignore
import habitSlice from "features/habit/reducer";

// @ts-ignore
import domainReducer from "features/domain/reducer";

// @ts-ignore
import habitDateReducer from "features/habitDate/reducer";

// @ts-ignore
import hierarchyReducer from "features/hierarchy/reducer";

// @ts-ignore
import nodeSlice from "features/node/reducer";

// @ts-ignore
import spaceSlice from "features/space/slice";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    todo: todoReducer,
    habit: habitSlice.reducer,
    domain: domainReducer,
    habitDate: habitDateReducer,
    hierarchy: hierarchyReducer,
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
