import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MakeAnnouncement = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const axiosSecure = useAxiosSecure();
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination config
  const firstPageCount = 1;
  const otherPageCount = 4;

  const fetchAnnouncements = async () => {
    try {
      const res = await axiosSecure.get("/announcements");
      setAnnouncements(res.data);
    } catch {
      Swal.fire("Error!", "Failed to fetch announcements.", "error");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axiosSecure.patch(`/announcements/${editingId}`, data);
        Swal.fire("Updated!", "Announcement updated.", "success");
        setEditingId(null);
      } else {
        await axiosSecure.post("/announcements", data);
        Swal.fire("Success!", "Announcement created.", "success");
      }
      reset();
      fetchAnnouncements();
      setCurrentPage(1); // reset to first page after update/add
    } catch {
      Swal.fire("Error!", "Operation failed.", "error");
    }
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setValue("title", a.title);
    setValue("description", a.description);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the announcement!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#6b7280",
      confirmButtonColor: "#ef4444",
      customClass: {
        popup: "shadow-2xl rounded-lg",
      },
    });

    if (res.isConfirmed) {
      try {
        await axiosSecure.delete(`/announcements/${id}`);
        Swal.fire("Deleted!", "Announcement has been deleted.", "success");
        fetchAnnouncements();
        setCurrentPage(1); // reset page to 1 after delete
      } catch {
        Swal.fire("Error!", "Failed to delete.", "error");
      }
    }
  };

  // Calculate pagination
  const totalAnnouncements = announcements.length;
  // Total pages: 1 for first page + remaining announcements split by otherPageCount
  const totalPages =
    totalAnnouncements <= firstPageCount
      ? 1
      : 1 + Math.ceil((totalAnnouncements - firstPageCount) / otherPageCount);

  // Compute announcements to show for current page
  let paginatedAnnouncements = [];

  if (currentPage === 1) {
    paginatedAnnouncements = announcements.slice(0, firstPageCount);
  } else {
    const startIndex = firstPageCount + (currentPage - 2) * otherPageCount;
    paginatedAnnouncements = announcements.slice(
      startIndex,
      startIndex + otherPageCount
    );
  }

  // Pagination buttons array
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-blue-900 to-cyan-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <h2 className="text-4xl font-extrabold text-center drop-shadow-lg">
          📢 Make Announcement
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl p-8 max-w-3xl mx-auto space-y-6 backdrop-blur-md border border-white/20"
          style={{ transition: "background-color 0.3s ease" }}
          noValidate
        >
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: true })}
            className="input input-bordered input-lg w-full rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
          <textarea
            placeholder="Description"
            {...register("description", { required: true })}
            className="textarea textarea-bordered textarea-lg w-full rounded-xl shadow-md resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            rows={5}
          />
          <button
            type="submit"
            className="btn btn-gradient btn-lg w-full rounded-xl tracking-wide font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {editingId ? "Update" : "Post"} Announcement
          </button>
        </form>

        <section className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-6 max-w-5xl mx-auto border border-white/20 backdrop-blur-md">
          <h3 className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100 drop-shadow-sm">
            📜 Announcements (Page {currentPage} of {totalPages})
          </h3>

          <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
            <table className="table-auto w-full min-w-[600px] border-collapse">
              <thead className="bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 text-white text-left rounded-t-xl">
                <tr>
                  <th className="py-3 px-6 font-semibold">Title</th>
                  <th className="py-3 px-6 font-semibold">Description</th>
                  <th className="py-3 px-6 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
                {paginatedAnnouncements.length > 0 ? (
                  paginatedAnnouncements.map((a) => (
                    <tr
                      key={a._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <td className="py-4 px-6 font-medium">{a.title}</td>
                      <td className="py-4 px-6">{a.description}</td>
                      <td className="py-4 px-6 flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(a)}
                          className="btn btn-warning btn-sm rounded-lg shadow-md hover:scale-110 transform transition duration-200"
                          aria-label={`Edit ${a.title}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="btn btn-error btn-sm rounded-lg shadow-md hover:scale-110 transform transition duration-200"
                          aria-label={`Delete ${a.title}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-10 text-center text-gray-500 dark:text-gray-400 italic"
                    >
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <nav
            className="flex justify-center mt-6 space-x-3 select-none"
            aria-label="Pagination"
          >
            <button
              className="btn btn-sm btn-outline rounded-lg"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous Page"
            >
              Prev
            </button>

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`btn btn-sm rounded-lg ${
                  page === currentPage
                    ? "btn-primary"
                    : "btn-outline hover:btn-primary"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline rounded-lg"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next Page"
            >
              Next
            </button>
          </nav>
        </section>
      </div>

      {/* Custom styles for button gradients */}
      <style>
        {`
          .btn-gradient {
            background: linear-gradient(90deg, #4f46e5, #3b82f6, #06b6d4);
            box-shadow: 0 10px 15px -3px rgb(59 130 246 / 0.4), 0 4px 6px -2px rgb(14 165 233 / 0.4);
          }
          .btn-gradient:hover {
            background: linear-gradient(90deg, #4338ca, #2563eb, #0891b2);
          }
        `}
      </style>
    </div>
  );
};

export default MakeAnnouncement;
