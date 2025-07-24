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
  const courtsPerPage = 6;

  // Fetch courts from backend
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await axiosSecure.get("/courts");
        setCourts(res.data); // No modification
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch courts:", error);
      }
    };
    fetchCourts();
  }, [axiosSecure]);

  const totalPages = Math.ceil(courts.length / courtsPerPage);
  const indexOfLastCourt = currentPage * courtsPerPage;
  const indexOfFirstCourt = indexOfLastCourt - courtsPerPage;
  const currentCourts = courts.slice(indexOfFirstCourt, indexOfLastCourt);

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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">
        🏟 Courts
      </h1>

      {/* Court Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {currentCourts.map((court) => (
          <CourtCard
            key={court._id}
            court={court}
            onBook={(slot) =>
              openBookingModal({ ...court, selectedSlot: slot })
            }
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-full text-white bg-yellow-500 hover:bg-orange-500 disabled:opacity-30 transition"
        >
          <FiChevronLeft size={22} />
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-10 h-10 rounded-full font-semibold text-white transition ${
              currentPage === i + 1
                ? "bg-orange-500"
                : "bg-yellow-500 hover:bg-orange-500"
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
          className="p-2 rounded-full text-white bg-yellow-500 hover:bg-orange-500 disabled:opacity-30 transition"
        >
          <FiChevronRight size={22} />
        </button>
      </div>

      {/* Booking Modal */}
      {modalOpen && selectedCourt && (
        <BookingModal court={selectedCourt} onClose={closeBookingModal} />
      )}
    </div>
  );
}
