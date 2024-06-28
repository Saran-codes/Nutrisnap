import { useState } from "react";
import styles from "./Chat.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const navigate = useNavigate();

  const goFood = (e) => {
    e.preventDefault();
    navigate("/food");
  };
  const goUpload = (e) => {
    e.preventDefault();
    navigate("/upload");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await axios.post(
      "http://127.0.0.1:8000/api/answer",
      {
        question,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const { answer } = res.data;
    console.log(answer);
    setAnswer(answer);
    setChatHistory([...chatHistory, { question, answer }]);
    setQuestion("");
  };

  const handleChange = (event) => {
    setQuestion(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        Chat with your personal Open AI assisstant
      </div>
      <span>
        <button className={styles.btn} onClick={goFood}>
          Home page
        </button>
        <button className={styles.btn} onClick={goUpload}>
          Contact
        </button>
      </span>

      <div className={styles.chatWindow}>
        <div className={styles.chatHistory}>
          {chatHistory.map((message, index) => (
            <div key={index} className={styles.chatMessage}>
              <div className={styles.question}>
                <p className={styles.messageText1}>{message.question}</p>
              </div>
              <div className={styles.message}>
                {message.answer && (
                  <p className={styles.messageText2}>{message.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className={styles.chatForm}>
          <input
            type="text"
            value={question}
            onChange={handleChange}
            className={styles.chatInput}
            placeholder="Ask me anything..."
          />
          <button type="submit" className={styles.chatButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
