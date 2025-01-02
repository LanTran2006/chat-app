import React, { useEffect, useState } from "react";
import "./List.scss";
import { userStore } from "../../store/userStore";
import { doc, onSnapshot,getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { chatStore } from "../../store/ChatStore";
function List() {
  let { setActive, currentUser } = userStore();
  let {getUserInfo}=chatStore()
  let [list, setList] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      let userchats=res.data().chats;
      let promises=userchats.map(async(item)=>{
        const docRef = doc(db, "users", item.receiverId);
        const docSnap = await getDoc(docRef);
        return {...item,...(docSnap.data())};
      })
      userchats=await Promise.all(promises);
      setList(userchats.sort((a,b)=>b.updatedAt-a.updatedAt))
    });
    return () => unsub();
  }, []);
  let handle_select=async (item)=>{
    const docRef = doc(db, "userchats", currentUser.id);
    const docSnap = await getDoc(docRef);
    let chats=docSnap.data().chats;
    let index=chats.findIndex(val=>item.chatId==val.chatId);
    chats[index]={
              ...chats[index],
              isSeen: true
           }
     await updateDoc(doc(db, "userchats", currentUser.id),{
         chats
     })
     getUserInfo(item,currentUser)
  }
  return (
    <>
      <div className="select">
        <form className="search">
          <img src="./search.png" alt="" />
          <input placeholder="search" type="text" />
        </form>
        <button onClick={setActive} type="button" className="add">
          <img src="./plus.png" alt="" />
        </button>
      </div>
      <ul className="users">
        {list.map((item) => (
          <li className={!item.isSeen ? 'unseen' : ''} onClick={()=>handle_select(item)} key={item.receiverId}>
            <img src={item.image || "./avatar.png"} alt="" />
            <div className="text">
              <h2>{item.name}</h2>
              <span>{item.lastMessage}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default List;
{
  /* <li>
          <img src="./avatar.png" alt="" />
          <div className="text">
            <h2>name</h2>
            <span>message</span>
          </div>
        </li>
        <li>
          <img src="./avatar.png" alt="" />
          <div className="text">
            <h2>name</h2>
            <span>message</span>
          </div>
        </li>
       */
}
