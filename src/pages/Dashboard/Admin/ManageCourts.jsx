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
      id: "",
      name: "",
      category: "",
      type: "",
      description: "",
      maxPlayers: "",
      status: "available",
      sessionDuration: 60,
      pricePerSession: "",
      slots: [{ time: "" }],
      imageFile: null,
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
        category: data.category,
        type: data.type,
        description: data.description,
        maxPlayers: data.maxPlayers ? Number(data.maxPlayers) : null,
        status: data.status,
        sessionDuration: Number(data.sessionDuration),
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
      <div className="max-w-4xl mx-auto space-y-12">
        <h2 className="text-3xl font-extrabold text-center tracking-wide drop-shadow-lg">
          Manage Courts
        </h2>

        {/* Court Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/15 p-7 rounded-3xl shadow-2xl space-y-6 border border-white/30 backdrop-blur-lg"
        >
          {/* Court ID */}
          <input
            type="text"
            placeholder="Court ID"
            {...register("id", { required: "Court ID is required" })}
            className="input input-bordered w-full bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          />
          {errors.id && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              {errors.id.message}
            </p>
          )}

          {/* Court Name */}
          <input
            type="text"
            placeholder="Court Name"
            {...register("name", { required: "Court name is required" })}
            className="input input-bordered w-full bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              {errors.name.message}
            </p>
          )}

          {/* Court Category (Sport Type) */}
          <select
            {...register("category", { required: "Court category is required" })}
            className="select select-bordered w-full bg-white/90 text-gray-900 rounded-xl focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="tennis">Tennis</option>
            <option value="badminton">Badminton</option>
            <option value="squash">Squash</option>
            <option value="basketball">Basketball</option>
            {/* add more as needed */}
          </select>
          {errors.category && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              {errors.category.message}
            </p>
          )}

          {/* Court Type (Indoor/Outdoor) */}
          <select
            {...register("type", { required: "Court type is required" })}
            className="select select-bordered w-full bg-white/90 text-gray-900 rounded-xl focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
          {errors.type && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              {errors.type.message}
            </p>
          )}

          {/* Description */}
          <textarea
            placeholder="Description (optional)"
            {...register("description")}
            className="textarea textarea-bordered w-full bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 resize-none h-20"
          />

          {/* Max Players */}
          <input
            type="number"
            placeholder="Max Players (optional)"
            {...register("maxPlayers", {
              min: { value: 1, message: "Must be at least 1" },
            })}
            className="input input-bordered w-full bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          />
          {errors.maxPlayers && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              {errors.maxPlayers.message}
            </p>
          )}

          {/* Availability Status */}
          <select
            {...register("status")}
            className="select select-bordered w-full bg-white/90 text-gray-900 rounded-xl focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="available">Available</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="closed">Closed</option>
          </select>

          {/* Session Duration */}
          <input
            type="number"
            placeholder="Session Duration (minutes)"
            {...register("sessionDuration", {
              required: "Session duration is required",
              min: { value: 15, message: "Minimum 15 minutes" },
            })}
            className="input input-bordered w-full bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          />
          {errors.sessionDuration && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              {errors.sessionDuration.message}
            </p>
          )}

          {/* Price Per Session */}
          <input
            type="number"
            placeholder="Price per Session"
            {...register("pricePerSession", {
              required: "Price per session is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            className="input input-bordered w-full bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
          />
          {errors.pricePerSession && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              {errors.pricePerSession.message}
            </p>
          )}

          {/* Slots - dynamic array */}
          <label className="block font-semibold mb-2 mt-4 text-indigo-200 tracking-wide">
            Slots
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 mb-3 items-center">
              <input
                type="text"
                placeholder="e.g. 9:00 AM"
                {...register(`slots.${index}.time`, { required: true })}
                className="input input-bordered flex-grow bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-error btn-xs text-white hover:bg-red-700 rounded-xl shadow-md transition flex items-center gap-1"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ time: "" })}
            className="btn btn-outline btn-sm text-indigo-300 border-indigo-400 hover:bg-indigo-700 rounded-xl transition mb-5"
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
            className="file-input file-input-bordered w-full bg-white/90 text-gray-900 rounded-xl"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-28 h-28 rounded-xl object-cover border-2 border-indigo-500 mt-3 shadow-lg"
            />
          )}

          <button
            type="submit"
            className="btn btn-gradient w-full text-lg font-semibold tracking-wide rounded-xl shadow-lg"
          >
            Add Court
          </button>
        </form>

        {/* Courts Table */}
        <div className="bg-white/15 p-7 rounded-3xl shadow-2xl border border-white/30 backdrop-blur-lg">
          <h3 className="text-2xl font-extrabold mb-6 text-indigo-200 tracking-wide drop-shadow-md">
            All Courts
          </h3>
          <div className="overflow-x-auto rounded-lg border border-indigo-600 shadow-inner">
            <table className="table w-full text-gray-200 text-sm md:text-base">
              <thead className="bg-indigo-900/90 text-indigo-300">
                <tr>
                  <th className="border border-indigo-700">ID</th>
                  <th className="border border-indigo-700">Name</th>
                  <th className="border border-indigo-700">Category</th>
                  <th className="border border-indigo-700">Type</th>
                  <th className="border border-indigo-700">Price/Session</th>
                  <th className="border border-indigo-700">Slots</th>
                  <th className="border border-indigo-700">Status</th>
                  <th className="border border-indigo-700">Max Players</th>
                  <th className="border border-indigo-700">Duration (min)</th>
                  <th className="border border-indigo-700">Image</th>
                  <th className="border border-indigo-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courts.length > 0 ? (
                  courts.map((court) => (
                    <tr
                      key={court._id}
                      className="hover:bg-indigo-800/40 transition-colors text-gray-900 font-semibold"
                    >
                      <td className="border border-indigo-700 px-3 py-2">{court.id}</td>
                      <td className="border border-indigo-700 px-3 py-2">{court.name}</td>
                      <td className="border border-indigo-700 px-3 py-2 capitalize">{court.category}</td>
                      <td className="border border-indigo-700 px-3 py-2 capitalize">{court.type}</td>
                      <td className="border border-indigo-700 px-3 py-2">${court.pricePerSession}</td>
                      <td className="border border-indigo-700 px-3 py-2 max-w-xs whitespace-normal">
                        {court.slots?.join(", ")}
                      </td>
                      <td className="border border-indigo-700 px-3 py-2 capitalize">{court.status}</td>
                      <td className="border border-indigo-700 px-3 py-2">
                        {court.maxPlayers ?? "—"}
                      </td>
                      <td className="border border-indigo-700 px-3 py-2">{court.sessionDuration}</td>
                      <td className="border border-indigo-700 px-3 py-2">
                        <img
                          src={court.image}
                          alt={court.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                      </td>
                      <td className="border border-indigo-700 px-3 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(court._id)}
                          className="btn btn-xs bg-red-600 text-white hover:bg-red-700 rounded-xl shadow-md flex items-center gap-1 transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="11"
                      className="text-center text-indigo-300 py-10 font-semibold"
                    >
                      No courts available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <style>{`
          .btn-gradient {
            background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.6);
            transition: all 0.3s ease;
          }
          .btn-gradient:hover {
            background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%);
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.8);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ManageCourts;
