import React, {useEffect} from 'react'
import { Header } from "./Header";
import { Layout } from "./Layout";

import { store } from 'app/store';

import { HABIT_DATE_BACKGROUND_PERSISTENCE_INTERVAL } from "app/constants";
import { useAppDispatch, useAppSelector } from "app/hooks";

import HabitDateSlice from "features/habitDate/reducer";
const { clearUnpersistedHabitDateCache,clearPersistedHabitDateCache } = HabitDateSlice.actions;
import { createHabitDateREST } from "features/habitDate/actions";
import { selectUnStoredHabitDates, selectStoredHabitDates } from "features/habitDate/selectors";

import { visActions } from "features/hierarchy/reducer";
const { updateCachedHierarchyForDate, clearFutureCache,updateCurrentHierarchy } = visActions

import HabitSlice from 'features/habit/reducer';
import { selectCurrentSpace } from "features/space/slice";
const { updateCurrentHabit } = HabitSlice.actions;
import { selectCurrentDateId } from 'features/space/slice';
import { HabitDate } from "features/habitDate/types";
import { useModal } from '../hooks/useModal';

interface indexProps {
  isVisComponent?: boolean
  children?: JSX.Element
}

export default function App({ isVisComponent, children }: indexProps) {
  const dispatch = useAppDispatch();
  const currentSpaceTimeframe = selectCurrentSpace(store.getState())?.timeframe
  
  const todaysHabitDate = (hd: HabitDate) =>
    hd.timeframe.fromDate == currentSpaceTimeframe.fromDate;
  
  const persistTodaysUnstoredHabitDates = (currentDateId: number, periodicSave: boolean) => {
    if (!periodicSave) {
      periodicSave = false
    }
    let s = store.getState()
    const alreadyPersisted = selectStoredHabitDates(s)

    const nodesToDestroy = selectUnStoredHabitDates(s).filter((hd: any) => {
      const id = hd.habit_id
      debugger;
      return !hd.completed_status
        && -1 !== alreadyPersisted?.findIndex((hd: any) => {
          return (
            hd.habitId == id && hd.timeframe.fromDate == currentSpaceTimeframe.fromDate
          )
        })
    })
    const nodesToPersist = selectUnStoredHabitDates(s).filter((hd: any) => hd.completed_status)

    if (nodesToPersist.length > 0) {
      dispatch(createHabitDateREST({ date_id: currentDateId, habit_dates: nodesToPersist }))
      // dispatch(updateCurrentHabit({
      //   timeframe: {
      //     fromDate: 0,
      //     toDate: 0,
      //     length: 0,
      //   },
      //   meta: {
      //     name: "",
      //     id: 1,
      //   },
      // }))
      dispatch(clearFutureCache({
        dateId: currentDateId
      }))
      window.FlashMessage.info('Habit progress saved',{
        interactive: true,
        timeout: 3000,
      })
      
    } else if (nodesToDestroy.length > 0) {
      
    }
    
    if(!periodicSave) dispatch(clearUnpersistedHabitDateCache({currentSpaceTimeframe}))
  }


  const currentDateId = useAppSelector(selectCurrentDateId);

  // Send a habit-date post request periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectUnStoredHabitDates(store.getState()).filter((hd: any) => hd.completed_status).length > 0) {
        persistTodaysUnstoredHabitDates(currentDateId, true)
      }
    }, HABIT_DATE_BACKGROUND_PERSISTENCE_INTERVAL * 1000)
   return () => clearInterval(interval) 
  }, [])

  return (
    <>
      {useModal()}
      <Header isVis={isVisComponent} persistTodaysUnstoredHabitDates={persistTodaysUnstoredHabitDates} />
      <Layout children={children} isVis={isVisComponent} />
      </>
  );
};