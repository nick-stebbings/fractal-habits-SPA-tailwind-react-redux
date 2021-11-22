import { TimeFrame } from "app/types";

export interface HabitMeta {
  id: number;
  name: string;
  description: string;
  habitNodeId: number;
  domainId: number;
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
