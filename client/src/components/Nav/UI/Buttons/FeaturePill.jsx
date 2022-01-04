// import { handleErrorType } from "../../../../../../store/client";
// import {
//   fetching,
//   newRecord,
// } from "../../../../../../assets/scripts/controller";
import React from "react";

import { useAppSelector } from "app/hooks";
import { selectCurrentDomain } from "features/domain/selectors";

export const FeaturePill = ({ title, clipPathUrl }) => {
  const currentDomain = useAppSelector(selectCurrentDomain);
  const handleClick = () => {
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
  };

  return (
    <div
      className="bg-balance-basic-gray nav-pill h-36 text-md flex items-center justify-center py-1 mx-4 my-1 rounded-full"
      handleClick={handleClick}
      style={{ cursor: "pointer", clipPath: `url(${clipPathUrl})` }}
    >
      <span>{!isDemo && title}</span>
    </div>
  );
};
