import React, { useState, useEffect } from "react";
import axios from "axios";
import Cors from "cors";
import styles from "./Upload.module.css";
import { MdCloudUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const cors = Cors();
function Upload() {
  const navigate = useNavigate();
  const [uploadedItem, setUploadedItem] = useState(null);
  const [fileName, setFileName] = useState("No-File-Selected");
  const [url, seturl] = useState(null);
  const [uploadStatus, isUploaded] = useState(false);

  const HandleFileChange = (event) => {
    const dataimg = event.target.files[0];
    const value = URL.createObjectURL(dataimg);
    setUploadedItem(dataimg);
    seturl(value);
    setFileName(dataimg.name);
  };

  const HandleUpload = async () => {
    const Form = new FormData();
    Form.append("image", uploadedItem);
    const res = await axios.post("http://localhost:8000/api/upload", Form);
    console.log(res.data);
    isUploaded(true);
  };

  const uploadconvert = () => {
    document.querySelector(".input-field").click();
  };

  const ResetInput = () => {
    setFileName("No-File-Selected");
    setUploadedItem(null);
    seturl(null);
    isUploaded(false);
  };

  useEffect(() => {
    if (uploadStatus) {
      navigate("/Food");
    }
  }, [uploadStatus]);
  return (
    <div className={styles.body}>
      <div className={styles.topcontainer}>
        <div className={styles.container} onClick={uploadconvert}>
          <input
            type="file"
            className="input-field"
            onChange={HandleFileChange}
            hidden
          />

          {uploadedItem ? (
            <img src={url} alt="error" className={styles.setimg} />
          ) : (
            <MdCloudUpload size={200} color="wheat" />
          )}
        </div>
        <h3 className={styles.filename}>{fileName}</h3>
        <button onClick={ResetInput} className={styles.retry}>
          Retry
        </button>
        <button onClick={HandleUpload} className={styles.upload}>
          Upload
        </button>
      </div>
    </div>
  );
}

export default Upload;
