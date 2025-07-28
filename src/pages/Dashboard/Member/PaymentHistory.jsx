import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

export default function PaymentPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [view, setView] = useState("table"); // table | card

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/payments/user?email=${user.email}`)
        .then((res) => setPayments(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, axiosSecure]);

  const toggleView = () => {
    setView((prev) => (prev === "table" ? "card" : "table"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001f45] to-[#003f73] px-4 py-10">
      <div className="w-full max-w-6xl bg-[#002b5c] text-white p-6 rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-semibold text-center md:text-left">
            Payment History
          </h2>
          <button
            onClick={toggleView}
            className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4"
          >
            Switch to {view === "table" ? "Card" : "Table"} View
          </button>
        </div>

        {/* Table View */}
        {view === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-[#004f88] rounded-lg text-sm">
              <thead className="bg-[#00325a] text-white uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 text-left min-w-[150px]">Email</th>
                  <th className="px-4 py-3 text-left min-w-[130px]">
                    Court Type
                  </th>
                  <th className="px-4 py-3 text-left min-w-[200px]">Slots</th>
                  <th className="px-4 py-3 text-left min-w-[100px]">Price</th>
                  <th className="px-4 py-3 text-left min-w-[120px]">Date</th>
                  <th className="px-4 py-3 text-left min-w-[100px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-300">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="border-t border-[#004f88] hover:bg-[#003d6b] transition-all"
                    >
                      <td className="px-4 py-3">{payment.email}</td>
                      <td className="px-4 py-3 capitalize">
                        {payment.courtType}
                      </td>
                      <td className="px-4 py-3">
                        {payment.slots?.join(", ") || "-"}
                      </td>
                      <td className="px-4 py-3">${payment.price}</td>
                      <td className="px-4 py-3">{payment.date}</td>
                      <td className="px-4 py-3 capitalize">{payment.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Card View
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {payments.length === 0 ? (
              <p className="text-gray-300 col-span-full text-center">
                No payments found.
              </p>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment._id}
                  className="bg-[#003f73] rounded-xl p-6 shadow-md text-white space-y-2"
                >
                  <h3 className="text-xl font-semibold text-orange-400">
                    {payment.courtType}
                  </h3>
                  <p>
                    <span className="font-semibold text-gray-300">Email:</span>{" "}
                    {payment.email}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Slots:</span>{" "}
                    {payment.slots?.join(", ") || "-"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Price:</span>{" "}
                    ${payment.price}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Date:</span>{" "}
                    {payment.date}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Status:</span>{" "}
                    {payment.status}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
