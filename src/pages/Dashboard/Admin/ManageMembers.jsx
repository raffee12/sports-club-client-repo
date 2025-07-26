import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageMembers = () => {
  const axiosSecure = useAxiosSecure();

  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all members from backend
  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Assuming your backend has an endpoint to get all members
      const res = await axiosSecure.get("/members"); 
      setMembers(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load members", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle deleting a member
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This member will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.delete(`/members/${id}`);
        Swal.fire("Deleted!", "Member has been removed.", "success");
        fetchMembers();
      } catch (error) {
        Swal.fire("Error", "Failed to delete member", "error");
      }
    }
  };

  // Filter members by search term (case-insensitive)
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <div className="text-center text-gray-700 py-10">Loading members...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center mb-6">Manage Members</h2>

        <input
          type="text"
          placeholder="Search members by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w-md mx-auto block bg-white/90 text-gray-900 rounded-xl placeholder-gray-500 focus:outline-indigo-500 focus:ring-2 focus:ring-indigo-400 transition"
        />

        {filteredMembers.length === 0 ? (
          <p className="text-center text-indigo-200 mt-8 font-semibold">
            No members found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/20 shadow-lg mt-4">
            <table className="table w-full text-gray-200">
              <thead className="bg-indigo-800/90">
                <tr>
                  <th className="border border-indigo-700 px-3 py-2">Name</th>
                  <th className="border border-indigo-700 px-3 py-2">Email</th>
                  <th className="border border-indigo-700 px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member._id}
                    className="hover:bg-indigo-700/50 transition cursor-default"
                  >
                    <td className="border border-indigo-700 px-4 py-3 font-semibold capitalize">
                      {member.name}
                    </td>
                    <td className="border border-indigo-700 px-4 py-3 lowercase">
                      {member.email}
                    </td>
                    <td className="border border-indigo-700 px-4 py-3 flex justify-center gap-3">
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="btn btn-error btn-sm text-white hover:bg-red-700 rounded-xl shadow-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMembers;
