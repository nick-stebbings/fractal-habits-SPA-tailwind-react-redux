import { clientRoutes } from "services/restApis";
import { createCrudActionCreators } from "app/store_utils";
import { fetchNodesREST } from "features/node/actions";
const FETCH_HABIT_TREE = "fetch_habit_tree";

export const actionStrings = [FETCH_HABIT_TREE];

let clientRouteDict = {
  show_all: ({ domainId, dateId }: any): Promise<any> =>
    clientRoutes(
      `/habit_trees?domain_id=${domainId}&date_id=${dateId}`
    ).show_all(),
};

const fetchRoute = clientRouteDict.show_all.bind({});

clientRouteDict.show_all = async ({ domainId, dateId }: any, thunkAPI: any) =>
  fetchRoute({ domainId, dateId }).then((response: any) => {
    thunkAPI.dispatch(fetchNodesREST()); // Populate Nodes
    return thunkAPI.fulfillWithValue(response);
  });

const thunkCallBacks = Object.values(clientRouteDict);

export const actionCreators = createCrudActionCreators(
  actionStrings,
  thunkCallBacks
);

const [fetchHabitTreeREST] = actionCreators;

export { fetchHabitTreeREST };
