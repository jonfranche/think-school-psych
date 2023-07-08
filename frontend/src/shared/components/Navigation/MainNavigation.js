import React from "react";
import { Link } from "react-router-dom";
import { useModal } from "react-hooks-use-modal";
import { IconContext } from "react-icons"
import { VscMenu } from "react-icons/vsc";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = () => {
  const [Modal, open] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: true,
    },
  });

  return (
    <MainHeader>
      <Modal>
        <NavLinks />
      </Modal>
      <button className="menu-button" onClick={open}>
        <IconContext.Provider value={{size: "2em"}}>
          <VscMenu />
        </IconContext.Provider>
      </button>
      <h1 className="main-header__title">
        <Link to="/">Think School Psych</Link>
      </h1>
      <nav>
        <NavLinks />
      </nav>
      <div className="main-header__spacer"></div>
    </MainHeader>
  );
};

export default MainNavigation;
