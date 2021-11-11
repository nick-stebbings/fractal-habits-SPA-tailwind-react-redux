import BASE_URL, { HabitFractActionTypes } from "services/restApis";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { Habit } from "./types";
import { habitSlice } from "./reducer";
const { createHabit, deleteHabit, updateHabit } = habitSlice.actions;

const MODEL = "habits";

const fetchHabitREST = (habitId: number): any =>
  createAsyncThunk(HabitFractActionTypes["1"], async (thunkAPI) => {
    const res = await fetch(`${BASE_URL}/${MODEL}/${habitId}`).then((data) => {
      console.log(data);
      return data.json();
    });
    return res;
  });

export {
  createHabit,
  deleteHabit,
  updateHabit,
  // createHabitREST,
  fetchHabitREST,
  // updateHabitREST
};
