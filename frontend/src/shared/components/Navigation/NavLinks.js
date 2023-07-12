import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Button from "../UIElements/Button";
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
  }
];

const NavLinks = () => {
  const auth = useContext(AuthContext);
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
      {auth.isLoggedIn && (
        <li>
          <Button onClick={auth.logout}>Logout</Button>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? activeClassName : inActiveClassName
            }
          >
            Login / Signup
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
