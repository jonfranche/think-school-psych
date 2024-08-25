import React from "react";

import GeneralResourcesItem from "./GeneralResourcesItem";

import "./GeneralResourcesSection.css";

const ITEMS = [
  {
    id: 0,
    title: "Parent Handbook California",
    type: "pdf",
    sectionId: 0,
  },
  {
    id: 1,
    title: "Prader Willi Syndrome PPT",
    type: "pdf",
    sectionId: 1,
  },
  {
    id: 2,
    title: "Asperger Syndrome PPT",
    type: "pdf",
    sectionId: 1,
  },
  {
    id: 3,
    title: "Filipino Culture The Negative And The Positive PPT",
    type: "pptx",
    sectionId: 2,
  },
];

type GeneralResourcesSectionProps = {
  id: number;
  title: string;
}

function GeneralResourcesSection({title, id}: GeneralResourcesSectionProps) {
  const loadedItems = ITEMS.filter((item) => item.sectionId === id);
  return (
    <div className="general-resources-section">
      <h3>{title}</h3>
      <div className="general-resources-section-items">
        {loadedItems.map((loadedItem) => (
            <GeneralResourcesItem
            key={loadedItem.id}
            title={loadedItem.title}
            fileType={loadedItem.type}
            />
        ))}
      </div>
    </div>
  );
};

export default GeneralResourcesSection;
