import React, {useEffect, useState} from 'react'
import { Header } from "./Header";
import { Layout } from "./Layout";

import { store } from 'app/store';

import { HABIT_DATE_BACKGROUND_PERSISTENCE_INTERVAL } from "app/constants";
import { useAppDispatch, useAppSelector } from "app/hooks";

import HabitDateSlice from "features/habitDate/reducer";
const { clearUnpersistedHabitDateCache,clearPersistedHabitDateCache } = HabitDateSlice.actions;
import { createHabitDateREST,destroyHabitDateREST } from "features/habitDate/actions";
import { selectUnStoredHabitDates, selectStoredHabitDates } from "features/habitDate/selectors";

import { visActions } from "features/hierarchy/reducer";
const { clearFutureCache } = visActions

import { selectCurrentSpace,selectCurrentDateId } from "features/space/slice";
import { HabitDate } from "features/habitDate/types";
import { useModal } from '../hooks/useModal';
import { debounce } from 'app/helpers';

interface indexProps {
  isVisComponent?: boolean
  children?: JSX.Element
}

export default function App({ isVisComponent, children }: indexProps) {
  const dispatch = useAppDispatch();
  const currentSpaceTimeframe = selectCurrentSpace(store.getState())?.timeframe
  const currentDateId = selectCurrentDateId(store.getState())

  const [changesMade, setChangesMade] = useState(null)

  const persistTodaysUnstoredHabitDates = (periodicSave: boolean = false) => {
    console.log('changesMade :>> ', changesMade);
    let s = store.getState()
    const alreadyPersisted = selectStoredHabitDates(s)
    
    const nodesToDestroy = selectUnStoredHabitDates(s).filter((hd: any) => {
      const id = hd.habit_id
      return !hd.completed_status
        && -1 !== alreadyPersisted?.findIndex((hd: any) => {
          return (
            hd?.habitId == id && hd?.timeframe.fromDate == currentSpaceTimeframe.fromDate
          )
        })
    })
    const nodesToPersist = selectUnStoredHabitDates(s).filter((hd: any) => hd.completed_status)
    
    const persisting = nodesToPersist.length > 0 || nodesToDestroy.length > 0

    
    if (nodesToPersist.length > 0) {
      dispatch(createHabitDateREST({ date_id: currentDateId, habit_dates: nodesToPersist }))
    } else if (nodesToDestroy.length > 0) {
      debugger;
      // it was in currentRecords as completed, but now is incomplete and needs destroying in the DB
      nodesToDestroy.forEach((n: any) => {
        const { habit_id, date_id } = n
        dispatch(destroyHabitDateREST({ id1: habit_id, id2: date_id }))
      });
    }
    
    if (persisting) {
      dispatch(clearFutureCache({
        dateId: currentDateId
      }))
      window.FlashMessage.info('Habit progress saved', {
        interactive: true,
        timeout: 3000,
      })
      setChangesMade(false)
    }

    !periodicSave && dispatch(clearUnpersistedHabitDateCache({ currentSpaceTimeframe }))
  }// debounce(}, 5000)


  // Send a habit-date post request periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectUnStoredHabitDates(store.getState()).length > 0){// && (changesMade === true)){
        persistTodaysUnstoredHabitDates(currentDateId, true)
      }
    }, HABIT_DATE_BACKGROUND_PERSISTENCE_INTERVAL * 1000)
   return () => clearInterval(interval) 
  }, [])

  return (
    <>
      {useModal()}
      <Header isVis={isVisComponent} persistTodaysUnstoredHabitDates={persistTodaysUnstoredHabitDates} />
      <Layout children={children} isVis={isVisComponent} changesMade={setChangesMade} />
      </>
  );
};