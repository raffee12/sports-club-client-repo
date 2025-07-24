import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../../../public/lotties/404Error.json"; // adjust path if needed

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#001f45] flex flex-col items-center justify-center text-white text-center p-6">
      {/* Lottie Animation with transparent style */}
      <div className="w-full max-w-md mb-6">
        <Lottie
          animationData={errorAnimation}
          loop
          style={{ background: "transparent" }}
        />
      </div>

      <h1 className="text-4xl font-bold mb-2">Oops! Page Not Found</h1>
      <p className="text-gray-300 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="bg-white text-[#001f45] px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
