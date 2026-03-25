import React, { useState, useContext } from 'react'
import user from '/images/user.png'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Context from '@/context/index.js'

let backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()
  const { fetchUserDetails, fetchCountCart } = useContext(Context)

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`${backendUrl}/user/signin`, {
      method: "POST",
      credentials: "include", // For cookie (localhost)
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password
      })
    });

    const responseData = await response.json();
    
    if (response.ok) {
      // Store token in localStorage for production (header method)
      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
      }
      
      toast.success(responseData.message || "Login success");
      navigate('/');
      fetchUserDetails();  // Will try cookie first, fallback to header
      fetchCountCart();
    } else {
      toast.error(responseData.message || "Login Failed");
    }
  } catch (error) {
    toast.error(error.message || "something went wrong");
  }
};

  return (
    <section 
      id='login' 
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 font-sans px-3 sm:px-4 py-6 sm:py-8"
    >
      <div className="w-full max-w-md mx-auto">
        {/* Login Card - Responsive padding */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg">
          
          {/* User Image - Smaller on mobile */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6">
            <img 
              src={user} 
              alt='user' 
              className="w-full h-full object-cover rounded-full shadow-md" 
            />
          </div>

          {/* Heading - Responsive text size */}
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
            Login to Your Account
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm sm:text-base text-gray-700 mb-1 sm:mb-2 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                name='email'
                value={data.email}
                onChange={handleOnChange}
                id="email"
                placeholder="Enter your email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Password with eye toggle */}
            <div className="relative">
              <label 
                htmlFor="password" 
                className="block text-sm sm:text-base text-gray-700 mb-1 sm:mb-2 font-medium"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name='password'
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Enter your password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 sm:pr-12 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-0 right-0 h-full w-10 sm:w-12 flex items-center justify-center rounded-r-lg hover:bg-gray-100 transition-colors text-gray-600"
                >
                  {showPassword ? 
                    <AiOutlineEyeInvisible size={18} className="sm:w-5 sm:h-5" /> : 
                    <AiOutlineEye size={18} className="sm:w-5 sm:h-5" />
                  }
                </button>
              </div>
            </div>

            {/* Login Button - Better touch target on mobile */}
            <button
              type="submit"
              className="w-full py-3 sm:py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors mt-2 text-sm sm:text-base shadow-md active:transform active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          {/* Social Logins - Stack on very small screens, side by side on sm+ */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-5 sm:mt-6">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 sm:py-2 hover:bg-gray-100 transition-colors text-sm sm:text-base">
              <FcGoogle size={18} className="sm:w-5 sm:h-5" /> 
              <span>Google</span>
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 rounded-full px-4 py-2.5 sm:py-2 hover:bg-blue-50 transition-colors text-blue-600 text-sm sm:text-base">
              <FaFacebookF size={18} className="sm:w-5 sm:h-5" /> 
              <span>Facebook</span>
            </button>
          </div>

          {/* Forgot Password & Sign Up - Better spacing on mobile */}
          <div className="mt-5 sm:mt-6 space-y-2">
            <p className="text-center text-xs sm:text-sm text-gray-500">
              Forgot your password?{' '}
              <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                Reset
              </Link>
            </p>

            <p className="text-center text-xs sm:text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login