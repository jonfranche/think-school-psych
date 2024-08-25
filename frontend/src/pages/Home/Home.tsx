import React from "react";

import HomeItem from "./components/HomeItem";
import children from "../../static/images/children.png";
import "./Home.css";

const items = [
  {
    title: "Your Stories",
    description: "A place to share your experiences from work or school",
    link: "/stories",
  },
  {
    title: "General Resources",
    description: "Documents that may be helpful for a school psychologists",
    link: "/resources",
  },
  {
    title: "Mental Health",
    description: "Resources for Mental Health",
    link: "/mentalhealth",
  },
  {
    title: "Behavioral Interventions",
    description: "Resources for Behavioral Interventions",
    link: "/behavioralinterventions",
  },
];

const Home = () => {
  return (
    <div className="home">
      <img className="home-image" src={children} alt="group of children" />
      <p>
        Welcome to the "Think School Psych" webpage. This website is dedicated
        to all the school psychologists who are in need of a diverse set of
        resources, including, but not limited to, mental health, disabilities &
        IDEA, culture and diversity resources, and so on. Welcome and feel free
        to reach out should you have resources you would like to share!
      </p>
      <div className="home-items">
        {items.map((item) => (
          <HomeItem
            key={item.title}
            title={item.title}
            description={item.description}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
