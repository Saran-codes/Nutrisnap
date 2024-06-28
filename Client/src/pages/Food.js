import React, { useEffect, useState } from "react";
import styles from "./Food.module.css";
import gif from "../resources/loading.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Food = () => {
  const [foodname, setfoodname] = useState("");
  const [filename, setfilename] = useState("");
  const [imgUrl, setimgUrl] = useState("");
  const [nutri_info, setNutri_info] = useState("");
  const [all_info, setAll_info] = useState("");
  const [flag, isflag] = useState(false);
  const navigate = useNavigate();

  const changepage = (e) => {
    e.preventDefault();
    navigate("/chat");
  };

  useEffect(() => {
    const fetchfunction = async () => {
      const res = await axios.get("http://localhost:8000/api/openaiInfo");
      // setInfo(res.data);
      // console.log(Info);
      if (res.data) {
        isflag(true);
        setNutri_info(res.data[0].nutrition_content);
        setAll_info(res.data[1].allergic_reaction);
      } else {
        console.log("Something is odd");
      }
      console.log(flag);
    };
    fetchfunction();
  }, []);

  useEffect(() => {
    const fetchfunction = async () => {
      const responce = await axios.get("http://localhost:8000/api/upload");
      setfoodname(responce.data);
    };
    fetchfunction();
  }, []);

  useEffect(() => {
    const fetchfunction = async () => {
      const responce = await axios.get("http://localhost:8000/api/filename");
      setfilename(responce.data.filename);
    };
    fetchfunction();
  }, []);

  useEffect(() => {
    const fetchfunction = async () => {
      const response = await axios.get("http://localhost:8000/api/get_image", {
        responseType: "blob",
      });
      const blobUrl = URL.createObjectURL(response.data);
      setimgUrl(blobUrl);
      // console.log(imgUrl);
    };
    fetchfunction();
  }, []);
  return (
    <div className={styles.container}>
      {foodname && imgUrl && flag ? (
        <div className={styles.insideContainer}>
          <div className={styles.content}>
            <div className={styles.heading}>
              <h2>The Food about which You want to know is... </h2>
              <div className={styles.setup}>
                <h2>
                  The...
                  <span>
                    <h3>{foodname}</h3>
                  </span>
                </h2>
              </div>
            </div>
            <div className={styles.serverData}>
              <div className={styles.aboutFood}>
                <div className={styles.aboutfoodHeading}>
                  <h2>About the foodieee</h2>
                </div>
                <p>{nutri_info}</p>
              </div>
              <div className={styles.allergicContent}>
                <div className={styles.allergiccontentHeading}>
                  <h2>What about allergies....</h2>
                </div>
                <p>{all_info}</p>
              </div>
            </div>
          </div>
          <div className={styles.image}>
            {imgUrl && <img src={imgUrl} alt="error" />}
            <button className={styles.chat} onClick={changepage}>
              Learn from OpenAI through Chat....
            </button>
          </div>
        </div>
      ) : (
        <img src={gif} alt="loading" />
      )}
    </div>
  );
};

export default Food;
