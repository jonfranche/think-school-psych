import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
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
  // uncomment once implemented
  // { 
  //   title: "Jobs/Internships",
  //   route: "/jobsandinternships",
  // },
  // {
  //   title: "Mental Health",
  //   route: "/mentalhealth",
  // },
  // {
  //   title: "Behavioral Intervations",
  //   route: "/behavioralinterventions",
  // },
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
];

const NavLinks = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  let activeClassName = "nav-links-item__active";
  let inActiveClassName = "nav-links-item";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

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
      {currentUser ? (
        <li>
          <Button onClick={handleLogout}>Logout</Button>
        </li>
      ) : (
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
