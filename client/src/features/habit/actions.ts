import BASE_URL, { clientRoutes } from "services/restApis";
import { isCrud, createCrudActionCreators } from "app/utils";

import { Habit } from "./types";
// import { habitSlice } from "./reducer";
// const { createHabit, deleteHabit, updateHabit } = habitSlice.actions;

const BASE_PATH = "/habits";

const CREATE_HABIT = "create_habit";
const FETCH_HABITS = "fetch_habits";
const UPDATE_HABIT = "update_habit";
const DESTROY_HABIT = "destroy_habit";
const FETCH_HABIT = "fetch_habit";

export const actionStrings = [
  CREATE_HABIT,
  FETCH_HABITS,
  UPDATE_HABIT,
  DESTROY_HABIT,
  FETCH_HABIT,
];
const thunkCallBacks = Object.values(clientRoutes(BASE_PATH));
const actionCreators = createCrudActionCreators(actionStrings, thunkCallBacks);

const [
  createHabitREST,
  fetchHabitREST,
  updateHabitREST,
  destroyHabitREST,
] = actionCreators;

export {
  // createHabit,
  // deleteHabit,
  // updateHabit,
  createHabitREST,
  fetchHabitREST,
  updateHabitREST,
  destroyHabitREST,
};
