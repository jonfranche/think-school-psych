import React from "react";
import { Link } from "react-router-dom";

import "./HomeItem.css";

type HomeItemProps = {
  link: string;
  title: string;
  description: string;
}

const HomeItem = ({link, title, description}:  HomeItemProps) => {
  return (
    <div className="home-item">
      <Link to={link} className="home-item__link">
        {title}
      </Link>
      <p>{description}</p>
    </div>
  );
};

export default HomeItem;
