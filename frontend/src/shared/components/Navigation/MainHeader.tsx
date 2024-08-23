import React from "react";

import "./MainNavigation.css";

type MainHeaderProps = {
    children: React.ReactNode;
}

function MainHeader({children}: MainHeaderProps) {
  return <header className="main-header">{children}</header>;
}

export default MainHeader;
