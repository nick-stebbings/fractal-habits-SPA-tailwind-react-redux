import _ from "lodash";
import { createAsyncThunk } from "@reduxjs/toolkit";

export function isCrud(action, create, fetch, update, destroy) {
  return [create, fetch, update, destroy]
    .map((a) => a.fulfilled().type)
    .includes(action.type);
}

export function crudReducer(state, action, create, fetch, update, destroy) {
  const {
    payload,
    type,
    meta: { cellIdString },
  } = action;

  switch (type) {
    // CREATE AND UPDATE SHARE A RESPONSE TYPE
    case create.fulfilled().type:
    case update.fulfilled().type:
      return {
        ...state,
        [cellIdString]: {
          ...state[cellIdString],
          [payload.address]: {
            ...payload.entry,
            address: payload.address,
          },
        },
      };

    // FETCH
    case fetch.fulfilled().type:
      // payload is [ { entry: { key: val }, address: 'QmAsdFg' }, ... ]
      const mapped = payload.map((r) => {
        return {
          ...r.entry,
          address: r.address,
        };
      });
      // mapped is [ { key: val, address: 'QmAsdFg' }, ...]
      const newVals = _.keyBy(mapped, "address");
      // combines pre-existing values of the object with new values from
      // Holochain fetch
      return {
        ...state,
        [cellIdString]: {
          ...state[cellIdString],
          ...newVals,
        },
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
