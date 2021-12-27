import React from "react";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { debounce } from "app/helpers";

import { FormHeader } from "./FormHeader.jsx";
import { FormBody } from "./FormBody.jsx";
import { InputGroup } from "./FormInputGroup.jsx";
import { SubmitButton } from "../Nav/UI/Buttons/SubmitButton.jsx";
import { CancelButton } from "../Nav/UI/Buttons/CancelButton.jsx";

// @ts-ignore
import { selectCurrentDomain } from "features/domain/selectors";
// @ts-ignore
import { selectCurrentHabit } from "features/habit/selectors";
import { createHabitREST } from "features/habit/actions";
useAppDispatch;

const randId = String(Math.ceil(Math.random() * 100));

export const CreateForm = ({
  modalType,
  title,
  message,
  resourceName,
  addHeader,
  toggleClose,
}) => {
  const dispatch = useAppDispatch();
  const createHabit = (data) => {
    dispatch(createHabitREST(data));
  };

  const isDemo = false;
  const currentDomain = useAppSelector(selectCurrentDomain);
  const currentHabit = useAppSelector(selectCurrentHabit);

  const handleSubmit = debounce((e) => {
    debugger;
    const form = document.querySelector(`form#create-${resourceName}`);

    // Validate fields
    const inputs = [...form.querySelectorAll("input")];
    if (inputs.some((i) => !i.validity.valid)) {
      inputs.forEach((i) => {
        if (!i.validity.valid) {
          const label = i.previousElementSibling;
          label.classList.add("not-added");
        }
      });
      return;
    }

    // Formulate into payload
    const data = {};
    const FD = new FormData(form);
    FD.forEach((value, key) => {
      data[key.replace(/-/g, "_")] = value;
    }); // Assign values while swapping for snake_case
    data.domain_id = currentDomain.meta.id;
    if (modalType === "Root") {
      data.parent_node_id = null;
    } else {
      console.log("modalType :>> ", modalType);
      // Assign a -1 id for parent if it is a d3vis-prepend modalType (root node)
      // Then pass the domain_id as a string to signal to the API to reorder nodes
      data.parent_node_id =
        modalType === "Prepend" ? `D${data.domain_id}` : currentHabit.meta.id;
    }

    createHabit(data);
    // Close the modal
    toggleClose();
  }, 3000);

  return isDemo ? (
    <div className="my-2 mx-2">No Habit creation in Demo mode!</div>
  ) : (
    <div className="m-0 w-5/6">
      <div className="self-start block pl-2 text-sm font-semibold text-gray-700">
        <h2 className="leading-relaxed">{title}</h2>
        <p className="text-sm font-normal text-center leading-relaxed text-gray-500">
          {message}
        </p>
      </div>
      <form
        id={`create-habit`}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        {addHeader && (
          <FormHeader
            iconPath="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            title={`Create a ${resourceName}`}
            domain={currentDomain.meta.name}
          />
        )}
        <FormBody>
          <InputGroup
            name={`habit-title-${randId}`}
            label={"Habit Name"}
            classString={"reqd"}
          >
            <input
              type="text"
              name="name"
              id={`habit-title-${randId}`}
              className={"form-input h-8 md:h-12 px-1 md:px-2"}
              required={true}
              maxLength={50}
              placeholder={"e.g. Hydrate in the A.M."}
            />
          </InputGroup>
          <InputGroup
            name={`habit-description-${randId}`}
            label={"Habit Description"}
          >
            <input
              type={"text"}
              name={"description"}
              id={`habit-description-${randId}`}
              className={"form-input h-8 md:h-12 px-1 md:px-2"}
              maxLength={"80"}
              placeholder={"e.g. Drinking water each day after waking"}
            />
          </InputGroup>
          <InputGroup
            name={`initiation-date-${randId}`}
            label={"Initiation Date"}
            classString={"reqd"}
          >
            <input
              type={"date"}
              id={`initiation-date-${randId}`}
              required={true}
              name="initiation-date"
              className="form-input h-8 md:h-12 px-1 md:px-2 w-3/4 sm:w-2/3 md:w-1/2"
              max={new Date().toDateInputValue()}
              defaultValue={new Date().toDateInputValue()}
              min="2021-06-01"
            />
          </InputGroup>
        </FormBody>
        <div className="button-group py-3 bg-white border-t border-gray-200">
          <CancelButton
            id={`close-modal-${randId}`}
            name="close"
            label="Forget It"
            modalType={modalType}
            handleClose={toggleClose}
          />
          <SubmitButton
            id={`submit-form-${String(Math.ceil(Math.random() * 100))}`}
            name="submit"
            label="Start Tracking"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
