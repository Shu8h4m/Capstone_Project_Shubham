import "./profile.css"
import TopBar from '../../components/topbar/TopBar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import { useEffect, useState ,useRef, useContext } from "react"
import { useParams } from "react-router"
import {axiosInstance} from "../../utils/axiosInstance.jsx"
import { AuthContext } from "../../context/AuthContext.jsx";


export default function Profile() {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
   
    const [user,setUser] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);
    const [coverPicture, setCoverPicture] = useState(null);
    const username = useParams().username;
    const { user: loggedInUser } = useContext(AuthContext);

    const profileInputRef = useRef(null);
    const coverInputRef = useRef(null);

    useEffect( ()=>{
        
          const fetchUser = async () =>{
            const res = await axiosInstance.get(`/users?username=${username}`
            );
            setUser(res.data)
          }
         fetchUser();
         
    },[username])

    const handleProfilePictureChange = (e) => {
      setProfilePicture(e.target.files[0]);
     };

  const handleCoverPictureChange = (e) => {
      setCoverPicture(e.target.files[0]);
     };

  const handleUpload = async (e) => {
      e.preventDefault();

      if (profilePicture) {
        const formData = new FormData();
        const fileName = Date.now() + profilePicture.name;
        formData.append("name",fileName );
        formData.append("profilePicture", profilePicture);
        formData.append("userId", user._id); // Assuming user._id is the user ID

        await axiosInstance.post("/user/upload-profile-picture", formData);
    }

    if (coverPicture) {
        const formData = new FormData();
        const fileName = Date.now() + coverPicture.name;
        formData.append("name",fileName );
        formData.append("coverPicture", coverPicture);
        formData.append("userId", user._id); // Assuming user._id is the user ID

        await axiosInstance.post("/user/upload-cover-picture", formData);
    }

    // Fetch updated user data and update the UI...
    const res = await axiosInstance.get(`/users?username=${username}`);
    setUser(res.data);
    profileInputRef.current.value = null;
    coverInputRef.current.value = null;
   };

  return (
    <>
    <TopBar/>
    <div className="profile">
        <Sidebar/>
        <div className="profileRight">
            <div className="profileRightTop">
                <div className="profileCover">
                    <img className="profileCoverImg" src={user.coverPicture ? PF + user.coverPicture : PF +"person/noCover.jpg"}alt="" />
                    <img className="profileUserImg" src={user.profilePicture ? PF +  user.profilePicture : PF + "person/noAvatar.png"} alt="" />
                    
                </div>
                <div className="profileInfo">
                    <h4 className="profileInfoName">{user.username}</h4>
                    <span className="profileInfoDesc">{user.desc}</span>
                </div>
                {loggedInUser && user.username === loggedInUser.username && (
                            <div className="handleUpload">
                                <label htmlFor="coverInput">Upload Cover Picture:</label>
                                <input type="file" id="coverInput" ref={coverInputRef} onChange={handleCoverPictureChange} />
                                <label htmlFor="profileInput">Upload Profile Picture:</label>
                                <input type="file" ref={profileInputRef} id="profileInput" onChange={handleProfilePictureChange} />
                                <button onClick={handleUpload}>Upload</button>
                            </div>
                        )}
                  
            </div>
            <div className="profileRightBottom">
            <Feed username = {username}/>
            <Rightbar user = {user}/>
            </div>
        </div>
       
    </div>
    
    </>
  )
}
