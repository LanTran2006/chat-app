import React from "react";
import './Info.scss'
import {userStore} from '../../store/userStore'
function Info() {
  let {currentUser}=userStore()
  return (
    <section className="info">
      <div className="user">
        <img src={currentUser.image ||"./avatar.png" }alt="" />
        <span>{currentUser.name}</span>
      </div>
      <div className="tools">
        <img src="./more.png" alt="" />
        <img src="./video.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </section>
  );
}

export default Info;
