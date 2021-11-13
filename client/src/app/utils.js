// import _ from "lodash";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { DateTime, Duration } from "luxon";

const daySpace = (startRelative = 0, numberOfDays = 1, startDate = null) => {
  startDate ||= DateTime.local().startOf("day");
  return {
    // startRelative is days relative to startDate (negative)
    timeframe: {
      fromDate: startDate - Duration.fromObject({ days: -startRelative }),
      toDate:
        startDate + Duration.fromObject({ days: startRelative + numberOfDays }),
      length: Duration.fromObject({ days: numberOfDays }).toString(),
    },
  };
};

export const weekOfDaySpaces = (startRelative = 0) =>
  Array.from("1234567")
    .map((_, idx) => daySpace(startRelative - idx, 1))
    .reverse();

export function isCrud(action, create, fetch, update, destroy) {
  return [create, fetch, update, destroy]
    .map((a) => a.fulfilled().type)
    .includes(action.type);
}

const modelNameFromActionString = (actionString) =>
  actionString.split(/(?:^.*?_)|(?:[\/])/)[1]; // take the model name e.g. habit_dates from fetch_habit_dates/fulfilled

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
    const space = daySpace(0, 1, DateTime.fromSQL(initiation_date));
    return {
      ...space,
      meta: {
        id,
        name,
        description,
        domain_id,
        habit_node_id,
      },
    };
  },
  habit_dates: (element) => {
    const { date, completed_status, habit_id } = element;
    if (!completed_status) return;

    const space = daySpace(0, 1, DateTime.fromSQL(date));
    return {
      ...space,
      habit_id,
    };
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

      mapped = Object.values(parsed)[0]
        .map(mapCallbacks[model])
        .filter((record) => record !== null);
      return {
        current: mapped[0] || state.current,
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
