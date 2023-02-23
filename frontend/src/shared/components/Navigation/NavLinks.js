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
                <NavLink to="/resources">General Resources</NavLink>
            </li>
            <li>
                <NavLink to="/jobsandinternships">Jobs/Internships</NavLink>
            </li>
            <li>
                <NavLink to="/mentalhealth">Mental Health</NavLink>
            </li>
            <li>
                <NavLink to="/behavioralinterventions">Behavioral Interventions</NavLink>
            </li>
            <li>
                <NavLink to="/stories">Your Stories</NavLink>
            </li>
            <li>
                <NavLink to="/about">About/Contact</NavLink>
            </li>
            <li>
                <NavLink to="/FAQs">FAQs</NavLink>
            </li>
        </ul>
    )
}

export default NavLinks;