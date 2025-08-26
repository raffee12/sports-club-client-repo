import React, { useEffect, useState, useRef } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { FiCalendar, FiClock, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const ConfirmedBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;

    const fetchConfirmedBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
        const confirmed = res.data.filter(
          (b) => b.status === "confirmed" || b.isPaid === true
        );
        setBookings(confirmed);
      } catch (err) {
        console.error("Failed to fetch confirmed bookings:", err);
        setError("Failed to load confirmed bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedBookings();
  }, [user, axiosSecure]);

  useEffect(() => {
    if (cardRefs.current.length > 0) {
      cardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              delay: i * 0.1,
              ease: "power3.out",
            }
          );
        }
      });
    }
  }, [bookings]);

  if (loading)
    return (
      <div className="text-center text-white mt-10">
        Loading confirmed bookings...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-orange-600 font-medium mt-4">{error}</p>
    );

  if (!bookings.length)
    return (
      <Card
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 10,
          p: 4,
          borderRadius: "1.5rem",
          backgroundColor: "#001f45",
          border: "2px solid white",
          textAlign: "center",
          color: "#ff7b00",
        }}
      >
        <Typography variant="h6" gutterBottom>
          No confirmed bookings found.
        </Typography>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Button
            onClick={() => navigate("/courts")}
            sx={{
              mt: 2,
              backgroundColor: "#ff7b00",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#e66b00" },
            }}
          >
            Book a Court
          </Button>
        </motion.div>
      </Card>
    );

  return (
    <Box className="min-h-screen px-4 py-10 bg-white dark:bg-black transition-colors duration-500">
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#ff7b00" }}
      >
        Confirmed Bookings
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }}
        gap={4}
        mt={4}
      >
        {bookings.map((booking, idx) => {
          const bookingDate = booking.date
            ? new Date(booking.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A";

          const slots =
            Array.isArray(booking.slots) && booking.slots.length > 0
              ? booking.slots.join(", ")
              : "N/A";

          return (
            <motion.div
              key={booking._id}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 20px 4px rgba(255,123,0,0.5)",
              }}
              transition={{ type: "spring", stiffness: 200 }}
              ref={(el) => (cardRefs.current[idx] = el)}
            >
              <Card
                sx={{
                  borderRadius: "1.5rem",
                  backgroundColor: "#001f45",
                  border: "2px solid white",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {booking.courtName}{" "}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "white" }}
                    >
                      ({booking.courtType})
                    </Typography>
                  </Typography>

                  <Box mt={1} fontSize="0.95rem" sx={{ color: "white" }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FiCalendar color="#ff7b00" />
                      {bookingDate}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <FiClock color="#ff7b00" />
                      {slots}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <FiTag color="#ff7b00" /> ${booking.price?.toFixed(2)}
                    </Box>
                  </Box>
                </CardContent>

                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                  px={2}
                  pb={2}
                >
                  <Chip
                    label={booking.isPaid ? "Paid" : "Confirmed"}
                    sx={{
                      backgroundColor: booking.isPaid ? "#22c55e" : "#ff7b00",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  />
                  {booking.isPaid && (
                    <Button
                      sx={{
                        ml: 2,
                        backgroundColor: "#ff7b00",
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#e66b00" },
                      }}
                      disabled
                    >
                      Paid
                    </Button>
                  )}
                </Box>
              </Card>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
};

export default ConfirmedBookings;
