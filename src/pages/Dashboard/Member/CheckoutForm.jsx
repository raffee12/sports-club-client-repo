import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");

  const amount = 25; // 💰 Replace with actual amount as needed

  console.log("CheckoutForm rendered");

  useEffect(() => {
    console.log("Stripe instance:", stripe);
    console.log("Elements instance:", elements);
  }, [stripe, elements]);

  useEffect(() => {
    if (amount > 0) {
      axiosSecure
        .post("/create-payment-intent", { amount })
        .then((res) => {
          console.log("Client secret received:", res.data.clientSecret);
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("❌ Payment intent creation failed", err);
          setError("Failed to initialize payment. Please try again.");
        });
    }
  }, [amount, axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");

    if (!stripe || !elements || !clientSecret) {
      console.log("Missing stripe, elements or clientSecret");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      console.log("Card Element not found");
      return;
    }

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

      console.log({ paymentIntent, confirmError });

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const paymentData = {
          email: user.email,
          amount,
          transactionId: paymentIntent.id,
          paymentMethod: paymentIntent.payment_method_types,
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
      console.error("❌ Error during payment processing:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#001f45] to-[#0a2647] shadow-2xl backdrop-blur-md border border-indigo-900">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Make Your Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 rounded-xl bg-[#0f1c2e] border border-indigo-600 shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#e0e0e0",
                  "::placeholder": {
                    color: "#888",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className={`w-full py-3 rounded-xl font-semibold transition duration-300 tracking-wide text-white ${
            processing
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          }`}
        >
          {processing ? "Processing..." : `Pay $${amount}`}
        </button>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        {transactionId && (
          <p className="text-sm text-green-400 text-center">
            Payment Successful! Transaction ID:{" "}
            <span className="font-mono">{transactionId}</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
