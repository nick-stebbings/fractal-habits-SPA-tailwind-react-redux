// @ts-ignore
import { clientRoutes } from "services/restApis";
// @ts-ignore
import { createCrudActionCreators } from "app/storeHelpers";
// @ts-ignore
import { fetchHabitDatesREST } from "features/habitDate/actions";
import { selectCurrentHabit } from "./selectors";
import { selectCurrentHabitDate } from "./../habitDate/selectors";

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
    const s = thunkAPI.getState();
    console.log(
      "!(selectCurrentHabit(s)?.meta.id) :>> ",
      !selectCurrentHabit(s)?.meta.id
    );
    console.log(
      selectCurrentHabit(s)?.meta.id,
      selectCurrentHabitDate(s)?.habitId
    );
    if (
      !selectCurrentHabit(s)?.meta.id ||
      selectCurrentHabit(s)?.meta.id !== selectCurrentHabitDate(s)?.habitId
    ) {
      // If we need to reload
      const firstHabitId = parsed.habits[0].id;
      thunkAPI.dispatch(
        fetchHabitDatesREST({ id: firstHabitId, periodLength: 7 })
      ); // Populate HabitDates for the last week
    }
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
  fetchHabitREST,
] = actionCreators;

export {
  createHabitREST,
  fetchHabitsREST,
  updateHabitREST,
  destroyHabitREST,
  fetchHabitREST,
};
