import DomainStore from '../../../../../../store/domain-store';

import DomainOption from './DomainOption.jsx';
const DomainSelector = {
  view: () =>
    m(
      "select.form-select.domain-selector",
      {
        class: "w-full lg:pt-2 pl-2 sm:h-10 h-6 py-0 md:p-2 mr-1 xl-mt-4 rounded-2xl",
        selectedIndex: DomainStore.list().indexOf(DomainStore.current()),
        tabindex: 2,
      },
      DomainStore.list().map((domain, idx) =>
        m(
          DomainOption,
          {
            value: domain.name,
            selected: DomainStore.current()?.name === domain.name,
          },
          domain.name
        )
      )
    ),
};

export default DomainSelector;
