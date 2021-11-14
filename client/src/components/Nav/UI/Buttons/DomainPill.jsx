import DomainStore from '../../../../../../store/domain-store';
import { handleErrorType } from '../../../../../../store/client';

const DomainPill = {
  oncreate: (vnode) => {
    vnode.dom.addEventListener('click', () => {
      DomainStore.submit({
        name: vnode.attrs.name,
        description: vnode.attrs.name,
        rank: vnode.attrs.rank + 1,
        hashtag: `#${vnode.attrs.name.toLowerCase().split(' ').join('-')}`,
      })
        .then(() => {
          vnode.attrs.modalType(true);
        })
        .then(() => {
          m.redraw();
        })
        .catch(handleErrorType);
    });
  },
  view: ({ attrs }) => (
    <button className="domain-create" type="button">
      <div className="flex items-center justify-between p-4 my-4 bg-gray-700 rounded-full shadow-md">
        {attrs.name}
      </div>
    </button>
  ),
};

export default DomainPill;
