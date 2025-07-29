import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("table");

  useEffect(() => {
    if (!user?.email) return;

    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get(`/payments/user/${user.email}`);
        setPayments(res.data || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user, axiosSecure]);

  if (loading)
    return <p className="text-center text-white">Loading payment history...</p>;

  return (
    <div className="p-4 min-h-screen flex justify-center items-center bg-gradient-to-b from-[#001f45] to-[#0a2647]">
      <div className="w-full max-w-6xl bg-[#002b60] text-white rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Payment History</h2>
          <button
            onClick={() => setView(view === "table" ? "card" : "table")}
            className="btn btn-outline btn-sm text-white border-white"
          >
            {view === "table" ? "Card View" : "Table View"}
          </button>
        </div>

        {payments.length === 0 ? (
          <p className="text-center text-gray-300">No payments found.</p>
        ) : view === "table" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-500">
              <thead className="bg-[#01376f] text-white">
                <tr>
                  <th className="p-3 text-left">Transaction ID</th>
                  <th className="p-3 text-left">Court</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Slots</th>
                  <th className="p-3 text-left">Paid</th>
                  <th className="p-3 text-left">Discount</th>
                  <th className="p-3 text-left">Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-[#01447f]">
                    <td className="p-3 font-mono text-sm">{p.transactionId}</td>
                    <td className="p-3">{p.courtName || "N/A"}</td>
                    <td className="p-3">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{p.slots?.join(", ") || "N/A"}</td>
                    <td className="p-3 font-bold text-green-300">
                      ${p.discountedPrice?.toFixed(2)}
                    </td>
                    <td className="p-3 text-yellow-300">
                      {p.discountApplied ? `${p.discountApplied}%` : "—"}
                    </td>
                    <td className="p-3 capitalize">
                      {p.paymentMethod?.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {payments.map((p) => (
              <div
                key={p._id}
                className="bg-[#003b80] border border-[#0151ad] p-4 rounded-xl shadow-md space-y-2"
              >
                <p className="text-sm text-gray-300">Transaction</p>
                <p className="font-mono text-sm truncate">{p.transactionId}</p>

                <div className="grid grid-cols-2 text-sm text-gray-100">
                  <span className="font-semibold">Court:</span>
                  <span>{p.courtName}</span>

                  <span className="font-semibold">Date:</span>
                  <span>{new Date(p.date).toLocaleDateString()}</span>

                  <span className="font-semibold">Slots:</span>
                  <span>{p.slots?.join(", ") || "N/A"}</span>

                  <span className="font-semibold">Paid:</span>
                  <span className="text-green-300">
                    ${p.discountedPrice?.toFixed(2)}
                  </span>

                  <span className="font-semibold">Discount:</span>
                  <span>
                    {p.discountApplied ? `${p.discountApplied}%` : "—"}
                  </span>

                  <span className="font-semibold">Method:</span>
                  <span>{p.paymentMethod?.join(", ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
