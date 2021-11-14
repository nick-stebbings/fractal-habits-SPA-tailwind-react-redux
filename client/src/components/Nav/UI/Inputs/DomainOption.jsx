import DomainStore from '../../../../../../store/domain-store';

const DomainOption = {
  view: ({ attrs }) => (
    <option className="text-xl font-bold" value={attrs.value}>
      {attrs.value}
    </option>
  ),
};

export default DomainOption;
