import { openModal } from '../../../../../../assets/scripts/animations';
import { newRecord } from '../../../../../../assets/scripts/controller';

const CancelButton = {
  oncreate: ({ attrs, dom }) => {
    dom.addEventListener('click', () => {
      openModal(false);
      newRecord(true);
      attrs.modalType && attrs.modalType(false);
      [...document.querySelectorAll('.not-added')].forEach((label) => label.classList.remove('not-added'));
      m.route.set(m.route.get(), null);
    });
  },
  view: ({ attrs }) => (
    <div className="button-container cancel-button">
      <button
        id={attrs.id}
        type="reset"
        name={attrs.name}
        disabled={attrs.disabled}
        className={
          attrs.class
            ? `${attrs.class} mr-2 flex-no-shrinkrounded-3xl text-balance-buttontext-neutral font-heavy flex items-center h-8 px-2 my-1 font-sans tracking-wide uppercase`
            : 'flex-no-shrink mx-3 text-balance-buttontext-neutral font-heavy flex items-center h-8 px-2 my-1 font-sans tracking-wide uppercase'
        }
      >
        {attrs.label}
      </button>
    </div>
  ),
};

export default CancelButton;
