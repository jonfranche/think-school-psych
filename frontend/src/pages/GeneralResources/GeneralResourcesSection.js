import React from "react";

import GeneralResourcesItem from "./GeneralResourcesItem";

import "./GeneralResourcesSection.css";

const ITEMS = [
  {
    id: 0,
    title: "Parent Handbook California",
    sectionId: 0,
  },
  {
    id: 1,
    title: "Prader Willi Syndrome PPT",
    sectionId: 1,
  },
  {
    id: 2,
    title: "Asperger Syndrome PPT",
    sectionId: 1,
  },
  {
    id: 3,
    title: "Filipino Culture The Negative And The Positive PPT",
    sectionId: 2,
  },
];

const GeneralResourcesSection = (props) => {
  const loadedItems = ITEMS.filter((item) => item.sectionId === props.id);
  return (
    <div className="general-resources-section">
      <h3>{props.title}</h3>
      <div className="general-resources-section-items">
        {loadedItems.map((loadedItem) => (
            <GeneralResourcesItem
            key={loadedItem.id}
            id={loadedItem.id}
            title={loadedItem.title}
            />
        ))}
      </div>
    </div>
  );
};

export default GeneralResourcesSection;
