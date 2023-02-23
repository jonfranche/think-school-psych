import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = () => {
  let activeClassName = "nav-links-item__active";
  let inActiveClassName = "nav-links-item";
  return (
    <ul className="nav-links">
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/resources"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          General Resources
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/jobsandinternships"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          Jobs/Internships
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/mentalhealth"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          Mental Health
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/behavioralinterventions"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          Behavioral Interventions
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/stories"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          Your Stories
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          About/Contact
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/FAQs"
          className={({ isActive }) =>
            isActive ? activeClassName : inActiveClassName
          }
        >
          FAQs
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
