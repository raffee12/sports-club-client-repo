import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserPlus } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import registerAnim from "../../public/lotties/register.json";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function Register() {
  const { createUser, googleLogin } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const imageFile = data.photo[0];

      // Upload image to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbRes = await axiosSecure.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );

      const imageUrl = imgbbRes.data.data.url;

      // Create user in Firebase Auth
      const res = await createUser(data.email, data.password);

      // Get Firebase ID Token (optional debug)
      const token = await res.user.getIdToken();
      console.log("Firebase ID Token (Register):", token);

      // Save user to backend with secured axios instance
      await axiosInstance.post("/users", {
        email: data.email,
        name: data.username,
        role: "user",
        photo: imageUrl,
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: `Welcome, ${data.username}!`,
      }).then(() => {
        navigate("/dashboard/user/profile");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const onError = async () => {
    await trigger();
    const firstError = Object.values(errors)[0];
    if (firstError) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: firstError.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();

      // Get Firebase ID Token
      const token = await res.user.getIdToken();
      console.log("Firebase ID Token (Google):", token);

      // Save user to backend with secured axios instance
      await axiosInstance.post("/users", {
        email: res.user.email,
        name: res.user.displayName,
        role: "user",
        photo: res.user.photoURL || "",
      });

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
      }).then(() => {
        navigate("/dashboard/user/profile");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-500 to-blue-900 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex w-full max-w-4xl overflow-hidden">
        <div className="w-1/2 hidden md:block">
          <Lottie animationData={registerAnim} loop={true} />
        </div>

        <div
          className="w-full md:w-1/2 p-8"
          style={{ backgroundColor: "#001f45" }}
        >
          <div className="flex justify-center mb-4">
            <FaUserPlus className="text-4xl text-orange-500" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-6 text-white">
            Register Form
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-4 text-white/90"
          >
            <div className="form-control">
              <label className="label">
                <span className="text-white/70">Username</span>
              </label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                placeholder="Your username"
                className="input input-bordered w-full bg-white text-black"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-white/70">Email Address</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
                placeholder="Your email"
                className="input input-bordered w-full bg-white text-black"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-white/70">Password</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                placeholder="Password"
                className="input input-bordered w-full bg-white text-black"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="text-white/70">Profile Picture</span>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("photo", {
                  required: "Profile image is required",
                  onChange: (e) => {
                    if (e.target.files[0]) {
                      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  },
                })}
                className="file-input file-input-bordered w-full"
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-16 h-16 mt-2 rounded-full object-cover border"
                />
              )}
            </div>

            <button
              type="submit"
              className="btn bg-orange-500 text-white w-full hover:bg-orange-600"
            >
              Register
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn bg-white text-black flex items-center justify-center gap-2 w-full"
            >
              <FcGoogle className="text-xl" /> Continue with Google
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            <span className="text-orange-400">Already have an account?</span>{" "}
            <a href="/login" className="underline text-white/80">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
