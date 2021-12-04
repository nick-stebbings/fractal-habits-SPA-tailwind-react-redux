import { clientRoutes } from "services/restApis";
import { createCrudActionCreators } from "app/storeHelpers";
import { fetchNodesREST } from "features/node/actions";
const FETCH_HABIT_TREE = "fetch_habit_tree";
const FETCH_HABIT_TREES = "fetch_habit_trees";

export const actionStrings = [FETCH_HABIT_TREE, FETCH_HABIT_TREES];

let clientRouteDict = {
  show_one: ({ domainId, dateId }: any): Promise<any> =>
    clientRoutes(
      `/habit_trees?domain_id=${domainId}&date_id=${dateId}`
    ).show_all(),
  show_all: ({ domainId, dateId }: any): Promise<any> =>
    clientRoutes(
      `/habit_trees/weekly?domain_id=${domainId}&start_date_id=${Math.max.apply(
        null,
        [dateId, 1]
      )}`
    ).show_all(),
};

const fetchRoute = clientRouteDict.show_one.bind({});

clientRouteDict.show_one = async ({ domainId, dateId }: any, thunkAPI: any) =>
  fetchRoute({ domainId, dateId }).then((response: any) => {
    thunkAPI.dispatch(fetchNodesREST()); // Populate Nodes TODO: limit this
    return thunkAPI.fulfillWithValue(response);
  });

const thunkCallBacks = Object.values(clientRouteDict);

export const actionCreators = createCrudActionCreators(
  actionStrings,
  thunkCallBacks
);

const [fetchHabitTreeREST, fetchHabitTreesREST] = actionCreators;

export { fetchHabitTreeREST, fetchHabitTreesREST };
