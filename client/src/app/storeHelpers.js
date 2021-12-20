import { createAsyncThunk } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import { createInterval } from "../features/space/utils";

export function isCrud(action, create, fetch, update, destroy, fetchOne) {
  return [create, fetch, update, destroy, fetchOne]
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
    if (!completed_status) return;

    const daySpace = createInterval(0, 1, DateTime.fromSQL(date));
    return {
      ...daySpace,
      habitId: habit_id,
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

export function crudReducer(
  state,
  action,
  create,
  fetch,
  update,
  destroy,
  fetchOne = {}
) {
  const { payload, type } = action;
  const model = modelNameFromActionString(type);
  const parsed =
    payload?.data && typeof payload.data == "string"
      ? JSON.parse(payload.data)
      : payload.data;
  let mapped;

  switch (type) {
    // CREATE AND UPDATE SHARE A RESPONSE TYPE
    case create.fulfilled().type:
    case update.fulfilled().type:
      state = {
        ...state,
        current: { ...state.current, meta: parsed },
      };
      return state;
    // FETCH ONE ALSO
    case fetchOne?.fulfilled().type:
      return model == "habit"
        ? {
            ...state,
            current: mapCallbacks["habits"](parsed),
            myRecords: [...state.myRecords].concat(
              mapCallbacks["habits"](parsed)
            ),
          }
        : {
            ...state,
            current: { meta: parsed },
          };

    case fetch.fulfilled().type:
      // parsed is e.g. { "habits": [ { "id": 1, "name": "another test"... }, ... ]
      // But could also be a blank array for a 404
      mapped = Object.values(parsed)[0]
        .map(mapCallbacks[model])
        .filter((record) => record !== undefined);
      return {
        ...state,
        current: mapped[0] || state.current, //.slice(-1)
        myRecords: mapped, //(state?.myRecords || []).concat(mapped)
      };

    // DESTROY

    case destroy.fulfilled().type:
      const newMyRecords = [...state.myRecords].filter(
        (r) => r?.meta?.id !== +payload.config.url.split`/`.reverse()[0]
      );
      return {
        myRecords: newMyRecords,
        current: {
          ...state.current,
          meta: { id: newMyRecords[0]?.meta?.id, name: "" },
        },
      };
    default:
      return state;
  }
}

export function createCrudActionCreators(actionTypes, callBacks) {
  const create = createAsyncThunk(actionTypes[0], async (input, thunkAPI) => {
    const response = await callBacks[0](input);
    return [201].includes(response.status)
      ? thunkAPI.fulfillWithValue(response)
      : thunkAPI.rejectWithValue(response);
  });
  const fetchAll = createAsyncThunk(
    actionTypes[1],
    actionTypes[1].match(/habit_dates/)
      ? async function (input, thunkAPI) {
          // Allow 404s for habit_dates
          try {
            const response = await callBacks[1](input);
            console.log(
              "Object.assign:>> ",
              Object.assign(response, {
                data:
                  response?.status === 404
                    ? `{ "habit_dates": []}`
                    : response.data,
              })
            );
            return [200, 404].includes(response?.status)
              ? thunkAPI.fulfillWithValue(
                  Object.assign(response, {
                    data:
                      response?.status === 404
                        ? `{ "habit_dates": []}`
                        : response.data,
                  })
                )
              : thunkAPI.rejectWithValue(response);
          } catch (error) {
            console.log("error :>> ", error);
          }
        }
      : callBacks[1]
  );
  const update = createAsyncThunk(actionTypes[2], callBacks[2]);
  const destroy = createAsyncThunk(actionTypes[3], callBacks[3]);
  //   async (input, thunkAPI) => {
  //   const response = await callBacks[3](input);
  //   return [204].includes(response.status)
  //     ? thunkAPI.fulfillWithValue(response)
  //     : thunkAPI.rejectWithValue(response);
  // });
  const fetch = createAsyncThunk(actionTypes[4], callBacks[4]);
  return [create, fetchAll, update, destroy, fetch];
}
