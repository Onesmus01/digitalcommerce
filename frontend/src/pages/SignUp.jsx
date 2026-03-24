import { useState } from "react";
import user from "/images/user.png";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import ImageToBase64 from "@/helpers/ImageToBase64.jsx";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

let backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

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
      toast.error("Passwords do not match!");
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

      if (res.ok) {
        toast.success(responseData.message || "SignUp successful")
        navigate('/login')
      } else {
        toast.error(responseData.message || "Signup failed!");
      }

    } catch (error) {
      toast.error("Something went wrong!");
      console.log("Signup error:", error);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 font-sans px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg">

          {/* Profile Photo Upload - Responsive sizing */}
          <div className="w-full flex flex-col items-center mb-6 sm:mb-8">
            <label
              htmlFor="uploadInput"
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 cursor-pointer rounded-full border-2 border-dashed border-gray-300 shadow-md overflow-hidden group hover:border-blue-400 transition-colors"
            >
              <img
                src={photo || user}
                alt="user"
                className="w-full h-full object-cover transition group-hover:opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition">
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

          {/* Heading - Responsive text */}
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
            Create Your Account
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

            {/* Full Name */}
            <div>
              <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleOnChange}
                placeholder="Enter your full name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 w-10 sm:w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={18} className="sm:w-5 sm:h-5" /> : <AiOutlineEye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 w-10 sm:w-12 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={18} className="sm:w-5 sm:h-5" /> : <AiOutlineEye size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button - Better touch target */}
            <button className="w-full py-3 sm:py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors mt-2 text-sm sm:text-base shadow-md active:transform active:scale-[0.98]">
              Sign Up
            </button>
          </form>

          {/* Social Logins - Stack on mobile, side by side on sm+ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-5 sm:mt-6">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 sm:py-2 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base">
              <FcGoogle size={18} className="sm:w-5 sm:h-5" /> 
              <span>Google</span>
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 px-4 py-2.5 sm:py-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors text-sm sm:text-base">
              <FaFacebookF size={18} className="sm:w-5 sm:h-5" /> 
              <span>Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;