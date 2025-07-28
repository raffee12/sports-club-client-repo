// hooks/useUserRole.js
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const prevRoleRef = useRef(null);

  const {
    data: role,
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !loading,
    staleTime: 0, // always considered stale, can refetch anytime
    cacheTime: 1000 * 60 * 10,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/role/${encodeURIComponent(user.email)}`
      );
      return res.data.role;
    },
  });

  useEffect(() => {
    const prevRole = prevRoleRef.current;
    if (prevRole && prevRole !== "member" && role === "member") {
      Swal.fire({
        icon: "success",
        title: "Membership Approved!",
        text: "You are now a member of the club.",
        confirmButtonText: "Great!",
      });
    }
    prevRoleRef.current = role;
  }, [role]);

  return {
    role,
    isRoleLoading: isLoading || loading,
    isAdmin: role === "admin",
    isMember: role === "member",
    isUser: role === "user",
    refetchRole: refetch, // ✅ this is the key
    isRoleError: isError,
    roleError: error,
  };
};

export default useUserRole;
