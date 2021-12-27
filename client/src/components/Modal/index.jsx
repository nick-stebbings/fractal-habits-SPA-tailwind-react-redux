import React from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { store } from "app/store";

import { selectCurrentDomain } from "features/domain/selectors";
import { selectCurrentHabit } from "features/habit/selectors";
import { selectCurrentNode } from "features/node/selectors";

import { CreateForm } from "../Forms/CreateForm";
import { DialogBox } from "./DialogBox";
import { InfoBox } from "./InfoBox";

import { destroyHabitREST } from "features/habit/actions";
import { destroyNodeREST } from "features/node/actions";
import HabitSlice from "features/habit/reducer";
const { deleteCurrentHabit } = HabitSlice.actions;
import NodeSlice from "features/node/reducer";
const { deleteCurrentNode } = NodeSlice.actions;

const TITLES = {
  Confirm: "Message: You are about to...",
  Prepend: "Create a new parent habit under the life domain",
  Append: "Create a new child habit under the life domain",
  Error: "There has been an error!",
  Delete: "You are about to...",
};

export const Modal = React.memo(({ type, toggle, resetConfirm }) => {
  const dispatch = useAppDispatch();
  const currentDomain = useAppSelector(selectCurrentDomain);
  const currentHabit = useAppSelector(selectCurrentHabit);
  _p("modal type :>> " + type, type, "warning");

  const formTitle = (type) => {
    const currentHabitName = currentHabit?.meta?.name;
    return type == "Prepend"
      ? `a parent of the "${currentHabitName}" habit`
      : `a child of the "${currentHabitName}" habit`;
  };

  const closeModal = () => {
    resetConfirm();
    toggle({ open: false });
  };

  let confirmationDialog = ["Confirm", "Delete"].includes(type);
  return (
    <div
      id="modal_overlay"
      className="bg-opacity-30 md:items-center fixed z-50 flex items-start justify-center w-full h-full bg-black"
    >
      {type == "Spinner" ? (
        <div className="loader" />
      ) : (
        <div
          id="modal"
          className={
            type == "Error" || confirmationDialog
              ? "h-72 inset-y-1/3 inset-x-10 sm:inset-1/4 rounded-2xl shadow-tershades-gray absolute flex transition-transform duration-300 transform scale-150 -translate-y-full bg-white opacity-0"
              : "h-full sm:h-3/4 md:inset-2 inset-1 sm:inset-12 rounded-2xl shadow-tershades-gray absolute bottom-auto flex transition-transform duration-300 transform scale-150 -translate-y-full bg-white opacity-0 text-sm"
          }
        >
          <div className="rounded-2xl flex flex-col items-center w-full">
            <div className="px-1 md:px-4 py-3 border-b border-gray-200">
              <h2 className="mt-2 text-sm md:text-xl font-semibold text-center text-gray-600">
                {TITLES[type]}
              </h2>
              <h3 className="mt-2 text-sm md:text-2xl font-bold text-center">
                {(type == "Prepend" || type == "Append") && (
                  <span>{`${currentDomain.meta.name}`}</span>
                )}
              </h3>
            </div>
            {["Prepend", "Append"].includes(type) && (
              <CreateForm
                title=""
                message={formTitle(type)}
                modalType={type}
                resourceName="habit"
                addHeader={false}
                toggleClose={closeModal}
              />
            )}
            {type == "Confirm" && (
              <DialogBox
                type="confirm"
                title="Confirm choice"
                message="Are you sure?"
                type={type}
                iconColor="text-balance-terhades-light"
                iconPath="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                handleClose={closeModal}
              />
            )}
            {type == "Delete" && (
              <DialogBox
                type="delete"
                title="Delete Habit and All Descendants"
                message="Are you sure?"
                type={type}
                iconColor="text-balance-buttonbg-closelighter"
                iconPath="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                handleClose={closeModal}
                handleConfirm={(e) => {
                  e.preventDefault();
                  const currentId = selectCurrentHabit(store.getState()).meta
                    .id;
                  const currentNodeId = selectCurrentNode(store.getState()).id;
                  store.dispatch(destroyHabitREST({ id: currentId }));
                  store.dispatch(deleteCurrentHabit());

                  store.dispatch(destroyNodeREST({ id: currentNodeId }));

                  closeModal();
                }}
              />
            )}
            {type == "Error" && (
              <InfoBox
                type="error"
                title="There was a problem fetching data"
                message="Apologies - Please try again later."
                type={type}
                iconColor="text-balance-buttonbg-closelighter"
                iconPath="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});
