import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const originalPrice = booking?.price || 0;

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0); // %
  const [finalPrice, setFinalPrice] = useState(originalPrice);

  // === Handle Coupon Apply ===
  const handleApplyCoupon = async () => {
    try {
      const res = await axiosSecure.get("/coupons"); // 🔁 make sure your /coupons returns valid list
      const valid = res.data.find(
        (c) => c.code === coupon && new Date(c.expiryDate) >= new Date()
      );
      if (valid) {
        setDiscount(valid.discount);
        setFinalPrice(originalPrice - originalPrice * (valid.discount / 100));
        Swal.fire("Coupon Applied!", `-${valid.discount}% discount`, "success");
      } else {
        setDiscount(0);
        setFinalPrice(originalPrice);
        Swal.fire("Invalid Coupon", "Try a different code", "error");
      }
    } catch {
      Swal.fire("Error", "Unable to apply coupon", "error");
    }
  };

  // === Generate client secret ===
  useEffect(() => {
    if (finalPrice > 0) {
      axiosSecure
        .post("/create-payment-intent", { amount: finalPrice })
        .then((res) => setClientSecret(res.data.clientSecret));
    }
  }, [finalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setError("");

    try {
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "Guest",
              email: user?.email,
            },
          },
        });

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const paymentData = {
          email: user.email,
          amount: finalPrice,
          transactionId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method_types,
          courtName: booking?.courtName,
          courtType: booking?.courtType,
          date: booking?.date,
          slots: booking?.slots,
          originalPrice: originalPrice,
          discountedPrice: finalPrice,
          discountApplied: discount,
          paidAt: new Date(),
        };

        const res = await axiosSecure.post("/payments", paymentData);
        if (res.data.insertedId) {
          setTransactionId(paymentIntent.id);
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            html: `<p>Transaction ID:</p><code>${paymentIntent.id}</code>`,
            confirmButtonText: "Go to Dashboard",
          }).then(() => {
            navigate("/dashboard/member/confirmed");
          });
        }
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#001f45] to-[#0a2647] shadow-2xl border border-indigo-900">
      <h2 className="text-3xl font-bold text-center text-white mb-4">
        Secure Payment
      </h2>

      {/* === Coupon === */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="input input-bordered w-full"
        />
        <button onClick={handleApplyCoupon} className="btn btn-accent">
          Apply
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-white">
        {/* === Readonly Fields === */}
        <div className="grid gap-3">
          <input
            type="text"
            value={user?.email}
            readOnly
            className="input input-bordered w-full bg-gray-100 text-gray-700"
          />
          <input
            type="text"
            value={booking?.courtType}
            readOnly
            className="input input-bordered w-full bg-gray-100 text-gray-700"
          />
          <input
            type="text"
            value={booking?.slots?.join(", ")}
            readOnly
            className="input input-bordered w-full bg-gray-100 text-gray-700"
          />
          <input
            type="text"
            value={booking?.date}
            readOnly
            className="input input-bordered w-full bg-gray-100 text-gray-700"
          />
          <input
            type="text"
            value={`$${finalPrice.toFixed(2)}`}
            readOnly
            className="input input-bordered w-full bg-green-100 text-green-800 font-semibold"
          />
        </div>

        {/* === Card === */}
        <div className="p-3 rounded-lg bg-white shadow">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#333",
                  "::placeholder": { color: "#aaa" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>

        {/* === Button & Messages === */}
        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
            processing
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          }`}
        >
          {processing ? "Processing..." : `Pay $${finalPrice.toFixed(2)}`}
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        {transactionId && (
          <p className="text-sm text-green-400 text-center mt-2">
            Payment Success. TXN:{" "}
            <span className="font-mono">{transactionId}</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
