import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { FaList, FaTh } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/payments?email=${user.email}`)
        .then((res) => setPayments(res.data))
        .catch((err) => console.error("Failed to fetch payments", err));
    }
  }, [axiosSecure, user?.email]);

  const toggleView = () => {
    setViewMode(viewMode === "table" ? "card" : "table");
  };

  return (
    <div className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-900">Payment History</h2>
        <button
          onClick={toggleView}
          className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          {viewMode === "table" ? <FaTh /> : <FaList />}
          {viewMode === "table" ? "Card View" : "Table View"}
        </button>
      </div>

      {!payments.length ? (
        <div className="text-center text-gray-500">No payments found.</div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="table w-full table-zebra text-sm">
            <thead className="bg-indigo-100 text-indigo-800 text-left">
              <tr>
                <th>Email</th>
                <th>Court Type</th>
                <th>Slots</th>
                <th>Date</th>
                <th>Paid ($)</th>
                <th>Txn ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.email}</td>
                  <td>{payment.courtType}</td>
                  <td>{payment.slots?.join(", ")}</td>
                  <td>{payment.date}</td>
                  <td className="font-semibold text-green-700">
                    ${payment.discountedPrice || payment.amount}
                  </td>
                  <td>
                    <span className="text-xs text-gray-600 font-mono break-all">
                      {payment.transactionId}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white border border-indigo-200 rounded-xl p-4 shadow-md"
            >
              <h3 className="text-lg font-semibold text-indigo-900 mb-1">
                {payment.courtType}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Date:</strong> {payment.date}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Slots:</strong> {payment.slots?.join(", ")}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Paid:</strong>{" "}
                <span className="text-green-700 font-bold">
                  ${payment.discountedPrice || payment.amount}
                </span>
              </p>
              <p className="text-sm text-gray-500 break-all">
                <strong>Txn:</strong>{" "}
                <span className="font-mono">{payment.transactionId}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
