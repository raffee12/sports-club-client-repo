import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function UserAnnouncements() {
  const {
    data: announcements = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userAnnouncements"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/announcements");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-center text-gray-600 mt-10 animate-pulse">
        Loading announcements...
      </p>
    );
  if (isError)
    return (
      <p className="text-center text-red-600 mt-10">
        Failed to load announcements.
      </p>
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-[#001f45] mb-6 text-center">
        Club Announcements
      </h2>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No announcements at the moment.
        </p>
      ) : (
        announcements.map(({ _id, title, description, createdAt }) => (
          <div
            key={_id}
            className="bg-white border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-[#001f45] mb-2">
              {title}
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{description}</p>
            {createdAt && (
              <p className="text-sm text-gray-400 mt-3 italic">
                Posted on{" "}
                {new Date(createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
