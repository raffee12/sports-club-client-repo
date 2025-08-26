import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserPlus } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const imageFile = data.photo[0];

      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbRes = await axiosSecure.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );

      const imageUrl = imgbbRes.data.data.url;

      const res = await createUser(data.email, data.password);
      const token = await res.user.getIdToken();
      console.log("Firebase ID Token (Register):", token);

      await axiosInstance.post("/users", {
        email: data.email,
        name: data.username,
        phone: data.phone,
        address: data.address,
        role: "user",
        photo: imageUrl,
      });

      Swal.fire({
        icon: "success",
        title: "Welcome to Sports Club! 🎉",
        text: `${data.username}, your account has been created successfully.`,
        confirmButtonColor: "#f97316",
        background: "#001f45",
        color: "#fff",
      }).then(() => {
        navigate("/dashboard/user/profile");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || error.message,
        confirmButtonColor: "#f97316",
        background: "#001f45",
        color: "#fff",
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
        confirmButtonColor: "#f97316",
        background: "#001f45",
        color: "#fff",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await googleLogin();
      const token = await res.user.getIdToken();
      console.log("Firebase ID Token (Google):", token);

      await axiosInstance.post("/users", {
        email: res.user.email,
        name: res.user.displayName,
        phone: "",
        address: "",
        role: "user",
        photo: res.user.photoURL || "",
      });

      Swal.fire({
        icon: "success",
        title: "Google Login Successful 🎊",
        text: `Welcome back, ${res.user.displayName}!`,
        confirmButtonColor: "#f97316",
        background: "#001f45",
        color: "#fff",
      }).then(() => {
        navigate("/dashboard/user/profile");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.response?.data?.message || error.message,
        confirmButtonColor: "#f97316",
        background: "#001f45",
        color: "#fff",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-6 transition-colors mt-5">
      <div className="bg-white dark:bg-[#001f45] rounded-2xl shadow-2xl w-full max-w-5xl p-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <FaUserPlus className="text-5xl text-orange-500 mb-3" />
          <h2 className="text-3xl font-bold text-orange-500">Register</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Create your Sports Club account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black dark:text-white"
        >
          {/* Username */}
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              placeholder="Your username"
              className="input input-bordered w-full bg-white text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
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

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
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

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              type="text"
              {...register("phone", { required: "Phone number is required" })}
              placeholder="Your phone number"
              className="input input-bordered w-full bg-white text-black"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Address</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              placeholder="Your address"
              className="input input-bordered w-full bg-white text-black"
            />
          </div>

          {/* Profile Picture */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">
              Profile Picture
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
              className="file-input file-input-bordered w-full bg-white text-black"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 mt-3 rounded-full object-cover border-2 border-orange-500"
              />
            )}
          </div>

          {/* Buttons */}
          {/* Buttons */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="btn flex-1 bg-orange-500 text-white hover:bg-orange-600 transition duration-300"
            >
              Register
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn flex-1 border border-orange-500 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white transition duration-300 flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" /> Continue with Google
            </button>
          </div>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-sm">
          <span className="text-orange-500">Already have an account?</span>{" "}
          <a
            href="/login"
            className="underline text-black dark:text-orange-400"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
