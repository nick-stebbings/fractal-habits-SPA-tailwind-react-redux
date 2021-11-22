// @ts-ignore
import { clientRoutes } from "services/restApis";
// @ts-ignore
import { createCrudActionCreators } from "app/storeHelpers";
// @ts-ignore
import { fetchHabitsREST } from "features/habit/actions";

// import { domainSlice } from "./reducer";
// const { createDomain, deleteDomain, updateDomain } = domainSlice.actions;

const BASE_PATH = "/domains";

const CREATE_DOMAIN = "create_domain";
const FETCH_DOMAINS = "fetch_domains";
const UPDATE_DOMAIN = "update_domain";
const DESTROY_DOMAIN = "destroy_domain";
const FETCH_DOMAIN = "fetch_domain";

export const actionStrings = [
  CREATE_DOMAIN,
  FETCH_DOMAINS,
  UPDATE_DOMAIN,
  DESTROY_DOMAIN,
  FETCH_DOMAIN,
];
let clientRouteDict = clientRoutes(BASE_PATH);
const fetchRoute = clientRouteDict.show_all.bind({});

clientRouteDict.show_all = async (_: any, thunkAPI: any) =>
  fetchRoute().then((response: any) => {
    const parsed = JSON.parse(response!.data);
    const firstDomainId = parsed.domains[0].id;
    thunkAPI.dispatch(fetchHabitsREST({ domainId: firstDomainId })); // Populate Habits for the domain
    return thunkAPI.fulfillWithValue(response);
  });

const thunkCallBacks = Object.values(clientRouteDict);
export const actionCreators = createCrudActionCreators(
  actionStrings,
  thunkCallBacks
);

const [
  createDomainREST,
  fetchDomainsREST,
  updateDomainREST,
  destroyDomainREST,
] = actionCreators;

export {
  // createDomain,
  // deleteDomain,
  // updateDomain,
  createDomainREST,
  fetchDomainsREST,
  updateDomainREST,
  destroyDomainREST,
};
