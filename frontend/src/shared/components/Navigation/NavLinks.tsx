import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

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

type NavLinksProps = {
  closeModal?: () => void;
  isModalOpen?: boolean;
}

function NavLinks({closeModal}: NavLinksProps) {
  const [scroll, setScroll] = useState(false);
  const auth = getAuth();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  let activeClassName = "nav-links-item__active";
  let inActiveClassName = "nav-links-item";

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 60);
    });
  });

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ul className={`nav-links ${scroll ? "nav-sticky" : ""}`}>
      {links.map((link) => (
        <li key={link.title} onClick={closeModal}>
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
        <li onClick={closeModal}>
          <Button onClick={handleLogout}>Logout</Button>
        </li>
      ) : (
        <li onClick={closeModal}>
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
