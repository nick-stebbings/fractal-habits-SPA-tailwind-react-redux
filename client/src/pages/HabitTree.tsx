import React from "react";
import App from "../components/App";
import HabitTree from "features/hierarchy/components/HabitTree";
// import { withModal } from "components/HOC/withModal/";

export default function() {
  // const VisWithModal = withModal(HabitTree)
  return <App isVisComponent={true} ><HabitTree /></App>
}
