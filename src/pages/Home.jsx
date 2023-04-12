import React, { useContext, useEffect, useState } from "react";
import { Authcontext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import { Chatcontext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Message from "../components/Message";

function Home() {
  const { currentuser } = useContext(Authcontext);
  const { change_user } = useContext(Chatcontext);
  const navigate = useNavigate();
  const [userchats, setUserchats] = useState(null);
  const [key, setKey] = useState("");
  useEffect(() => {
    let unsubscribe = () => false;
    if (currentuser.uid) {
      unsubscribe = onSnapshot(doc(db, "userchats", currentuser.uid), (doc) => {
        doc.exists() && setUserchats(Object.entries(doc.data()));
      });
    }
    return () => unsubscribe();
  }, [currentuser?.uid]);
  const handle_navigate = (userinfo, id) => {
    change_user(userinfo, id);
    navigate("/chat");
  };
  let userchatsfiltered = !userchats ? [] :
     userchats.every((info) => info[1].date)
      ? userchats.filter((user) =>
          user[1].info.displayname.toLowerCase().includes(key)
        )
      : null
      console.log(currentuser);
  return (
    <section className="profile">
      <div className="user">
        <div className="left">
          <img src={currentuser?.photoURL} alt="" />
          <div className="description">
            <h3>{currentuser?.displayName}</h3>
            <p>Active now</p>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="right">
          Logout
        </button>
      </div>

      <form action="" className="search">
        <input onChange={(e) => setKey(e.target.value)} type="text" />
        <i className="fa-solid fa-magnifying-glass"></i>
      </form>

      <div className="chats">
        {userchatsfiltered ? (
          userchatsfiltered
            .sort((a, b) => a[1].date - b[1].date)
            .map((info) =><Message key={info[0]} info={info} handle_navigate={handle_navigate} currentuser={currentuser}/>)
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
}

export default Home;
