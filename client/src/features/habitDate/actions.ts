import { clientRoutes } from "services/restApis";
import { createCrudActionCreators } from "app/storeHelpers";

const BASE_PATH = "/habit_dates";

const CREATE_HABIT_DATE = "create_habit_date";
const FETCH_HABIT_DATES = "fetch_habit_dates";
const UPDATE_HABIT_DATE = "update_habit_date";
const DESTROY_HABIT_DATE = "destroy_habit_date";
const FETCH_HABIT_DATE = "fetch_habit_date";

export const actionStrings = [
  CREATE_HABIT_DATE,
  FETCH_HABIT_DATES,
  UPDATE_HABIT_DATE,
  DESTROY_HABIT_DATE,
  FETCH_HABIT_DATE,
];
let clientRouteDict = clientRoutes(BASE_PATH);
clientRouteDict.show_all = ({ id, periodLength }) => {
  return clientRoutes(
    `/habits/${id}/habit_dates?length=${periodLength}`
  ).show_all();
};

const thunkCallBacks = [
  clientRouteDict.create,
  clientRouteDict.show_all,
  clientRouteDict.update,
  clientRouteDict.destroy,
  clientRouteDict.show_one,
];

export const actionCreators = createCrudActionCreators(
  actionStrings,
  thunkCallBacks
);

const [
  createHabitDateREST,
  fetchHabitDatesREST,
  updateHabitDateREST,
  destroyHabitDateREST,
] = actionCreators;

export {
  createHabitDateREST,
  fetchHabitDatesREST,
  updateHabitDateREST,
  destroyHabitDateREST,
};
