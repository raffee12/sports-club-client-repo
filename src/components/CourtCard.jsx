import React, { useRef, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function CourtCard({ court, onBook }) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);

  // GSAP entry animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  // Hover animation
  useEffect(() => {
    if (cardRef.current) {
      const tl = gsap.timeline({ paused: true });
      tl.to(cardRef.current, {
        scale: 1.05,
        y: -10,
        duration: 0.3,
        ease: "power3.out",
      });
      tl.to(
        overlayRef.current,
        { opacity: 1, duration: 0.3, ease: "power3.out" },
        "<"
      );

      const card = cardRef.current;
      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card
        sx={{
          position: "relative",
          height: 320,
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          bgcolor: "white",
          color: "black",
          border: "2px solid #f97316", // orange base border
          boxShadow: 6,
          transition: "all 0.3s",
          "&:hover": { boxShadow: 12 },
          "@media (prefers-color-scheme: dark)": {
            bgcolor: "#001f45", // deep blue in dark mode
            color: "white",
            border: "2px solid #f97316",
          },
        }}
      >
        <Box sx={{ position: "relative", height: 160 }}>
          <CardMedia
            component="img"
            image={court.image || "/images/default-court.jpg"}
            alt={court.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Overlay */}
          <Box
            ref={overlayRef}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(249,115,22,0.75)", // semi-transparent orange
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              opacity: 0,
              px: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {court.name}
            </Typography>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                mt: 1,
                "@media (prefers-color-scheme: dark)": {
                  color: "#f97316", // orange for dark mode
                  fontWeight: "bold",
                },
              }}
            >
              ${court.pricePerSession}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: "1.1rem" }}
          >
            {court.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              "@media (prefers-color-scheme: dark)": {
                color: "#f97316",
                fontWeight: "bold",
              },
            }}
          >
            Price: ${court.pricePerSession}
          </Typography>
          <Button
            variant="contained"
            onClick={() => onBook(court)}
            sx={{
              mt: 1,
              bgcolor: "#f97316", // orange base
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": { bgcolor: "#ea5806" }, // deeper orange on hover
            }}
          >
            Book Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
