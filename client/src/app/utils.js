import _ from "lodash";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DateTime, Duration } from "luxon";

export function isCrud(action, create, fetch, update, destroy) {
  return [create, fetch, update, destroy]
    .map((a) => a.fulfilled().type)
    .includes(action.type);
}

const modelNameFromActionString = (actionString) =>
  actionString.split(/[_|\/]/)[1];

const mapCallbacks = {
  habits: (element) => {
    const {
      id,
      name,
      description,
      domain_id,
      habit_node_id,
      initiation_date,
    } = element;
    return {
      timeframe: {
        fromDate: DateTime.fromSQL(initiation_date).ts,
        toDate: DateTime.local().endOf("day").ts,
        length: Duration.fromMillis(
          DateTime.local().endOf("day").ts -
            DateTime.fromSQL(initiation_date).ts
        ).toString(),
      },
      meta: {
        id,
        name,
        description,
        domain_id,
        habit_node_id,
      },
    };
  },
};

export function crudReducer(state, action, create, fetch, update, destroy) {
  const {
    payload: { data },
    type,
  } = action;
  const model = modelNameFromActionString(type);
  const parsed = JSON.parse(data);
  debugger;
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
      // parsed is { "habits": [ { "id": 1, "name": "another test"... }, ... ]
      const mapped = Object.values(parsed)[0].map(mapCallbacks[model]);
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
