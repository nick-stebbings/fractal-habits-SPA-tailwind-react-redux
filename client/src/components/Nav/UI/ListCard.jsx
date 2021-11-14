import HabitStore from '../../../../../store/habit-store.js';

import GeneralButton from './Buttons/GeneralButton.jsx';
import { changedHabit } from '../../../../../assets/scripts/controller';

const ListCard = {
  oncreate: () => {
    const chosenOne = document.querySelector(
      `button[data-id='${HabitStore.current().id}']`,
    );
    if (chosenOne) chosenOne.classList.add('selected');
  },
  view: ({ attrs: { value } }) => (
    <div className="flex items-center justify-between mb-4">
      {document.querySelector('#habit-list').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          e.stopPropagation();

          if (!e.target.classList.contains('selected')) {
            const lastSelected = document.querySelector('.selected');
            lastSelected && lastSelected.classList.toggle('selected');
            e.target.classList.add('selected');
          }
          HabitStore.current(
            HabitStore.filterById(+e.target.getAttribute('data-id'))[0],
          );
          changedHabit(true);
          m.redraw();
        }
      })}
      <div className="habit-list-details">
        <h2 className="habit-list-details-name">{value.name}</h2>
        <p className="text-grey-darkest w-full">{value.description}</p>
      </div>
      <GeneralButton
        id={`habit-list-select-habit-${value.id}`}
        color="hover:bg-balance-buttonbg-digbluelighter bg-balance-buttonbg-digblue"
        dataAttr={value.id}
        label="Choose"
        disabled={m.route.param('demo') ? 'true' : 'false'}
        class={m.route.param('demo') ? 'inactive' : 'active'}
      />
    </div>
  ),
};

export default ListCard;
