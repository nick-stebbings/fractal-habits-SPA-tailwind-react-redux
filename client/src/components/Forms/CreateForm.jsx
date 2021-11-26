import React from "react";

import { FormHeader } from "./FormHeader.jsx";
import { FormBody } from "./FormBody.jsx";
import { InputGroup } from "./FormInputGroup.jsx";
import { SubmitButton } from "../Nav/UI/Buttons/SubmitButton.jsx";
import { CancelButton } from "../Nav/UI/Buttons/CancelButton.jsx";
// @ts-ignore
import { selectCurrentDomain } from "features/domain/selectors";
import { useAppDispatch, useAppSelector } from "app/hooks";
useAppDispatch;
const randId = String(Math.ceil(Math.random() * 100));

// const processFormData = function (dom, attrs) {
//   document.querySelector("form").addEventListener("submit", (e) => {
//     e.preventDefault();
//   });
//   dom
//     .querySelector("form button[type=submit]")
//     .addEventListener("click", () => {
//       const form = document.querySelector(`form#create-${attrs.resourceName}`);
//       const inputs = [...form.querySelectorAll("input")];
//       if (inputs.some((i) => !i.validity.valid)) {
//         inputs.forEach((i) => {
//           if (!i.validity.valid) {
//             const label = i.previousElementSibling;
//             label.classList.add("not-added");
//           }
//         });
//         return;
//       }
//       const data = {};
//       const FD = new FormData(form);
//       FD.forEach((value, key) => {
//         data[key.replace(/-/g, "_")] = value;
//       }); // Assign values while swapping for snake_case

//       data.domain_id = attrs.domain().id;
//       if (
//         attrs.resourceName === "new-habit-child" &&
//         HabitStore.current()?.name !== "Select a Life-Domain to start tracking"
//       ) {
//         // Assign a -1 id for parent if it is a d3vis-prepend modalType (root node)
//         // Then pass the domain_id as a string to signal to the API to reorder nodes
//         data.parent_node_id =
//           attrs.modalType() === "d3vis-prepend"
//             ? `D${data.domain_id}`
//             : HabitStore.current()?.id;
//       } else {
//         // Assume it is the front page modal and thus a root node
//         data.parent_node_id = null;
//       }

//       const dateAddition = DateStore.submit({ h_date: data.initiation_date });
//       const habitAddition = HabitStore.submit(data);
//       Promise.all([dateAddition, habitAddition])
//         .then(() => {
//           fetching(true);
//           newRecord(true);
//         })
//         .then(() => {
//           m.route.set(m.route.get(), null);
//           populateCalendar().then(m.redraw);
//         })
//         .catch(() => {
//           openModal(false);
//         });
//       // Close the modal
//       attrs.modalType(false);
//     });
// };

export const CreateForm = ({
  modalType,
  resourceName,
  resourceDescription,
  addHeader,
}) => {
  const isDemo = false;
  const dispatch = useAppDispatch();
  const currentDomain = useAppSelector(selectCurrentDomain);
  // document.querySelector(
  //   'input[name^=initiation-date]',
  // ).value = new Date().toDateInputValue();
  return isDemo ? (
    <div className="my-2 mx-2">No Habit creation in Demo mode!</div>
  ) : (
    <form id={`create-habit`}>
      {addHeader && (
        <FormHeader
          iconPath="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          title={`Create a ${resourceName}`}
          domain={currentDomain}
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
            className={"form-input"}
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
            className={"form-input"}
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
            className="form-input w-3/4 sm:w-2/3 md:w-1/2"
            // max={} String(DateStore.currentDate())}
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
        />
        <SubmitButton
          id={`submit-form-${String(Math.ceil(Math.random() * 100))}`}
          name="submit"
          label="Start Tracking"
        />
      </div>
    </form>
  );
};

export default CreateForm;
