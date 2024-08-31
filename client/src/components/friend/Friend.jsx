import "./friend.css";
import { Link } from "react-router-dom";

export default function Friend({ user }) {
  const PF = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <Link
      to={`/profile/${user.username}`}
      style={{ textDecoration: "none", color: "black" }}
    >
      <div className="friendItem">
        <li className="sidebarFriend">
          <img
            className="sidebarFriendImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "/person/noAvatar.png"
            }
            alt=""
          />
          <span className="sidebarFriendName">{user.username}</span>
        </li>
      </div>
    </Link>
  );
}
