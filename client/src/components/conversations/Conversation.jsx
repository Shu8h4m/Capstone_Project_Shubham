import React, { useEffect, useState } from 'react';
import "./conversation.css"
import { axiosInstance } from '../../utils/axiosInstance';

export default function Conversation({conversation , currentUser}) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [user,setUser] = useState(null);

  useEffect(()=>{
    const friendId = conversation.members.find((m)=> m !== currentUser._id);

    const getUser = async () =>{
      try {
        const res = await axiosInstance.get("/users?userId="+friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error)
      }
    }

    getUser();
  },[currentUser,conversation])

 
  return (
    <div className='conversation'>
         <img 
            src={user?.profilePicture ? PF + user.profilePicture : PF + "/person/noAvatar.png" } 
            alt="" 
            className="conversationImg" 
          />
          <span className="conversationName">{user?.username}</span>
    </div>
  )
}
