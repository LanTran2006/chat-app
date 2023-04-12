import React,{useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {Authcontext} from '../context/AuthContext'
function Login(props) {
  const {setLoading} = useContext(Authcontext)
  const navigate=useNavigate()
  const handle_submit=async (e)=>{
    e.preventDefault();
    setLoading(true)
    const email = e.target[0].value;
    const password = e.target[1].value;
    await signInWithEmailAndPassword(auth, email, password);
    setLoading(false)
    navigate("/")
  }
  return (
    <section className="sign-up">
      <h2>Realtime Chat App</h2>
      <form onSubmit={e=>handle_submit(e)}>
        <div className="email">
          <p>Email Address</p>
          <input placeholder="Email" type="text" />
        </div>
        <div className="password">
          <p>Password</p>
          <input placeholder="Password" type="text" />
          <i className="fa-solid fa-eye"></i>
        </div>
        <button>Continue to chat</button>
        <p>
          Not yet signed up?{" "}
          <Link className="login-btn" to={"/register"}>
           Signup now
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
