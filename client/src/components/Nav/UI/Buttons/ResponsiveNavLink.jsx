import React from "react";
import { Link } from "react-router-dom";

export const ResponsiveNavLink = ({ urlString, details, enabled }) => (
  <li
    className="resp-nav-link hover:underline flex w-full pr-2 md:pr-12 pl-1 mt-2"
    style={{
      color: !enabled ? "gray" : "",
      flexBasis: "100%",
      textDecoration: !enabled ? "line-through" : "none",
    }}
  >
    {enabled ? <Link to={urlString}>{details.title}</Link> : details.title}
  </li>
);
