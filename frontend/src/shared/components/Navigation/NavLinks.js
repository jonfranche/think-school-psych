import React from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";

const NavLinks = () => {
    return (
        <ul className="nav-links">
            <li>
                <NavLink to="/" exact>Home</NavLink>
            </li>
            <li>
                <NavLink>General Resources</NavLink>
            </li>
            <li>
                <NavLink>Jobs/Internships</NavLink>
            </li>
            <li>
                <NavLink>Mental Health</NavLink>
            </li>
            <li>
                <NavLink>Behavioral Interventions</NavLink>
            </li>
            <li>
                <NavLink>Your Stories</NavLink>
            </li>
            <li>
                <NavLink>About/Contact</NavLink>
            </li>
            <li>
                <NavLink>FAQs</NavLink>
            </li>
        </ul>
    )
}

export default NavLinks;