import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { Authcontext } from "../context/AuthContext";

function Register() {
  let navigate = useNavigate();
  const {setLoading}=useContext(Authcontext)
  const handle_submit = async (e) => {
    setLoading(true)
    e.preventDefault();
    const displayname = e.target[0].value + ' '+ e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;
    const image = e.target[4].files[0];
    let res = await createUserWithEmailAndPassword(auth, email, password);
    const date = new Date().getTime();
    const storageRef = ref(storage, `${displayname + date}`);
    await uploadBytesResumable(storageRef, image).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        await updateProfile(res.user, {
          displayName: displayname,
          photoURL: downloadURL,
        });
        await setDoc(doc(db, "users",res.user.uid), {
          uid: res.user.uid,
          displayname,
          photoURL:downloadURL
        });
        
    });
  });
  setLoading(false);
  navigate("/");
}
  return (
    <section className="register">
      <h2>Realtime Chat App</h2>
      <form onSubmit={(e) => handle_submit(e)}>
        <div className="name">
          <div className="first-name">
            <p>First name</p>
            <input placeholder="First name" type="text" />
          </div>
          <div className="last-name">
            <p>Last name</p>
            <input placeholder="Last-name" type="text" />
          </div>
        </div>

        <div className="email">
          <p>Email Address</p>
          <input placeholder="Email" type="text" />
        </div>
        <div className="password">
          <p>Password</p>
          <input placeholder="Password" type="text" />
          <i className="fa-solid fa-eye"></i>
        </div>
        <div className="select">
          <p>select image</p>
          <input placeholder="choose file" type="file" name="" id="" />
        </div>
        <button type="submit">Continue to chat</button>
        <p>
          Already sign up?{" "}
          <Link className="login-btn" to={"/login"}>
            login now
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
