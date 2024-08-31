import { useRef } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import {axiosInstance} from "../../utils/axiosInstance.jsx"

export default function Register() {
    const email = useRef();
    const username = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate();

    const handleClick = async (e) =>{
        e.preventDefault();

        if(passwordAgain.current.value !== password.current.value){
            passwordAgain.current.setCustomValidity("Passwords don't match")
        }else{
            const user = {
                username : username.current.value,
                email : email.current.value,
                password : password.current.value,
            }
            try {
                await axiosInstance.post("auth/register", user);
                navigate("/login");
            } catch (error) {
                console.log(error)
            }
        }
    }



  return (
    <div className="register">
        <div className="registerWrapper">
            <div className="registerLeft">
                <h3 className="registerLogo">BHOYAR_SOCIAL</h3>
                <span className="registerDesc">Connect with friends and the world around you on BHOYAR_SOCIAL</span>
            </div>
            <div className="registerRight">
                <form className="registerBox" onSubmit={handleClick}>
                    <input placeholder="Username"  className="registerInput" required ref={username} />
                    <input placeholder="Email" type="email" className="registerInput" required ref={email} />
                    <input placeholder="Password" type="password" className="registerInput" required ref={password} minLength={6} />
                    <input placeholder="Password Again" type="password" className="registerInput" required ref={passwordAgain} />
                    <button className="registerButton" type="submit">Sign Up</button>
                   <Link to="/login">
                    <button className="registerLoginButton">Log in Account </button>
                   </Link>
                </form>
            </div>
        </div>
    </div>
  )
}
