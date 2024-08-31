import { createContext,  useContext,  useEffect,  useReducer } from "react";
import AuthReducer from "./AuthReducer";
import {axiosInstance} from "../utils/axiosInstance"


const INITIAL_STATE = {
    user : JSON.parse(localStorage.getItem("user")) || null,
    isFetching : false,
    error : false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer,INITIAL_STATE);
    
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

      useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/user/profile");
                dispatch({type : "LOGIN_SUCCESS" , payload : res.data})
            } catch (error) {
                dispatch({type : "LOGIN_FAILURE" , payload :error})
            }
        };
        if (!state.user && document.cookie.includes('token')) { // Check if token exists in cookies
            fetchUser();
        }
      },[])
   
    return (
        <AuthContext.Provider value={{  user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch, }}>
            {children}
        </AuthContext.Provider>
    )
}