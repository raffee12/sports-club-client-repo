import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

// ✅ Replace with your actual Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);
console.log(import.meta.env.VITE_payment_key);
const PaymentPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 to-white p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
