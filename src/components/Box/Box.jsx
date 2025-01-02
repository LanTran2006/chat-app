import React, { useState } from "react";
import "./Box.scss";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, serverTimestamp, addDoc ,updateDoc,doc, arrayUnion} from "firebase/firestore";
import {userStore} from '../../store/userStore'
import {toast} from 'react-toastify'
function Box() {
  let [text, setText] = useState("");
  let [user, setUser] = useState();
  let {currentUser,setActive}=userStore()
  let handle_search = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", text));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUser(doc.data());
    });
  };
  let handle_add = async () => {
    const chatsRef = await addDoc(collection(db, "chats"), {
      messages: []
    });
    await updateDoc(doc(db, "userchats",currentUser.id), {
      chats: arrayUnion({
          receiverId: user.id,
          lastMessage: '',
          lastUpdated: new Date(),
          chatId: chatsRef.id
      }),
    });
    await updateDoc(doc(db, "userchats",user.id), {
      chats: arrayUnion({
          receiverId: currentUser.id,
          lastMessage: '',
          lastUpdated: new Date(),
          chatId: chatsRef.id
      }),
    });
    setActive();
    toast.success('user added')
  };
  console.log(user);
  return (
    <section className="box">
      <h2>Add new user</h2>
      <div className="input-container">
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Luke Clark"
        />
        <button onClick={handle_search}>Search</button>
      </div>
      {user && (
        <div className="found-user">
          <div className="user-info">
            <img
              src={user.image || "./avatar.png"}
              alt="User Profile Picture"
            />
            <span>{user.name}</span>
          </div>
          <button onClick={handle_add}>Add User</button>
        </div>
      )}
    </section>
  );
}

export default Box;
