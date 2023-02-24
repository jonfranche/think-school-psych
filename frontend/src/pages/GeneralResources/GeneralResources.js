import React from "react";

import GeneralResourcesSection from "./GeneralResourcesSection";

import "./GeneralResources.css";

const SECTIONS = [
  {
    title: "Disability Rights",
    id: 0,
  },
  {
    title: "Disabilities Information",
    id: 1,
  },
  {
    title: "Diversity & Inclusion Resources",
    id: 2,
  },
];

const GeneralResources = () => {
  return (
    <div className="general-resources">
      <h2>General Resources</h2>
      <p>
        Below are a list of resources in PDF format (some of which were
        originally PowerPoint). Resources are categorized by topics of concern
      </p>
      {SECTIONS.map((section) => (
        <GeneralResourcesSection
          key={section.id}
          title={section.title}
          id={section.id}
        />
      ))}
    </div>
  );
};

export default GeneralResources;
