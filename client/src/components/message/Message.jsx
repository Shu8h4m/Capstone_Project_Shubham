import React from 'react';
import "./message.css";
import {format} from "timeago.js"

export default function Message({message,own}) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img src={message.sender.profilePicture ? PF+message.sender.profilePicture : PF + "/person/noAvatar.png"} className='messageImg' alt="" />
            <p className='messageText'>{message.text}</p>
        </div>
        
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}
