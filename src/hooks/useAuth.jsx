import React, { use } from "react";
import { AuthContext } from "../firebase/AuthContext";

function useAuth() {
  const useInfo = use(AuthContext);
  return useInfo;
}

export default useAuth;
