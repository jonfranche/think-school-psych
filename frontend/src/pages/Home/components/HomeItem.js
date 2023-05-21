import React from "react";
import { Link } from "react-router-dom";

import "./HomeItem.css";

const HomeItem = (props) => {
  return (
    <div className="home-item">
      <Link to={props.link} className="home-item__link">
        {props.title}
      </Link>
      <p>{props.description}</p>
    </div>
  );
};

export default HomeItem;
