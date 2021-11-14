// src/view/components/Layout/Nav/UI/Buttons/FeaturePill.jsx
import DomainStore from "../../../../../../store/domain-store";
import { handleErrorType } from "../../../../../../store/client";
import {
  fetching,
  newRecord,
} from "../../../../../../assets/scripts/controller";

const FeaturePill = {
  oncreate: (vnode) => {
    vnode.dom.addEventListener("click", () => {
      if (m.route.param("demo")) return;
      if (DomainStore.list()?.length > 1 || DomainStore.current()?.name!=="No Domains Registered") return;
      DomainStore.submit({
        name: vnode.attrs.name,
        description: vnode.attrs.name,
        rank: vnode.attrs.rank + 1,
        hashtag: `#${vnode.attrs.name.toLowerCase().split(" ").join("-")}`,
      })
        .then(() => {
          vnode.attrs.modalType(true);
          fetching(true);
          newRecord(true);
          m.redraw();
        })
        .catch(handleErrorType);
    });
  },
  view: ({ attrs }) => (
    <div
      className="bg-balance-basic-gray nav-pill h-36 text-md flex items-center justify-center py-1 mx-4 my-1 rounded-full"
      style={`cursor: pointer; clip-path: url(${attrs.clipPathUrl})`}
    >
      <span>{!m.route.param("demo") && attrs.title}</span>
    </div>
  ),
};

export default FeaturePill;
