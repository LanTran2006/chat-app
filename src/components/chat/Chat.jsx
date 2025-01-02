import React, { useEffect, useRef, useState } from "react";
import "./Chat.scss";
import EmojiPicker from "emoji-picker-react";
import { chatStore } from "../../store/ChatStore";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { userStore } from "../../store/userStore";
import upLoad from "../../firebase/upload";
function Chat() {
  let [open, setOPen] = useState(false);
  let [text, setText] = useState("");
  let [file, setFile] = useState();
  let [chats, setChats] = useState([]);
  let emojiref = useRef();
  let chatRef = useRef();
  let { user,isUserBlocked } = chatStore();
  let { currentUser} = userStore();
  let handle_click = (e) => {
    setText((prev) => prev + e.emoji);
    setOPen(false);
  };
  let handle_close = (e) => {
    e.stopPropagation();
    setOPen(!open);
  };
  let handle_chat = async (e) => {
    e.preventDefault();
    setText('')
    setFile()
    let base64String = await upLoad(file);
    let document = {
      senderId: currentUser.id,
      text,
      lastUpdated: new Date(),
    };
    if (base64String) document = { ...document, image: base64String };
    if (!text) delete document.text;
    await updateDoc(doc(db, "chats", user.chatId), {
      messages: arrayUnion(document),
    });
   [currentUser.id,user.id].forEach(async (id)=>{
       const docRef = doc(db, "userchats", id);
       const docSnap = await getDoc(docRef);
       let chats=docSnap.data().chats;
       let index=chats.findIndex(item=>item.chatId==user.chatId);
       chats[index]={
          ...chats[index],
          lastMessage: text,
          lastUpdated: new Date(),
          isSeen: currentUser.id==id
       }
       await updateDoc(doc(db, "userchats", id), {
        chats,
      });
   })
   
  };
  useEffect(() => {
    let handle_clickOutside = (e) => {
      console.log(e.target, emojiref.current);
      if (!emojiref.current.contains(e.target)) {
        setOPen(false);
      }
    };
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    document.addEventListener("click", handle_clickOutside);
    const unsub = onSnapshot(doc(db, "chats", user.chatId), (res) => {
      setChats(res.data().messages);
    });
    return () => {
      document.removeEventListener("click", handle_clickOutside);
      unsub();
    };
  }, [currentUser.id]);
  console.log(isUserBlocked);
  return (
    <section className="chat">
      <div className="detail">
        <div className="user">
          <img src={user.image || "./avatar.png"} alt="" />
          <div className="text">
            <h2>{user.name}</h2>
            <span>hello</span>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div ref={chatRef} className="messages">
        {chats.map((item,idx) => (
          <div
             key={idx}
            className={`message ${
              item.senderId == currentUser.id ? "own" : ""
            }`}
          >
            {item.senderId != currentUser.id && <img src={user.image} alt="" />}
            <div>
              {item.image && <img className="image" src={item.image} alt="" />}
              {item.text && <p>{item.text}</p>}
              <span>1m ago</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handle_chat} className="send-message">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          name=""
          id="img"
        />
        <label htmlFor="img">
          <img src="./img.png" alt="" />
        </label>
        <img src="./camera.png" alt="" />
        <img src="./mic.png" alt="" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="send message"
          type="text"
        />
        <div ref={emojiref} onClick={() => setOPen(true)} className="picker">
          <img onClick={handle_close} src="./emoji.png" alt="" />
          <div className="wrapper">
            <EmojiPicker open={open} onEmojiClick={handle_click} theme="dark" />
          </div>
        </div>
        <button disabled={isUserBlocked}>Send</button>
      </form>
    </section>
  );
}

export default Chat;
{
  /* <div className="message">
          <img src="./avatar.png" alt="" />
          <div>
            <img
              className="image"
              src="https://img.freepik.com/premium-photo/family-enjoying-beach-against-sky-during-sunset_1048944-29945983.jpg?size=338&ext=jpg"
              alt=""
            />
            <span>1m ago</span>
          </div>
        </div> */
}
