import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://sports-server-brown.vercel.app`,
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
