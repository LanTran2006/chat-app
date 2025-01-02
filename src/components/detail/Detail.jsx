import React, { useState } from "react";
import "./Detail.scss";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { toast } from "react-toastify";
import { chatStore } from "../../store/ChatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { userStore } from "../../store/userStore";
function Detail() {
  let [active,setActive]=useState(false);
   let {user,block,isReceiverBlocked}=chatStore()
   let {currentUser}=userStore()
  let handle_logout=async ()=>{
    await signOut(auth);
    toast.success('you are logged out')
  }
  let handle_block=async ()=>{
    if (isReceiverBlocked) {
      await updateDoc(doc(db, "users", currentUser.id), {
        blockedUsers:arrayRemove(user.id)
      });
    } else {
      await updateDoc(doc(db, "users", currentUser.id), {
        blockedUsers: arrayUnion(user.id)
});
    }
    block()
  }
  return (
    <section className="detail-part">
      <div className="user">
        <img
          src={user.image || "./avatar.png"}
          alt=""
        />
        <h2>{user.name}</h2>
        <p>
          Lorem ipsum dolor 
        </p>
      </div>
      <ul className="list">
        <li>
          <p>chat Setting</p>
          <img src="./arrowDown.png" alt="" />
        </li>
        <li>
          <p>Privacy & Help</p>
          <img src="./arrowDown.png" alt="" />
        </li>
        <div className="wrapper">
          <li onClick={()=>setActive(!active)}>
            <p>Shared Photos</p>
            <img src={active ? "./arrowUp.png" : "./arrowDown.png"} alt="" />
          </li>

          <div className={`photos ${active ? 'active' : ''}`}>
            <div className="photo">
              <div className="info">
                <img
                  src="https://img.freepik.com/premium-photo/low-angle-view-windmill-against-sky_1048944-28465286.jpg?size=338&ext=jpg"
                  alt=""
                />
                <p>something</p>
              </div>
              <img src="./download.png" alt="" />
            </div>
            <div className="photo">
              <div className="info">
                <img
                  src="https://img.freepik.com/premium-photo/low-angle-view-windmill-against-sky_1048944-28465286.jpg?size=338&ext=jpg"
                  alt=""
                />
                <p>something</p>
              </div>
              <img src="./download.png" alt="" />
            </div>
            <div className="photo">
              <div className="info">
                <img
                  src="https://img.freepik.com/premium-photo/low-angle-view-windmill-against-sky_1048944-28465286.jpg?size=338&ext=jpg"
                  alt=""
                />
                <p>something</p>
              </div>
              <img src="./download.png" alt="" />
            </div>
            <div className="photo">
              <div className="info">
                <img
                  src="https://img.freepik.com/premium-photo/low-angle-view-windmill-against-sky_1048944-28465286.jpg?size=338&ext=jpg"
                  alt=""
                />
                <p>something</p>
              </div>
              <img src="./download.png" alt="" />
            </div>
          </div>

        </div>
        <li>
          <p>Shared Files</p>
          <img src="./arrowDown.png" alt="" />
        </li>
      </ul>
      <button onClick={handle_block} className="block">{isReceiverBlocked ? 'unblock' : 'Block User'}</button>
      <button onClick={handle_logout} className="logout">Logout</button>
    </section>
  );
}

export default Detail;
