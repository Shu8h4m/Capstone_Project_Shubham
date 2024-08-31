import React, { useEffect, useState } from 'react';
import "./chatOnline.css"
import { axiosInstance } from '../../utils/axiosInstance';
import Conversation from '../conversations/Conversation';

export default function ChatOnline({onlineUsers, currentId, setCurrentChat, refreshConversations }) {
    const [friends,setFriends] = useState([]);
    const [onlineFriends,setOnlineFriends] = useState([]);
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;

   
    useEffect(()=>{
        const getFriends = async () =>{
            const res = await axiosInstance.get("/users/friends/" + currentId);
            setFriends(res.data)
        }
        getFriends();
    },[currentId]);

    useEffect(() =>{
        setOnlineFriends(friends.filter((f)=>
            onlineUsers.includes(f._id)
        ))
    },[friends,onlineUsers])

    const handleClick = async (user) =>{
        try {
            const res = await axiosInstance.get(`/conversations/find/${currentId}/${user._id}`);
            if(res.data !== null){
                setCurrentChat(res.data)
            }else{
                try {
                    const convo = { senderId : currentId , receiverId : user._id};
                    const newConversation = await axiosInstance.post(`/conversations/`, convo);
                    
                    setCurrentChat(newConversation._id)
                    refreshConversations();
                } catch (error) {
                    console.log(error)
                }
                
            }
            
            console.log("clicked")
            
        } catch (error) {
            console.log(error)
        }
    }



  return (
   
   

        <div className='chatOnline'>
        
        {onlineFriends.map((onlineFriend) =>(
            <div className="chatOnlineFriend" key={onlineFriend._id} onClick={() =>handleClick(onlineFriend)}>
              <div className="chatOnlineImgContainer">
                  <img src={onlineFriend?.profilePicture ? PF + onlineFriend.profilePicture : PF + "/person/noAvatar.png" } className="chatOnlineImg"/>
                  <div className="chatOnlineBadge"></div>
              </div>
              <span className="chatonlineName">{onlineFriend?.username}</span>
          </div>
        ))}
        
        </div>
        
   
)
}
