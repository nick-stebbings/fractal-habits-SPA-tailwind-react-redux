import { clientRoutes } from "services/restApis";
import { createCrudActionCreators } from "app/storeHelpers";
const BASE_PATH = "/habit_trees/nodes";

const CREATE_NODE = "create_node";
const FETCH_NODES = "fetch_nodes";
const UPDATE_NODE = "update_node";
const DESTROY_NODE = "destroy_node";
const FETCH_NODE = "fetch_node";

export const actionStrings = [
  CREATE_NODE,
  FETCH_NODES,
  UPDATE_NODE,
  DESTROY_NODE,
  FETCH_NODE,
];
let clientRouteDict = clientRoutes(BASE_PATH);
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

const [createNodeREST, fetchNodesREST, updateNodeREST, destroyNodeREST] =
  actionCreators;

export { createNodeREST, fetchNodesREST, updateNodeREST, destroyNodeREST };
