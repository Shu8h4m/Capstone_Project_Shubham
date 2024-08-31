import "./rightbar.css";
// import { Users } from "../../dummyData.js";
import Online from "../online/Online.jsx";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance.jsx";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Add, Remove } from "@mui/icons-material";
import MessageIcon from "@mui/icons-material/Message";
import EditableUserInfo from "../editableUserInfo/EditableUserInfo.jsx";
import { useNavigate } from "react-router-dom";

export default function Rightbar({ user }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && currentUser) {
      setFollowed(currentUser.followings.includes(user._id));
    }
  }, [currentUser, user]);

  useEffect(() => {
    const getFriends = async () => {
      if (user && user._id) {
        try {
          const friendList = await axiosInstance.get(
            `/users/friends/${user._id}`
          );
          setFriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axiosInstance.put("/users/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axiosInstance.put("/users/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  };

  const handleMessageBtnClick = async () => {
    try {
      // Check if there's an existing conversation with the user
      const res = await axiosInstance.get(
        `/conversations/find/${currentUser._id}/${user._id}`
      );

      let conversation;
      if (res.data) {
        // If a conversation exists, use the entire conversation object
        conversation = res.data;
      } else {
        // If no conversation exists, create one and use that
        const newConversation = await axiosInstance.post("/conversations", {
          senderId: currentUser._id,
          receiverId: user._id,
        });
        conversation = newConversation.data;
      }

      // Navigate to the Messenger component with the conversation object
      navigate("/messenger", { state: { conversation } });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSave = async (updatedUser) => {
    try {
      const res = await axiosInstance.put("/users/" + user._id, {
        ...updatedUser,
        userId: currentUser._id,
      });
      setEditMode(false);

      // Optionally, update the user context or state
    } catch (error) {
      console.log(error);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <span>Advertisements...</span>
          {/* <img className="birthdayImg" src={`${PF}gift.png`} alt="" />
          <span className="birthdayText">
            <b>Pratham Mate</b> and <b>3 other friends</b> have a birthday today.
          </span> */}
        </div>
        <img className="rightbarAd" src={`${PF}ad.png`} alt="" />

        {/* <h4 className="rightbarTitle">Online Friends</h4>

        <ul className="rightbarFriendlist">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul> */}
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <div className="buttonUIcontroller">
            <button className="rightbarFollowButton" onClick={handleClick}>
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
            {followed && (
              <button className="messageButton" onClick={handleMessageBtnClick}>
                Message
                <MessageIcon />
              </button>
            )}
          </div>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          {editMode ? (
            <EditableUserInfo user={user} onSave={handleSave} />
          ) : (
            <>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">City:</span>
                <span className="rightbarInfoValue">{user.city}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">From:</span>
                <span className="rightbarInfoValue">{user.from}</span>
              </div>
              <div className="rightbarInfoItem">
                <span className="rightbarInfoKey">Relationship:</span>
                <span className="rightbarInfoValue">
                  {user.relationship === 1
                    ? "Single"
                    : user.relationship === 2
                    ? "Married"
                    : "-"}
                </span>
              </div>
              {user.username === currentUser.username && (
                <button
                  className="rightbarEditButton"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>

        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              key={friend._id}
              style={{ textDecoration: "none" }}
            >
              <div key={friend._id} className="rightbarFollowing">
                <img
                  className="rightbarFollowingImg"
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
