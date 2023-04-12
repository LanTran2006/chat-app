import React, { useContext, useEffect, useState } from "react";
import {
  arrayUnion,
  onSnapshot,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { Chatcontext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "../context/AuthContext";
import Loader from "../Loader";

function Chat(props) {
  const {
    chat: { user, chatid },
  } = useContext(Chatcontext);
  const navigate = useNavigate();
  const {currentuser:{uid}}= useContext(Authcontext);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatid), (doc) => {
      doc.exists() && setMessages(doc.data().message);
    });
    return () => {
      unSub();
    };
  }, [chatid]);
  
  const handle_submit = async (e) => {
    e.preventDefault();
    setText('')
    await updateDoc(doc(db, "chats", chatid), {
      message: arrayUnion({
        id: uid,
        photoURL: user.photoURL,
        text,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userchats", uid), {
      [chatid + ".lastmessage"]: {
        id: uid,
        text,
      },
    });
    await updateDoc(doc(db, "userchats", user.id), {
      [chatid + ".lastmessage"]: {
        id: uid,
        text,
      },
      [chatid + ".date"]: serverTimestamp()
    });
  };

  return (
    <section className="chat-area">
      <header>
        <i onClick={() => navigate("/")} className="fa-solid fa-arrow-left"></i>
        <img src={user?.photoURL} alt="" />
        <div className="info">
          <h4>{user?.displayname}</h4>
          <p>Active now</p>
        </div>
      </header>
      <div className="chat">
         {messages ? messages.map((message,index) => {
          if (message.id!== uid) {
            return (
              <div key={index} className="sender">
              <img
                src={user.photoURL}
                alt=""
              />
              <p>{message.text}</p>
            </div>
            );
          }
          return (
            <div key={index} className="receiver">
                <p>
                 {message.text}
                </p>
              </div>
          );
        }) : <Loader/>}
      </div>
      <form onSubmit={handle_submit}>
        <input
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message here"
          type="text"
          value={text}
          required
        />
        <button type="submit">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </section>
  );
}

export default Chat;
 /* <div className="sender">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.64mezA1F6eYavcDWrgjHQgHaEK&pid=Api&P=0"
            alt=""
          />
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur
            natus doloribus id quod hic recusandae temporibus, laudantium
            explicabo esse tenetur ab molestias illum nesciunt eos, dicta animi
            aperiam totam qui?
          </p>
        </div>

        <div className="sender">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.64mezA1F6eYavcDWrgjHQgHaEK&pid=Api&P=0"
            alt=""
          />
          <p>hello</p>
        </div>
        <div className="receiver">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque,
            impedit molestiae? Molestiae?
          </p>
        </div> */