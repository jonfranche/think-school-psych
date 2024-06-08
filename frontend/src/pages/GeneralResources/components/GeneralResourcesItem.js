import React from "react";

import { useHttpClient } from "../../../shared/hooks/http-hook";

import Button from "../../../shared/components/UIElements/Button";

import "./GeneralResourcesItem.css";

const GeneralResourcesItem = (props) => {
  const { sendRequest } = useHttpClient();

  function removeWhiteSpace(str) {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === " ") continue;
      newStr = newStr + str[i];
    }
    return newStr;
  }

  async function downloadButtonHandler() {
    const filename = removeWhiteSpace(file);
    console.log("button pressed");
    try {
      console.log("request sent");
      console.log(filename);
      // TODO: change response from json to blob in http-hook
      const response = await sendRequest(`/api/resources/${filename}`)

      const objectURL = URL.createObjectURL(response)
    } catch (err) {}
  }

  const file = props.title;
  return (
    <div className="general-resources-item">
      <span>{props.title}</span>
      <button onClick={downloadButtonHandler}>Download</button>
    </div>
  );
};

export default GeneralResourcesItem;
