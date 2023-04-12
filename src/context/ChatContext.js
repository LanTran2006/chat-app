import React, { createContext, useEffect, useState } from 'react';

export const Chatcontext=createContext()

function ChatContext({children}) {
    const [chat,setChat]=useState(localStorage.getItem('chat') ? JSON.parse(localStorage.getItem('chat')) :{
        user: {},
        chatid: 'null'
    })
   const change_user=(userinfo,id)=>{
     setChat({
        user: userinfo,
        chatid: id
     })
   }
   useEffect(()=>{
      localStorage.setItem('chat',JSON.stringify(chat))
   },[chat])
    return (
        <Chatcontext.Provider value={{change_user,chat}}>
            {children}
        </Chatcontext.Provider>
    );
}

export default ChatContext;