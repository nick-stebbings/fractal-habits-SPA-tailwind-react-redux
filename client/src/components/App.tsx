import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";

import TodoList from "../features/todo/components/TodoList";
import { Header } from "./Header";
import { Layout } from "./Layout";

import { fetchHabitsREST } from "../features/habit/actions";
import { fetchDomainsREST } from "../features/domain/actions";
// @ts-ignore
import { fetchHabitTreeREST } from "features/hierarchy/actions";
import reducer from "../features/ui/reducer";
const { toggleConfirm } = reducer.actions;

import { selectCurrentList } from "../features/todo/selectors";
import { selectCurrentHabit } from "../features/habit/selectors";
import { getUIStatus } from "../features/ui/selectors";

import { withModal } from '../components/HOC/withModal'
import {HabitTree} from "../features/hierarchy/components/HabitTree";

interface indexProps {
  isVisComponent?: boolean
  children?: JSX.Element
}

export default function App ({isVisComponent, children}: indexProps) {
  const HeaderWithModal = React.memo(withModal(Header))
  
  const dispatch = useAppDispatch();
  const UIStatus = useAppSelector(getUIStatus);

  const loadDomains = () => dispatch(fetchDomainsREST());

  const isVis = true
  
  const loadTreeData = async () => dispatch(fetchHabitTreeREST({ domainId: 1, dateId: 1 }));
  const loadData = async function () {
    await loadDomains();

    isVis && await loadTreeData()
  };
  
  useEffect(() => {
    loadData()
  }, []);

  return (
      <>
        <HeaderWithModal type={UIStatus} isVis={isVisComponent}/>
        <Layout children={children} isVis={isVisComponent} />
      </>
  );
};
