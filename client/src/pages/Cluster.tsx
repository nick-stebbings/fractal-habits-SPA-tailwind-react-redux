import React from "react";
import App from "../components/App";
import Cluster from "features/hierarchy/components/Cluster";
import { withModal } from '../components/HOC/withModal'

export default function() {
  const VisWithModal = withModal(Cluster)
  return <App isVisComponent={true} ><VisWithModal /></App>
}
