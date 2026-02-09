import { useState } from "react";
import user from "/images/user.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import ImageToBase64 from "@/helpers/ImageToBase64.jsx";
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

let backendUrl =import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate()

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: ""
  });

  const [photo, setPhoto] = useState(user);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const base64 = await ImageToBase64(file);
    setPhoto(base64);
    setData((prev) => ({ ...prev, profilePic: base64 }));
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/user/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          profilePic: data.profilePic
        })
      });
      const responseData = await res.json();

      if(res.ok){

          toast.success(responseData.message || "SignUp successful")
          navigate('/login')
          console.log(responseData);

      } else {
         toast.error(responseData.message || "Signup failed!");

      }
         
    } catch (error) {
        toast.error( "Something went wrong!",error.message);

      console.log("Signup error:", error);
    }

    console.log("Form submitted:", data);
  };

  return (
    <section className="flex justify-center items-start min-h-screen pt-16 bg-gradient-to-r from-blue-100 to-blue-50 font-sans">
      <div className="w-full max-w-md p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg">

          {/* Profile Photo Upload */}
          <div className="w-full flex flex-col items-center mb-8">
            <label
              htmlFor="uploadInput"
              className="relative w-32 h-32 cursor-pointer rounded-full border shadow-md overflow-hidden group"
            >
              <img
                src={photo || user}
                alt="user"
                className="w-full h-full object-cover transition group-hover:opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-sm opacity-0 group-hover:opacity-100 transition">
                Upload Photo
              </div>
            </label>

            <input
              id="uploadInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Create Your Account
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block mb-2 font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 w-12 h-full flex items-center justify-center"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 w-12 h-full flex items-center justify-center"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            <button className="w-full py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
              Sign Up
            </button>
          </form>

          {/* Social Logins */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-full hover:bg-gray-100">
              <FcGoogle size={20} /> Google
            </button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50">
              <FaFacebookF size={20} /> Facebook
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
