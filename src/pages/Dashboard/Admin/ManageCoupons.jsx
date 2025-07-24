import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const ManageCoupons = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchCoupons = async () => {
    try {
      const res = await axiosSecure.get("/coupons");
      setCoupons(res.data);
      setCurrentPage(1); // Reset to first page on fetch
    } catch {
      Swal.fire("Error!", "Failed to fetch coupons", "error");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      code: data.code,
      discount: parseFloat(data.discount),
      expiresAt: new Date(data.expiresAt),
    };

    try {
      if (editingId) {
        await axiosSecure.patch(`/coupons/${editingId}`, payload);
        Swal.fire("Updated!", "Coupon updated successfully", "success");
        setEditingId(null);
      } else {
        await axiosSecure.post("/coupons", payload);
        Swal.fire("Created!", "Coupon added successfully", "success");
      }
      reset();
      fetchCoupons();
    } catch (error) {
      console.error(
        "Coupon operation error:",
        error.response?.data || error.message
      );
      Swal.fire("Error!", "Operation failed", "error");
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setValue("code", coupon.code);
    setValue("discount", coupon.discount);
    setValue(
      "expiresAt",
      new Date(coupon.expiresAt).toISOString().split("T")[0]
    );
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This coupon will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/coupons/${id}`);
        Swal.fire("Deleted!", "Coupon deleted", "success");
        fetchCoupons();
      } catch {
        Swal.fire("Error!", "Failed to delete", "error");
      }
    }
  };

  const paginatedCoupons = coupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-4xl font-extrabold text-center tracking-tight">
          🎟️ Manage Coupons
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white bg-opacity-10 text-gray-200 rounded-3xl shadow-2xl p-8 space-y-6 backdrop-blur-xl border border-white/20"
        >
          <input
            type="text"
            placeholder="Coupon Code"
            {...register("code", { required: true })}
            className="input input-lg w-full border border-indigo-500 rounded-xl bg-white/80 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Discount (%)"
            {...register("discount", { required: true })}
            className="input input-lg w-full border border-indigo-500 rounded-xl bg-white/80 text-black placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 no-arrow"
          />
          <div className="relative w-full rounded-xl">
            <input
              type="date"
              {...register("expiresAt", { required: true })}
              className="input input-lg w-full border border-indigo-500 rounded-xl bg-white/80 text-black pr-12 focus:ring-2 focus:ring-indigo-500"
            />
            <FiCalendar
              className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-700 pointer-events-none"
              size={22}
            />
          </div>

          <button
            type="submit"
            className="btn btn-gradient w-full py-3 text-lg font-semibold rounded-xl text-white shadow-xl tracking-wide"
          >
            {editingId ? "Update Coupon" : "Add Coupon"}
          </button>
        </form>

        {/* TABLE */}
        <div className="bg-white/10 text-white rounded-3xl shadow-xl p-6 backdrop-blur-xl border border-white/20">
          <h3 className="text-2xl font-bold mb-4 text-center tracking-tight">
            Available Coupons
          </h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-sm md:text-base">
              <thead className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white rounded-t-xl">
                <tr>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Discount</th>
                  <th className="px-4 py-2">Expires At</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCoupons.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-white hover:text-black transition"
                  >
                    <td className="px-4 py-3">{c.code}</td>
                    <td className="px-4 py-3">{c.discount}%</td>
                    <td className="px-4 py-3">
                      {new Date(c.expiresAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(c)}
                        className="btn btn-xs rounded bg-yellow-400 text-black hover:bg-yellow-500 flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="btn btn-xs rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedCoupons.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-gray-300 py-8">
                      No coupons available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                  className="bg-indigo-700 text-white px-2 py-1 rounded-full hover:bg-indigo-600"
                >
                  <MdKeyboardArrowLeft size={22} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-800 hover:bg-indigo-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                  className="bg-indigo-700 text-white px-2 py-1 rounded-full hover:bg-indigo-600"
                >
                  <MdKeyboardArrowRight size={22} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          .btn-gradient {
            background: linear-gradient(90deg, #8b5cf6, #6366f1, #3b82f6);
            transition: all 0.3s ease;
          }
          .btn-gradient:hover {
            background: linear-gradient(90deg, #7c3aed, #4f46e5, #2563eb);
            transform: scale(1.02);
          }
          .no-arrow::-webkit-outer-spin-button,
          .no-arrow::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .no-arrow {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </div>
  );
};

export default ManageCoupons;
