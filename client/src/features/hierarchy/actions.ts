import { clientRoutes } from "services/restApis";
import { createCrudActionCreators } from "app/store_utils";

const FETCH_HABIT_TREE = "fetch_habit_tree";

export const actionStrings = [FETCH_HABIT_TREE];

let clientRouteDict = {
  show_all: ({ domainId, dateId }) =>
    clientRoutes(
      `/habit_trees?domain_id=${domainId}&date_id=${dateId}`
    ).show_all(),
};

const thunkCallBacks = Object.values(clientRouteDict);

export const actionCreators = createCrudActionCreators(
  actionStrings,
  thunkCallBacks
);

const [fetchHabitTreeREST] = actionCreators;

export { fetchHabitTreeREST };
