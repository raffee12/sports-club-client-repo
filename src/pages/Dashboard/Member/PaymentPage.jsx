import React, { useEffect, useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// ✅ Replace with your public Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Dummy amount for now (e.g., $25.00)
  const amount = 25;

  useEffect(() => {
    // Create PaymentIntent on the server
    axiosSecure
      .post("/create-payment-intent", { amount })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error("Failed to create payment intent:", err));
  }, [axiosSecure]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setPaymentError("");
    setPaymentSuccess("");

    // Confirm card payment
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
        },
      }
    );

    if (error) {
      setPaymentError(error.message);
    } else if (paymentIntent.status === "succeeded") {
      setPaymentSuccess("Payment successful!");
      setTransactionId(paymentIntent.id);

      // You can now POST payment details to your DB here
      // await axiosSecure.post("/payments", { amount, transactionId: paymentIntent.id })
    }

    setProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">
        Complete Your Payment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          className="border border-gray-300 p-3 rounded"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#fa755a" },
            },
          }}
        />

        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className="btn btn-primary w-full"
        >
          {processing ? "Processing..." : `Pay $${amount}`}
        </button>
      </form>

      {paymentError && (
        <p className="mt-3 text-red-600 font-medium text-sm">{paymentError}</p>
      )}
      {paymentSuccess && (
        <div className="mt-4 text-green-600 text-sm">
          <p>{paymentSuccess}</p>
          <p>Transaction ID: {transactionId}</p>
        </div>
      )}
    </div>
  );
};

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
