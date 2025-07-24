import { Link } from "react-router-dom";
import { AiOutlineWarning } from "react-icons/ai";

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-yellow-300 px-4 text-center">
      <div className="max-w-xl space-y-6">
        <AiOutlineWarning
          size={100}
          className="mx-auto text-yellow-400 animate-bounce drop-shadow-lg"
        />

        <h1 className="text-6xl font-extrabold drop-shadow-lg">403</h1>
        <h2 className="text-3xl font-bold text-yellow-200 tracking-wider">
          Access Forbidden
        </h2>
        <p className="text-lg text-yellow-100 leading-relaxed">
          You don’t have permission to access this page. Only admins can view
          this content.
        </p>

        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold shadow-lg hover:bg-yellow-300 transition duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
