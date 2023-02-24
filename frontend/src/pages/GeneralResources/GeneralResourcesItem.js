import React from "react";

import Button from "../../shared/components/UIElements/Button";

import "./GeneralResourcesItem.css";

import Asperger from "../../static/downloadables/Asperger Syndrome PPT.pdf";
import Parent from "../../static/downloadables/Parent Handbook California.pdf";
import Prader from "../../static/downloadables/Prader Willi Syndrome PPT.pdf";
import Filipino from "../../static/downloadables/Filipino Culture The Negative And The Positive PPT.pptx";

const setFile = (title) => {
  if (title === "Asperger Syndrome PPT") return Asperger;
  if (title === "Parent Handbook California") return Parent;
  if (title === "Prader Willi Syndrome PPT") return Prader;
  if (title === "Filipino Culture The Negative And The Positive PPT")
    return Filipino;
};

const GeneralResourcesItem = (props) => {
  const file = setFile(props.title);
  return (
    <div className="general-resources-item">
      <span>{props.title}</span>
      <Button download={true} href={file}>Download</Button>
    </div>
  );
};

export default GeneralResourcesItem;
