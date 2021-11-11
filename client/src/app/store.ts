import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

// Import Reducers From Slices
import uiReducer from "features/ui/reducer";
import todoReducer from "features/todo/reducer";
import habitReducer from "features/habit/reducer";
import habitDateReducer from "features/habitDate/reducer";
import spaceReducer from "features/space/reducer";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    todo: todoReducer,
    habit: habitReducer,
    habitDate: habitDateReducer,
    space: spaceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
