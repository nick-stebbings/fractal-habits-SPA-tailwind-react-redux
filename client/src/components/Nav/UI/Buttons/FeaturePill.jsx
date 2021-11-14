// import { handleErrorType } from "../../../../../../store/client";
// import {
//   fetching,
//   newRecord,
// } from "../../../../../../assets/scripts/controller";
import React from "react";

export const FeaturePill = ({ title, clipPathUrl }) => {
  // oncreate: (vnode) => {
  //   vnode.dom.addEventListener("click", () => {
  //     if (isDemo) return;
  //     if (
  //       DomainStore.list()?.length > 1 ||
  //       DomainStore.current()?.name !== "No Domains Registered"
  //     )
  //       return;
  //     DomainStore.submit({
  //       name: name,
  //       description: name,
  //       rank: rank + 1,
  //       hashtag: `#${name.toLowerCase().split(" ").join("-")}`,
  //     })
  //       .then(() => {
  //         modalType(true);
  //         fetching(true);
  //         newRecord(true);
  //         m.redraw();
  //       })
  //       .catch(handleErrorType);
  //   });
  // },
  // view: ({ attrs }) => (
  return (
    <div
      className="bg-balance-basic-gray nav-pill h-36 text-md flex items-center justify-center py-1 mx-4 my-1 rounded-full"
      style={{ cursor: "pointer", clipPath: `url(${clipPathUrl})` }}
    >
      <span>{!isDemo && title}</span>
    </div>
  );
};
