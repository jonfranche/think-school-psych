import { useHttpClient } from "../../../shared/hooks/http-hook";

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
    const fileType = props.fileType;
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

  const file = props.title;
  return (
    <div className="general-resources-item">
      <span>{props.title}</span>
      <button onClick={downloadButtonHandler}>Download</button>
    </div>
  );
};

export default GeneralResourcesItem;
