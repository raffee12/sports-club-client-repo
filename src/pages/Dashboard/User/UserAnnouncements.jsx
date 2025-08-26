import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiBell } from "react-icons/fi";
import gsap from "gsap";

export default function UserAnnouncements() {
  const {
    data: announcements = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userAnnouncements"],
    queryFn: async () => {
      const res = await axios.get(
        "https://sports-server-brown.vercel.app/announcements"
      );
      return res.data;
    },
  });

  const cardRefs = useRef([]);

  useEffect(() => {
    if (cardRefs.current.length > 0) {
      gsap.fromTo(
        cardRefs.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, [announcements]);

  if (isLoading)
    return (
      <p className="text-center mt-10 animate-pulse text-[#001f45] dark:text-orange-400">
        Loading announcements...
      </p>
    );

  if (isError)
    return (
      <p className="text-center mt-10 text-red-600 dark:text-red-400">
        Failed to load announcements.
      </p>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2 text-[#001f45] dark:text-orange-400 mb-6">
        <FiBell size={28} /> Club Announcements
      </h2>

      {announcements.length === 0 ? (
        <p className="text-center italic text-gray-500 dark:text-gray-400">
          No announcements at the moment.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map(({ _id, title, description, createdAt }, idx) => (
            <div
              key={_id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="bg-white dark:bg-black border border-[#001f45] dark:border-orange-400 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 mb-2 text-[#001f45] dark:text-orange-400 font-semibold">
                <FiBell size={20} />
                <h3 className="text-lg">{title}</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line mb-3">
                {description}
              </p>
              {createdAt && (
                <p className="text-sm italic text-gray-400 dark:text-gray-500">
                  Posted on{" "}
                  {new Date(createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
