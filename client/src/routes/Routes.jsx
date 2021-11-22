import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as Switch,
} from "react-router-dom";

import Home from "../pages/Home";
import HabitTree from "../pages/HabitTree";
import RadialTree from "../pages/RadialTree";

export const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/vis/habit-tree" element={<HabitTree />} />
        <Route path="/habits/new" element={<RadialTree />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>404</p>
            </main>
          }
        />
      </Switch>
    </Router>
  );
};
