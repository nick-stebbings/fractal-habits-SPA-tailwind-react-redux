// @ts-ignore
import { clientRoutes } from "services/restApis";
// @ts-ignore
import { createCrudActionCreators } from "app/store_utils";
// @ts-ignore
import { fetchHabitDatesREST } from "features/habitDate/actions";

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
let clientRouteDict = clientRoutes(BASE_PATH);
const fetchRoute = clientRouteDict.show_all.bind({});

clientRouteDict.show_all = async (_: any, thunkAPI: any) =>
  fetchRoute().then((response: any) => {
    const parsed = JSON.parse(response!.data);
    const firstHabitId = parsed.habits[0].id;
    thunkAPI.dispatch(
      fetchHabitDatesREST({ id: firstHabitId, periodLength: 7 })
    ); // Populate HabitDates for the last week
    return thunkAPI.fulfillWithValue(response);
  });

const thunkCallBacks = Object.values(clientRouteDict);
export const actionCreators = createCrudActionCreators(
  actionStrings,
  thunkCallBacks
);

const [
  createHabitREST,
  fetchHabitsREST,
  updateHabitREST,
  destroyHabitREST,
] = actionCreators;

export {
  // createHabit,
  // deleteHabit,
  // updateHabit,
  createHabitREST,
  fetchHabitsREST,
  updateHabitREST,
  destroyHabitREST,
};
