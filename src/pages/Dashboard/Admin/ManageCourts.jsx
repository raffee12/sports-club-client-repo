import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const ManageCourts = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      slots: [{ time: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slots",
  });

  const [courts, setCourts] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch courts from backend
  const fetchCourts = async () => {
    try {
      const res = await axiosSecure.get("/courts");
      setCourts(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load courts", "error");
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  // Handle form submit to add new court
  const onSubmit = async (data) => {
    try {
      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const imageFile = data.imageFile[0];

      const formData = new FormData();
      formData.append("image", imageFile);

      // Upload image using plain axios (external service)
      const imgbbRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );
      const imageUrl = imgbbRes.data.data.url;

      // Map slots array of objects to array of strings
      const slotsArray = data.slots.map((slot) => slot.time).filter(Boolean);

      if (slotsArray.length === 0) {
        Swal.fire("Error", "At least one slot is required", "error");
        return;
      }

      const newCourt = {
        id: data.id,
        name: data.name,
        type: data.type,
        image: imageUrl,
        slots: slotsArray,
        pricePerSession: Number(data.pricePerSession),
      };

      await axiosSecure.post("/courts", newCourt);

      Swal.fire("Success!", "Court added successfully", "success");
      reset();
      setPreviewUrl("");
      fetchCourts();
    } catch (error) {
      Swal.fire("Error!", "Could not add court", "error");
    }
  };

  // Handle deleting a court
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This court will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/courts/${id}`);
        Swal.fire("Deleted!", "Court has been removed.", "success");
        fetchCourts();
      } catch (error) {
        Swal.fire("Error", "Failed to delete court", "error");
      }
    }
  };

  if (!user || loading)
    return <div className="text-center text-white py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-10 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-center">Manage Courts</h2>

        {/* Court Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/10 p-6 rounded-2xl shadow-xl space-y-4 border border-white/20 backdrop-blur-xl"
        >
          {/* ID */}
          <input
            type="text"
            placeholder="Court ID"
            {...register("id", { required: "Court ID is required" })}
            className="input input-bordered w-full bg-white/80 text-black rounded-lg"
          />
          {errors.id && (
            <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>
          )}

          {/* Name */}
          <input
            type="text"
            placeholder="Court Name"
            {...register("name", { required: "Court name is required" })}
            className="input input-bordered w-full bg-white/80 text-black rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}

          {/* Type */}
          <select
            {...register("type", { required: "Court type is required" })}
            className="select select-bordered w-full bg-white/80 text-black rounded-lg"
          >
            <option value="">Select Type</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
          )}

          {/* Price Per Session */}
          <input
            type="number"
            placeholder="Price per Session"
            {...register("pricePerSession", {
              required: "Price per session is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="input input-bordered w-full bg-white/80 text-black rounded-lg"
          />
          {errors.pricePerSession && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pricePerSession.message}
            </p>
          )}

          {/* Slots - dynamic array */}
          <label className="block font-semibold mb-1 mt-3">Slots</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                placeholder="e.g. 9:00 AM"
                {...register(`slots.${index}.time`, { required: true })}
                className="input input-bordered flex-grow bg-white/80 text-black rounded-lg"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-error btn-xs text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ time: "" })}
            className="btn btn-outline btn-sm text-white mb-4"
          >
            + Add Slot
          </button>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            {...register("imageFile", {
              required: "Court image is required",
              onChange: (e) => {
                if (e.target.files[0]) {
                  setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                }
              },
            })}
            className="file-input file-input-bordered w-full"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border mt-2"
            />
          )}

          <button
            type="submit"
            className="btn btn-gradient w-full text-lg mt-4"
          >
            Add Court
          </button>
        </form>

        {/* Courts Table */}
        <div className="bg-white/10 p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-xl">
          <h3 className="text-2xl font-semibold mb-4">All Courts</h3>
          <div className="overflow-x-auto">
            <table className="table w-full text-white text-sm md:text-base">
              <thead className="bg-indigo-800 text-white">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price/Session</th>
                  <th>Slots</th>
                  <th>Image</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courts.length > 0 ? (
                  courts.map((court) => (
                    <tr
                      key={court._id}
                      className="hover:bg-gray-100 text-black transition"
                    >
                      <td>{court.id}</td>
                      <td>{court.name}</td>
                      <td>{court.type}</td>
                      <td>${court.pricePerSession}</td>
                      <td>{court.slots?.join(", ")}</td>
                      <td>
                        <img
                          src={court.image}
                          alt={court.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="flex justify-center gap-2 py-2">
                        <button
                          onClick={() => handleDelete(court._id)}
                          className="btn btn-xs bg-red-600 text-white hover:bg-red-700 rounded flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-gray-300 py-6">
                      No courts available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .btn-gradient {
          background: linear-gradient(to right, #8b5cf6, #6366f1, #3b82f6);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover {
          background: linear-gradient(to right, #7c3aed, #4f46e5, #2563eb);
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default ManageCourts;
