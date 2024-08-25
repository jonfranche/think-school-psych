import React from "react";
import Button from "../../../shared/components/UIElements/Button";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import "./GeneralResourcesItem.css";

type GeneralResourcesItemProps = {
  fileType: string;
  title: string;
}

const GeneralResourcesItem = ({fileType, title}: GeneralResourcesItemProps) => {
  const { sendRequest } = useHttpClient();

  function removeWhiteSpace(str: string) {
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === " ") continue;
      newStr = newStr + str[i];
    }
    return newStr;
  }

  async function downloadButtonHandler() {
    const filename = removeWhiteSpace(file);
    const fileString = `${filename}.${fileType}`;
    try {
      const response = await sendRequest(
        `/api/resources/${filename}/${fileType}`
      );

      let blobFile = new File([response], fileString, {
        type: "pdf",
      });

      const url = URL.createObjectURL(blobFile);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileString;

      document.body.appendChild(link);

      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      document.body.removeChild(link);
    } catch (err) {}
  }

  const file = title;
  return (
    <div className="general-resources-item">
      <span>{title}</span>
      <Button download={true} onClick={downloadButtonHandler}>
        Download
      </Button>
    </div>
  );
};

export default GeneralResourcesItem;
