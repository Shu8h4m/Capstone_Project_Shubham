
import {axiosInstance} from "./utils/axiosInstance.jsx"


export const loginCall = async (userCredentials,dispatch) =>{
    dispatch({type : "LOGIN_START"});
    try {
        const res = await axiosInstance.post("auth/login", userCredentials, { withCredentials: true });
        dispatch({type: "LOGIN_SUCCESS" , payload : res.data});
        
    } catch (error) {
        dispatch({type: "LOGIN_FAILURE" , payload : error});
    }
}

export const logoutCall = async (dispatch) =>{
    
    try {
        await axiosInstance.post("auth/logout");
        dispatch({type : "LOGOUT"});
    } catch (error) {
        console.log(error)
    }
}
