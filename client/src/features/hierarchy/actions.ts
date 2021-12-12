import { clientRoutes } from "services/restApis";
import { createCrudActionCreators } from "app/storeHelpers";
import { fetchNodesREST } from "features/node/actions";

const CREATE_HABIT_TREE = "_";
const FETCH_HABIT_TREE = "fetch_habit_tree";
const UPDATE_HABIT_TREE = "_";
const DESTROY_HABIT_TREE = "_";
const FETCH_HABIT_TREES = "fetch_habit_trees";

export const actionStrings = [
  CREATE_HABIT_TREE,
  FETCH_HABIT_TREES,
  UPDATE_HABIT_TREE,
  DESTROY_HABIT_TREE,
  FETCH_HABIT_TREE,
];

const fetchRoute = ({ domainId, dateId }: any): Promise<any> =>
  clientRoutes(
    `/habit_trees?domain_id=${domainId}&date_id=${dateId}`
  ).show_all();

let clientRouteDict = {
  create: () => {},
  show_all: ({ domainId, dateId }: any): Promise<any> =>
    clientRoutes(
      `/habit_trees/weekly?domain_id=${domainId}&start_date_id=${Math.max.apply(
        null,
        [dateId, 1]
      )}`
    ).show_all(),
  update: () => {},
  destroy: () => {},
  show_one: async ({ domainId, dateId }: any, thunkAPI: any) =>
    fetchRoute({ domainId, dateId }).then((response: any) => {
      //thunkAPI.dispatch(fetchNodesREST()); // Populate Nodes TODO: limit this
      return thunkAPI.fulfillWithValue(response);
    }),
};

const thunkCallBacks = [
  clientRouteDict["create"],
  clientRouteDict["show_all"],
  clientRouteDict["update"],
  clientRouteDict["destroy"],
  clientRouteDict["show_one"],
];

export const actionCreators = createCrudActionCreators(
  actionStrings,
  thunkCallBacks
);

const [_A, fetchHabitTreesREST, _B, _C, fetchHabitTreeREST] = actionCreators;
console.log("actionCreators :>> ", actionCreators);
export { fetchHabitTreeREST, fetchHabitTreesREST };
