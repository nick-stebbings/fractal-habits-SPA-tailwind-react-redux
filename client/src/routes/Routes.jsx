import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "../pages/Home";
import { LastLocationProvider } from "react-router-last-location";
import HabitTree from "../pages/HabitTree";
import RadialTree from "../pages/RadialTree";
import Cluster from "../pages/Cluster";

export const Routes = () => {
  return (
    <Router>
      <LastLocationProvider>
        <Switch>
          <Route path="/vis/habit-tree">
            <HabitTree />
          </Route>
          <Route path="/vis/cluster">
            <Cluster />
          </Route>
          <Route path="/vis/tree-radial">
            <RadialTree />
          </Route>
          <Route path="/">
            <HabitTree />
          </Route>
          <Route path="*">
            <main style={{ padding: "1rem" }}>
              <p>404</p>
            </main>
          </Route>
        </Switch>
      </LastLocationProvider>
    </Router>
  );
};
