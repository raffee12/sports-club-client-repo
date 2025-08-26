import { useEffect, useRef } from "react";
import { FaTrophy } from "react-icons/fa";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import gsap from "gsap";

const achievements = [
  {
    name: "Alice Johnson",
    achievement: "Regional Champion 2024",
    img: "/images/img1.jpg",
    details:
      "With personalized coaching and access to premium facilities, Alice honed her skills and became the Regional Champion.",
  },
  {
    name: "Brian Lee",
    achievement: "MVP Award 2023",
    img: "/images/img2.jpg",
    details:
      "Brian improved his teamwork and strategy through our competitive training sessions, earning the MVP Award.",
  },
  {
    name: "Clara Smith",
    achievement: "Best Coach Award",
    img: "/images/img3.jpg",
    details:
      "Clara guided members with dedication and innovative coaching methods, leading to her recognition as Best Coach.",
  },
  {
    name: "David Kim",
    achievement: "Tennis Champion 2024",
    img: "/images/img4.jpg",
    details:
      "With rigorous tennis drills, match simulations, and supportive mentorship, David reached championship level.",
  },
  {
    name: "Eva Martinez",
    achievement: "Top Scorer 2023",
    img: "/images/img5.jpg",
    details:
      "Eva’s scoring ability improved through club-led workshops and consistent practice, making her Top Scorer.",
  },
];

export default function Achievements() {
  const cardsRef = useRef([]);
  const overlayRef = useRef(null);

  // Entry animation
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
      }
    );
  }, []);

  // Hover animations
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    cards.forEach((card) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(card, { y: -10, scale: 1.03, duration: 0.3, ease: "power3.out" });
      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });

    if (overlayRef.current) {
      const overlayTl = gsap.timeline({ paused: true });
      overlayTl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
      const leftCard = cardsRef.current[0];
      leftCard.addEventListener("mouseenter", () => overlayTl.play());
      leftCard.addEventListener("mouseleave", () => overlayTl.reverse());
    }
  }, []);

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        py: 24,
        px: { xs: 2, md: 6 },
        bgcolor: "white",
        color: "black",
        position: "relative",
        transition: "all 0.5s",
        "@media (prefers-color-scheme: dark)": {
          bgcolor: "grey.900",
          color: "grey.100",
        },
      }}
    >
      {/* Section Title */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          color: "#f97316", // your website theme orange
          "@media (prefers-color-scheme: dark)": {
            color: "#f97316", // same orange in dark mode
          },
        }}
      >
        <FaTrophy size={40} />
        Member Achievements
      </Typography>

      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Left Large Card */}
        <Card
          ref={(el) => (cardsRef.current[0] = el)}
          sx={{
            position: "relative",
            flex: { xs: "1 1 100%", md: "2 1 60%" },
            borderRadius: 4,
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.5s",
            bgcolor: "grey.100",
            "@media (prefers-color-scheme: dark)": { bgcolor: "grey.800" },
          }}
        >
          <CardMedia
            component="img"
            image={achievements[0].img}
            alt={achievements[0].name}
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
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              px: 3,
              opacity: 0,
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {achievements[0].name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              {achievements[0].achievement}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {achievements[0].details}
            </Typography>
          </Box>
        </Card>

        {/* Right Grid */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 40%" },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gridTemplateRows: { xs: "repeat(4, 1fr)", sm: "repeat(2, 1fr)" },
            gap: 2,
          }}
        >
          {achievements.slice(1).map((item, index) => (
            <Card
              key={item.name}
              ref={(el) => (cardsRef.current[index + 1] = el)}
              sx={{
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.5s",
                bgcolor: "grey.100",
                "@media (prefers-color-scheme: dark)": { bgcolor: "grey.800" },
              }}
            >
              <CardMedia
                component="img"
                image={item.img}
                alt={item.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  bgcolor: "#001f45",
                  color: "white",
                  px: 2,
                  py: 1,
                  "@media (prefers-color-scheme: dark)": { bgcolor: "#003366" },
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                  {item.achievement}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
