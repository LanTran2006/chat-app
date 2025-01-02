import React, { useState } from "react";
import "./Login.scss";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import upLoad from "../../firebase/upload";
import { toast } from "react-toastify";
function Login() {
  let [file, setFile] = useState({
    file: null,
    url: null,
  });
  let handle_upload = (e) => {
    setFile({
      file: e.target.files[0],
      url: URL.createObjectURL(e.target.files[0]),
    });
  };
  let handle_register = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let { email, password, username } = Object.fromEntries(formData);
    let { user } = await createUserWithEmailAndPassword(auth, email, password);
    let imgUrl = await upLoad(file.file);
    console.log(imgUrl);
    await setDoc(doc(db, "users", user.uid), {
      name: username,
      email: email,
      id: user.uid,
      image: imgUrl,
      blockedUsers: [],
    });
    await setDoc(doc(db, "userchats", user.uid), {
      chats: [],
    });
    toast.success("register successfully");
  };
  let handle_login = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password).catch((err)=>{throw Error(err);
    });
      toast.success("login successfully");
    } catch (error) {
       toast.error('something went wrong')
    }
  };

  return (
    <section className="login-form">
      <div className="sign-in">
        <h2>Welcome Back</h2>
        <form onSubmit={handle_login}>
          <input name="email" placeholder="email" type="text" />
          <input name="password" placeholder="password" type="text" />
          <button>Sign in</button>
        </form>
      </div>
      <div className="seperator"></div>
      <div className="sign-up">
        <h2>Create an Account</h2>
        <label htmlFor="file">
          <img src={file.url || "./avatar.png"} alt="" />
          <a>upload an avatar</a>
        </label>
        <input onChange={handle_upload} type="file" id="file" />
        <form onSubmit={handle_register}>
          <input name="username" placeholder="username" type="text" />
          <input name="email" placeholder="email" type="text" />
          <input name="password" placeholder="password" type="text" />
          <button>Sign up</button>
        </form>
      </div>
    </section>
  );
}

export default Login;
