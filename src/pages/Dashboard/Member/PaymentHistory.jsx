import React, { useEffect, useState, useRef } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table");
  const cardRefs = useRef([]);
  const tableRowRefs = useRef([]);

  const isDarkMode = document.body.classList.contains("dark");

  useEffect(() => {
    if (!user?.email) return;

    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get(`/payments/user/${user.email}`);
        setPayments(res.data || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, axiosSecure]);

  // Animate card view
  useEffect(() => {
    if (view === "card" && cardRefs.current.length > 0) {
      cardRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: i * 0.05, ease: "power3.out" }
          );
        }
      });
    }
  }, [payments, view]);

  // Animate table rows
  useEffect(() => {
    if (view === "table" && tableRowRefs.current.length > 0) {
      tableRowRefs.current.forEach((row, i) => {
        if (row) {
          gsap.fromTo(
            row,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, delay: i * 0.05, ease: "power3.out" }
          );
        }
      });
    }
  }, [payments, view]);

  if (loading)
    return (
      <p className="text-center text-white mt-10">Loading payment history...</p>
    );

  return (
    <div className="p-4 min-h-screen flex justify-center items-start bg-gradient-to-b from-[#001f45] to-[#0a2647]">
      <div className="w-full max-w-6xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#ff7b00" }}>
            Payment History
          </Typography>

          <Button
            onClick={() => setView(view === "table" ? "card" : "table")}
            sx={{
              color: "#ff7b00",
              borderColor: "#ff7b00",
              borderWidth: 2,
              "&:hover": { backgroundColor: "#ff7b0020", borderColor: "#ff7b00" },
            }}
            variant="outlined"
          >
            {view === "table" ? "Card View" : "Table View"}
          </Button>
        </div>

        {payments.length === 0 ? (
          <Card
            sx={{
              maxWidth: 600,
              mx: "auto",
              mt: 10,
              p: 6,
              borderRadius: "1.5rem",
              backgroundColor: isDarkMode ? "#000" : "#fff",
              color: "#ff7b00",
              textAlign: "center",
              boxShadow: isDarkMode
                ? "0 0 15px 3px rgba(255,123,0,0.6)"
                : "0 0 10px 2px rgba(255,123,0,0.4)",
            }}
          >
            <Typography variant="h6">No payments found.</Typography>
          </Card>
        ) : view === "table" ? (
          <Box
            sx={{
              overflowX: "auto",
              borderRadius: "1rem",
              border: "1px solid #ff7b00",
              boxShadow: isDarkMode
                ? "0 0 15px 3px rgba(255,123,0,0.5)"
                : "0 0 10px 2px rgba(255,123,0,0.3)",
            }}
          >
            <table
              className="min-w-full"
              style={{
                backgroundColor: isDarkMode ? "#000" : "#fff",
                color: "#ff7b00",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead
                style={{
                  backgroundColor: isDarkMode ? "#111" : "#fff",
                  color: "#ff7b00",
                }}
              >
                <tr>
                  {[
                    "Transaction ID",
                    "Court",
                    "Date",
                    "Slots",
                    "Paid",
                    "Discount",
                    "Method",
                  ].map((h) => (
                    <th key={h} className="p-3 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr
                    key={p._id}
                    ref={(el) => (tableRowRefs.current[i] = el)}
                    className="hover:brightness-125 transition-all duration-200"
                  >
                    <td className="p-3 font-mono text-sm">{p.transactionId}</td>
                    <td className="p-3">{p.courtName || "N/A"}</td>
                    <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="p-3">{p.slots?.join(", ") || "N/A"}</td>
                    <td className="p-3 font-bold text-green-300">
                      ${p.discountedPrice?.toFixed(2)}
                    </td>
                    <td className="p-3">{p.discountApplied ? `${p.discountApplied}%` : "—"}</td>
                    <td className="p-3 capitalize">{p.paymentMethod?.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
            gap={4}
          >
            {payments.map((p, idx) => (
              <motion.div
                key={p._id}
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px 4px rgba(255,123,0,0.5)" }}
                transition={{ type: "spring", stiffness: 200 }}
                ref={(el) => (cardRefs.current[idx] = el)}
              >
                <Card
                  sx={{
                    borderRadius: "1.5rem",
                    p: 4,
                    backgroundColor: isDarkMode ? "#000" : "#fff",
                    color: "#ff7b00",
                    border: "1px solid #ff7b00",
                    boxShadow: isDarkMode
                      ? "0 0 15px 3px rgba(255,123,0,0.5)"
                      : "0 0 10px 2px rgba(255,123,0,0.3)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: "#ff7b00" }}>
                    Transaction
                  </Typography>
                  <Typography variant="body2" className="font-mono truncate">
                    {p.transactionId}
                  </Typography>

                  <Box mt={2} display="grid" gridTemplateColumns="1fr 1fr" gap={1} fontSize="0.9rem">
                    <span className="font-semibold">Court:</span>
                    <span>{p.courtName}</span>
                    <span className="font-semibold">Date:</span>
                    <span>{new Date(p.date).toLocaleDateString()}</span>
                    <span className="font-semibold">Slots:</span>
                    <span>{p.slots?.join(", ") || "N/A"}</span>
                    <span className="font-semibold">Paid:</span>
                    <span className="text-green-300">${p.discountedPrice?.toFixed(2)}</span>
                    <span className="font-semibold">Discount:</span>
                    <span>{p.discountApplied ? `${p.discountApplied}%` : "—"}</span>
                    <span className="font-semibold">Method:</span>
                    <span>{p.paymentMethod?.join(", ")}</span>
                  </Box>
                </Card>
              </motion.div>
            ))}
          </Box>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
