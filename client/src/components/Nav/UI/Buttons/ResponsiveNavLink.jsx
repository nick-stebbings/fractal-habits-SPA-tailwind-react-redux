import React from "react";
import { Link } from "react-router-dom";

export const ResponsiveNavLink = ({ urlString, details, enabled }) => (
  <li
    className="resp-nav-link hover:underline flex w-full px-4 mt-4"
    style={{ color: !enabled ? "gray" : "", flexBasis: "100%" }}
  >
    {enabled ? <Link to={urlString}>{details.title}</Link> : details.title}
  </li>
);
