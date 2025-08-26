import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEnvelope, FaUser, FaCalendarAlt } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";

const MyProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const ringRef = useRef(null);

  const { data: memberData, isLoading } = useQuery({
    queryKey: ["member", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/members?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // GSAP spinning gradient ring
  useEffect(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotate: 360,
        repeat: -1,
        ease: "linear",
        duration: 10,
      });
    }
  }, []);

  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <span className="loading loading-spinner w-12 h-12 text-orange-500"></span>
      </Box>
    );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        sx={{
          maxWidth: 600,
          margin: "2rem auto",
          padding: "2rem",
          borderRadius: "1.5rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          backgroundColor: "#001f45",
          border: "2px solid white",
          color: "#ff7b00",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Profile Picture with GSAP Gradient Ring */}
          <Box
            ref={ringRef}
            sx={{
              position: "relative",
              width: 150,
              height: 150,
              borderRadius: "50%",
              padding: "4px",
              background:
                "conic-gradient(from 180deg, #1e3a8a, #ff7b00, #001f45, #ff7b00)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                backgroundColor: "white",
                border: "4px solid white",
              }}
            >
              <img
                src={
                  user?.photoURL && user.photoURL.trim() !== ""
                    ? user.photoURL
                    : "https://via.placeholder.com/150?text=Avatar"
                }
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Avatar";
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ marginTop: "1.5rem", color: "#ff7b00" }}
          >
            My Profile
          </Typography>
        </Box>

        {/* Profile Info */}
        <CardContent>
          <Box
            mt={3}
            display="flex"
            flexDirection="column"
            gap={2}
            fontSize="1.1rem"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <FaUser color="#ff7b00" />
              <strong>Name:</strong> {user?.displayName || "N/A"}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <FaEnvelope color="#ff7b00" />
              <strong>Email:</strong> {user?.email}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <FaCalendarAlt color="#ff7b00" />
              <strong>Joined As Member On:</strong>{" "}
              {memberData?.[0]?.joinedAt
                ? new Date(memberData[0].joinedAt).toLocaleDateString()
                : "N/A"}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MyProfile;
