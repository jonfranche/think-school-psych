import React from "react";

import children from "../../static/images/children.png"
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <img className="home-image" src={children} alt="group of children"/>
      <p>Welcome to the "Think School Psych" webpage. This website is dedicated to all the school
         psychologists who are in need of a diverse set of resources, including, but not limited
          to, mental health, disabilities & IDEA, culture and diversity resources, and so on.
          Welcome and feel free to reach out should you have resources you would like to share!</p>
    </div>
  );
};

export default Home;
