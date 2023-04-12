import React from 'react';

function Message({info,handle_navigate,currentuser}) {
    
    return (
        <div
          onClick={() => handle_navigate(info[1].info, info[0])}
          key={info[0]}
          className="user-chat"
        >
          <div className="left">
            <img src={info[1].info?.photoURL} alt="" />
            <div className="description">
              <h4>{info[1]?.info?.displayname}</h4>
              <p>
                {info[1]?.lastmessage?.id === currentuser?.uid
                  ? "you: "
                  : info[1]?.info?.displayname + " :"}{" "}
                {info[1]?.lastmessage?.text}
              </p>
            </div>
          </div>

          <div className="right"></div>
        </div>
      )
}

export default Message;