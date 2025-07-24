import { useForm } from "react-hook-form";
import { FaLock, FaEnvelope, FaGoogle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import useAuth from "../hooks/useAuth";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signIn, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${res.user.email}`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: err.message,
        });
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();

      // Save to DB
      await axios.post("http://localhost:3000/users", {
        email: res.user.email,
        name: res.user.displayName,
        role: "user",
      });

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        text: `Welcome, ${res.user.displayName || res.user.email}`,
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: err.message,
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#001f45" }}
    >
      <div
        className="p-8 rounded-xl w-full max-w-md shadow-[0_0_30px_rgba(0,0,0,0.6)]"
        style={{ backgroundColor: "#03396c" }}
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 text-white/90"
        >
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-white/50" />
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email",
                },
              })}
              placeholder="Email Address"
              className="input w-full pl-10 input-bordered bg-white text-black"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-white/50" />
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
              placeholder="Password"
              className="input w-full pl-10 input-bordered bg-white text-black"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn bg-orange-500 text-white w-full hover:bg-orange-600"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn bg-white text-black w-full flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-lg" />
            Continue with Google
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          <span className="text-orange-400">Don't have an account?</span>{" "}
          <a href="/register" className="underline text-white/80">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
