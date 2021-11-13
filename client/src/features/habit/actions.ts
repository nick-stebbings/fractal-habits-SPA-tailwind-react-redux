import { clientRoutes } from "services/restApis";
import { createCrudActionCreators } from "app/utils";
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

clientRouteDict.show_all = async (_, thunkAPI: any) =>
  fetchRoute().then((response: object) => {
    console.log("fetchRoute, thunkAPI :>> ", fetchRoute, thunkAPI);
    const parsed = JSON.parse(response.data);
    const firstHabitId = parsed.habits[0].id;
    thunkAPI.dispatch(
      fetchHabitDatesREST({ id: firstHabitId, periodLength: 7 })
    ); // Populate HabitDates for the last week
    return thunkAPI.fulfillWithValue(response); // Return reolved promise to dispatch _fulfilled action
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
