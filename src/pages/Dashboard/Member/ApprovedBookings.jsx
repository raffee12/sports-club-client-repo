import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiCalendar,
  FiClock,
  FiTag,
  FiTrash2,
  FiDollarSign,
} from "react-icons/fi";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

export default function ApprovedBookings() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);
  const cardRefs = useRef([]);

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["approvedBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings?userEmail=${user.email}`);
      return res.data.filter((b) => b.status === "approved");
    },
  });

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

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "This will remove your approved booking.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#ff7b00",
      cancelButtonColor: "#001f45",
    });

    if (result.isConfirmed) {
      try {
        setProcessingId(id);
        await axiosSecure.delete(`/bookings/${id}`);
        await refetch();
        Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
      } catch (err) {
        Swal.fire("Error", "Something went wrong!", "error");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handlePayment = (booking) => {
    navigate("/dashboard/member/pay", { state: { booking } });
  };

  if (isLoading) {
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
  }

  if (isError) {
    return (
      <Typography color="error" align="center" fontWeight="bold">
        Failed to load approved bookings.
      </Typography>
    );
  }

  return (
    <Box className="min-h-screen px-4 py-10 bg-white dark:bg-black transition-colors duration-500">
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#ff7b00" }}
      >
        Approved Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Card
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 4,
            p: 4,
            borderRadius: "1.5rem",
            backgroundColor: "#001f45",
            border: "2px solid white",
            color: "#ff7b00",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            No approved bookings at the moment.
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
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }}
          gap={4}
          mt={4}
        >
          {bookings.map((booking, idx) => {
            const bookingDate = booking.date || "";
            const slots =
              Array.isArray(booking.slots) && booking.slots.length > 0
                ? booking.slots.join(", ")
                : "No slot";

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
                    color: "#ff7b00",
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
                        {new Date(bookingDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
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
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    pb={2}
                  >
                    <Chip
                      label={booking.isPaid ? "Paid" : "Approved"}
                      sx={{
                        backgroundColor: booking.isPaid ? "#22c55e" : "#ff7b00",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />

                    <Box display="flex" gap={1}>
                      {!booking.isPaid && (
                        <Button
                          variant="contained"
                          onClick={() => handlePayment(booking)}
                          startIcon={<FiDollarSign />}
                          sx={{
                            backgroundColor: "#ff7b00",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#e66b00" },
                          }}
                        >
                          Pay Now
                        </Button>
                      )}

                      <Button
                        onClick={() => handleCancel(booking._id)}
                        disabled={processingId === booking._id}
                        startIcon={<FiTrash2 />}
                        sx={{
                          backgroundColor: "#ff7b00",
                          color: "white",
                          fontWeight: "bold",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#e66b00" },
                          opacity: processingId === booking._id ? 0.6 : 1,
                        }}
                      >
                        {processingId === booking._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
