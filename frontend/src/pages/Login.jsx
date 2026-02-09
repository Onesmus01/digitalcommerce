import React, { useState,useContext } from 'react'
import user from '/images/user.png'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebookF } from 'react-icons/fa'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import {Link} from 'react-router-dom'
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import Context from '@/context/index.js'

let backendUrl = import.meta.env.VITE_BACKEND_URL
const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [data,setData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  const {fetchUserDetails,fetchCountCart} = useContext(Context)
  const handleOnChange = (e)=> {
    const {name,value} = e.target;
    setData((prev)=>  {
        return{
            ...prev,
            [name] : value
        }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const response = await fetch(`${backendUrl}/user/signin`,{
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      })

      const responseData = await response.json()
      if(response.ok) {
        toast.success(responseData.message || "Login sucess")
        navigate('/')
        fetchUserDetails()
        fetchCountCart()
      }else {
        toast.error(responseData.message || "Login Failed")
      }
    } catch (error) {
      toast.error(error.message || "something went wrong")
    }
  }
  console.log("Data login",data)

  return (
    <section 
      id='login' 
      className="flex items-start justify-center pt-16 bg-gradient-to-r from-blue-100 to-blue-50 font-sans min-h-screen"
    >
      <div className="w-full max-w-md mx-auto p-4">

        {/* Login Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          
          {/* User Image */}
          <div className="w-24 h-24 mx-auto mb-6">
            <img src={user} alt='user' className="w-full h-full object-cover rounded-full shadow-md" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login to Your Account
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                name='email'
                value={data.email}
                onChange={handleOnChange}
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password with eye toggle */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-0 right-0 h-full w-12 flex items-center justify-center rounded-r-lg hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors mt-2"
            >
              Login
            </button>
          </form>

          {/* Social Logins */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors">
              <FcGoogle size={20} /> Google
            </button>
            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:bg-blue-50 transition-colors text-blue-600">
              <FaFacebookF size={20} /> Facebook
            </button>
          </div>

          {/* Forgot Password */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Forgot your password? <a href="/forgot-password" className="text-blue-600 hover:underline">Reset</a>
          </p>

          {/* Sign Up */}
          <p className="text-center text-sm text-gray-500 mt-2">
            Don't have an account? <a href="/sign-up" className="text-blue-600 hover:underline">Sign Up</a>
          </p>

        </div>
      </div>
    </section>
  )
}
export default Login

