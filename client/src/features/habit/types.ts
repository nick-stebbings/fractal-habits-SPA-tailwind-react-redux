import { TimeFrame } from "app/types";

export interface HabitMeta {
  name: string;
  id: number;
}

export interface Habit {
  timeframe: TimeFrame;
  meta: HabitMeta;
}

export interface NewHabitPayload {
  id: number;
  habit: Habit;
}

export interface DeleteHabitPayload {
  id: number;
}

export interface UpdateHabitPayload {
  id: number;
  habitPatch: Partial<Habit>;
}
