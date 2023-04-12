import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import ChatContext from "./context/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContext>
    <ChatContext>
      <Router>
        <App />
      </Router>
    </ChatContext>
  </AuthContext>
);
