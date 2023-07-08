import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const links = [
  {
    title: "Home",
    route: "/",
  },
  {
    title: "General Resources",
    route: "/resources",
  },
  {
    title: "Jobs/Internships",
    route: "/jobsandinternships",
  },
  {
    title: "Mental Health",
    route: "/mentalhealth",
  },
  {
    title: "Behavioral Intervations",
    route: "/behavioralinterventions",
  },
  {
    title: "Your Stories",
    route: "/stories",
  },
  {
    title: "About / Contact",
    route: "/about",
  },
  {
    title: "FAQs",
    route: "/FAQs",
  },
  {
    title: "Login / Signup",
    route: "/login",
  },
];

const NavLinks = () => {
  let activeClassName = "nav-links-item__active";
  let inActiveClassName = "nav-links-item";
  return (
    <ul className="nav-links">
      {links.map((link) => (
        <li key={link.title}>
          <NavLink
            to={link.route}
            className={({ isActive }) =>
              isActive ? activeClassName : inActiveClassName
            }
          >
            {link.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
