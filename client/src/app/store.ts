import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

// Import Reducers From Slices
import uiReducer from "features/ui/reducer";
import todoReducer from "features/todo/reducer";
import habitReducer from "features/habit/reducer";
import habitDateReducer from "features/habitDate/reducer";
import spaceSlice from "features/space/slice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    todo: todoReducer,
    habit: habitReducer,
    habitDate: habitDateReducer,
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
