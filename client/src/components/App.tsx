import React from 'react'
import { Header } from "./Header";
import { Layout } from "./Layout";

import { HABIT_DATE_BACKGROUND_PERSISTENCE_INTERVAL } from "app/constants";
import { useAppDispatch, useAppSelector } from "app/hooks";

import HabitDateSlice from "features/habitDate/reducer";
const { clearUnpersistedHabitDateCache } = HabitDateSlice.actions;
import { createHabitDateREST } from "features/habitDate/actions";
import { selectUnStoredHabitDates } from "features/habitDate/selectors";

import { visActions } from "features/hierarchy/reducer";
const { updateCachedHierarchyForDate, clearFutureCache } = visActions

import { selectCurrentDateId } from 'features/space/slice';
import { HabitDate } from "features/habitDate/types";
import { useModal } from '../hooks/useModal';

interface indexProps {
  isVisComponent?: boolean
  children?: JSX.Element
}

let setIntervalTimer: number;

export default function App({ isVisComponent, children }: indexProps) {
  const dispatch = useAppDispatch();
  const currentUnpersistedHabitDates = useAppSelector(selectUnStoredHabitDates);
  
  const persistTodaysUnstoredHabitDates = (currentDateId: number) => {
    const nodesToPersist = currentUnpersistedHabitDates.filter((hd: HabitDate) => hd.completed_status )
  
    if (nodesToPersist.length > 0) {
      dispatch(createHabitDateREST({ date_id: currentDateId, habit_dates: nodesToPersist }))
      dispatch(updateCachedHierarchyForDate({
        dateId: currentDateId
      }))
      dispatch(clearFutureCache({
        dateId: currentDateId + 1
      }))
    }
    dispatch(clearUnpersistedHabitDateCache())
  }


  const currentDateId = useAppSelector(selectCurrentDateId);
  // Send a habit-date post request periodically
  if (!setIntervalTimer) {
    setIntervalTimer = setInterval(() => {
      if (currentUnpersistedHabitDates.filter((hd: HabitDate) => hd.completed_status).length > 3) {
        persistTodaysUnstoredHabitDates(currentDateId)
        debugger;
        setIntervalTimer = null;
      }
    }, 30000)

  return (
    <>
      {useModal()}
      <Header isVis={isVisComponent} persistTodaysUnstoredHabitDates={persistTodaysUnstoredHabitDates} />
      <Layout children={children} isVis={isVisComponent} />
      </>
  );
};