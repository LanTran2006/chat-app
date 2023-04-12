import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useContext } from "react";
import { Authcontext } from "./context/AuthContext";
import Chat from "./pages/Chat";
import Loading from "./Loading";

function App() {
  const {currentuser,loading} = useContext(Authcontext);
  if (loading) {
    return <Loading/>
  }
  return (
    <>
      <Routes>
        <Route path="/" element={currentuser ? <Home/> : <Navigate to='/login'/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </>
  );
}

export default App;
