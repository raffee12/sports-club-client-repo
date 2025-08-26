import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import CourtCard from "../components/CourtCard";
import BookingModal from "../components/BookingModal";

export default function CourtsPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [courts, setCourts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(""); // asc or desc
  const courtsPerPage = 6;

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await axiosSecure.get("/courts");
        setCourts(res.data);
      } catch (error) {
        console.error("Failed to fetch courts:", error);
      }
    };
    fetchCourts();
  }, [axiosSecure]);

  const sortedCourts = [...courts].sort((a, b) => {
    if (!sortOrder) return 0;
    return sortOrder === "asc"
      ? a.pricePerSession - b.pricePerSession
      : b.pricePerSession - a.pricePerSession;
  });

  const totalPages = Math.ceil(sortedCourts.length / courtsPerPage);
  const indexOfLastCourt = currentPage * courtsPerPage;
  const indexOfFirstCourt = indexOfLastCourt - courtsPerPage;
  const currentCourts = sortedCourts.slice(indexOfFirstCourt, indexOfLastCourt);

  const openBookingModal = (court) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedCourt(court);
    setModalOpen(true);
  };

  const closeBookingModal = () => {
    setModalOpen(false);
    setSelectedCourt(null);
  };

  return (
    <div className="max-full mx-auto p-6 space-y-6 transition-colors duration-500 bg-white text-black dark:bg-black dark:text-white">
      <h1 className="text-4xl font-bold text-center">🏟 Courts</h1>

      {/* Sorting */}
      <div className="max-w-6xl mx-auto flex justify-end gap-3 mb-4">
        <button
          onClick={() => setSortOrder("asc")}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            sortOrder === "asc"
              ? "bg-orange-600 text-white shadow-md hover:bg-orange-700"
              : "border-2 border-orange-600 text-orange-600 bg-transparent hover:bg-orange-600 hover:text-white"
          }`}
        >
          Price Low → High
        </button>
        <button
          onClick={() => setSortOrder("desc")}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            sortOrder === "desc"
              ? "bg-orange-600 text-white shadow-md hover:bg-orange-700"
              : "border-2 border-orange-600 text-orange-600 bg-transparent hover:bg-orange-600 hover:text-white"
          }`}
        >
          Price High → Low
        </button>
      </div>

      {/* Court Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentCourts.map((court) => (
          <CourtCard key={court._id} court={court} onBook={openBookingModal} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-30 transition"
        >
          <FiChevronLeft size={22} />
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-full font-semibold text-white transition ${
              currentPage === i + 1
                ? "bg-orange-600"
                : "bg-orange-700 hover:bg-orange-500"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 rounded-full text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-30 transition"
        >
          <FiChevronRight size={22} />
        </button>
      </div>

      {modalOpen && selectedCourt && (
        <BookingModal court={selectedCourt} onClose={closeBookingModal} />
      )}
    </div>
  );
}
