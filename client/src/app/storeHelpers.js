// import _ from "lodash";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import { createInterval } from "../features/space/utils";

export function isCrud(action, create, fetch, update, destroy) {
  return [create, fetch, update, destroy]
    .map((a) => a.fulfilled().type)
    .includes(action.type);
}

const modelNameFromActionString = (actionString) =>
  actionString.split(/(?:^.*?_)|(?:[\/])/)[1]; // take the model name e.g. habit_dates from fetch_habit_dates/fulfilled

const mapCallbacks = {
  habits: (element) => {
    const { id, name, description, domain_id, habit_node_id, initiation_date } =
      element;
    const intervalSpace = createInterval(
      0,
      1,
      DateTime.fromSQL(initiation_date)
    );
    return {
      ...intervalSpace,
      meta: {
        id,
        name,
        description,
        domainId: domain_id,
        habitNodeId: habit_node_id,
      },
    };
  },
  habit_dates: (element) => {
    const { date, completed_status, habit_id } = element;

    const daySpace = createInterval(0, 1, DateTime.fromSQL(date));
    return {
      ...daySpace,
      habit_id,
    };
  },
  domains: (element) => {
    return {
      meta: element,
    };
  },
  nodes: (element) => {
    return element;
  },
};

export function crudReducer(state, action, create, fetch, update, destroy) {
  const { payload, type } = action;
  const model = modelNameFromActionString(type);
  const parsed = payload?.data && JSON.parse(payload?.data);
  let mapped;

  switch (type) {
    // CREATE AND UPDATE SHARE A RESPONSE TYPE
    case create.fulfilled().type:
    case update.fulfilled().type:
      return {
        ...state,
        //
      };

    // FETCH

    case fetch.fulfilled().type:
      // parsed is e.g. { "habits": [ { "id": 1, "name": "another test"... }, ... ]
      console.log("parsed :>> ", parsed);
      mapped = Object.values(parsed)[0]
        .map(mapCallbacks[model])
        .filter((record) => record !== undefined);
      console.log("mapped :>> ", mapped);
      return {
        current: mapped[0] || state.current, //.slice(-1)
        myRecords: mapped,
      };

    // DESTROY

    case destroy.fulfilled().type:
      mapped = Object.values(parsed)[0].map(mapCallbacks[model]);
      return {
        ...state,
        myRecords: mapped,
      };
    default:
      return state;
  }
}

export function createCrudActionCreators(actionTypes, callBacks) {
  const create = createAsyncThunk(actionTypes[0], callBacks[0]);
  const fetchAll = createAsyncThunk(actionTypes[1], callBacks[1]);
  const update = createAsyncThunk(actionTypes[2], callBacks[2]);
  const destroy = createAsyncThunk(actionTypes[3], callBacks[3]);
  return [create, fetchAll, update, destroy];
}
