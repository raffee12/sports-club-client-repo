import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

const blogs = [
  {
    id: 1,
    title: "How to Improve in Basketball",
    description:
      "Essential drills and tips to become a better basketball player.",
    image: "https://source.unsplash.com/600x400/?basketball",
  },
  {
    id: 2,
    title: "Indoor Games for Mental Sharpness",
    description: "Explore indoor games that help improve focus and strategy.",
    image: "https://source.unsplash.com/600x400/?chess",
  },
  {
    id: 3,
    title: "Outdoor Activities to Stay Fit",
    description: "Fun and effective outdoor games to keep your body active.",
    image: "https://source.unsplash.com/600x400/?football",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-500 dark:text-white mb-10">
          Sports Blogs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.image}
                  alt={blog.title}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    className="text-deepBlue-500 dark:text-orange-400 font-semibold"
                  >
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 dark:text-gray-300 mt-2"
                  >
                    {blog.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    className="mt-4 text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
