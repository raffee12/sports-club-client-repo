// src/pages/Dashboard/OverviewPage.jsx
import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import gsap from "gsap";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const COLORS = ["#FF6B00", "#FFC107", "#00C49F", "#0088FE", "#FF8042"];

const OverviewPage = () => {
  const axiosSecure = useAxiosSecure();
  const cardRefs = useRef([]);
  const chartRefs = useRef([]);

  // Fetch user's stats
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/user-stats");
      return res.data;
    },
  });

  // GSAP animations
  useEffect(() => {
    if (cardRefs.current.length) {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: "power3.out" }
      );
    }

    if (chartRefs.current.length) {
      gsap.fromTo(
        chartRefs.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
        }
      );
    }
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner text-orange-500 w-14 h-14"></span>
      </div>
    );
  }

  const bookingStatusData = stats.bookingsByStatus || [];

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-black transition-colors duration-300 flex flex-col items-center">
      {/* Page Title */}
      <Typography className="text-4xl font-extrabold mb-12 text-center text-orange-500">
        My Overview
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={8} justifyContent="center">
        {[
          { label: "Total Bookings", value: stats.totalBookings || 0 },
          { label: "Total Paid", value: `$${stats.totalPaid || 0}` },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={5} key={i}>
            <Card
              ref={(el) => (cardRefs.current[i] = el)}
              className="shadow-2xl rounded-3xl hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="text-center rounded-3xl bg-white dark:bg-[#001f45] p-10">
                <Typography className="text-xl font-semibold mb-2 text-orange-500">
                  {stat.label}
                </Typography>
                <Typography className="text-6xl font-extrabold text-orange-500">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={8} className="mt-12 justify-center">
        {/* Booking Status Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card
            ref={(el) => (chartRefs.current[0] = el)}
            className="shadow-2xl rounded-3xl p-6 bg-white dark:bg-[#001f45]"
          >
            <Typography className="text-2xl font-bold text-center mb-6 text-orange-500">
              My Bookings by Status
            </Typography>
            {bookingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography className="text-center text-gray-500 dark:text-gray-300">
                No bookings yet
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default OverviewPage;
