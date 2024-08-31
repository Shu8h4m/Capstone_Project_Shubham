import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: '/api', // This sets the base URL for all requests
    withCredentials: true // Ensure cookies are sent with requests
  });
  
 