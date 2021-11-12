import { TimeFrame } from "app/types";

export interface HabitDate {
  habitId: number;
  timeframe: TimeFrame;
}

export interface NewHabitDatePayload {
  habitDateId: string;
  habitDate: HabitDate;
}

export interface DeleteHabitDatePayload {
  habitDateId: string;
}

export interface UpdateHabitDatePayload {
  habitDateId: string;
  habitDatePatch: Partial<HabitDate>;
}
