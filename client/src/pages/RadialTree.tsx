import React from "react";
import App from "../components/App";
import RadialTree from "features/hierarchy/components/RadialTree";
import { withModal } from "components/HOC/withModal";

export default function () {
  const VisWithModal = withModal(RadialTree)
  return <App isVisComponent={true}><VisWithModal /></App>
}
