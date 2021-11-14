import React from "react";
import { Link } from "react-router-dom";

const ResponsiveNavLink = ({ url, details, enabled }) => (
  <li
    className="resp-nav-link hover:underline flex w-full px-4 mt-4"
    // style={`${!enabled ? 'color: gray; ' : ''}flex-basis: 100%`}
  >
    {enabled ? <Link to={url}>details.title</Link> : details.title}
  </li>
);

export default ResponsiveNavLink;
