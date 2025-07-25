import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.init"; // ✅ Firebase instance
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://sports-server-brown.vercel.app",
});

export default function useAxiosSecure() {
  const navigate = useNavigate();
  const { logOut } = useAuth(); // ❌ Don't use custom user

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const currentUser = auth.currentUser; // ✅ Get Firebase user
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
          console.log("TOKEN 🔐", token); // ✅ SEE YOUR TOKEN
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
}
