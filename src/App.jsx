import { useEffect } from "react";
import "./App.scss";
import Info from "./components/info/Info";
import List from "./components/list/List";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import Login from "./components/login/Login";
import Box from "./components/Box/Box";
import { userStore } from "./store/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { ToastContainer } from "react-toastify";
import { chatStore } from "./store/ChatStore";
function App() {
  let { active, currentUser, fetchUserInfo, ischecking } = userStore();
  let { user } = chatStore();
  useEffect(() => {
    let unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => unsub();
  }, []);
  console.log(currentUser);
  return (
    <div className={`${currentUser ? "container" : "container login"}`}>
      {ischecking && <h2 className="loading">loading...</h2>}
      {!ischecking && (
        <>
          {currentUser ? (
            <>
              <div className="left">
                <Info />
                <List />
              </div>
              {user && (
                <>
                  <Chat />
                  <Detail />
                </>
              )}
            </>
          ) : (
            <Login />
          )}
        </>
      )}
      {active && <Box />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
//helloword