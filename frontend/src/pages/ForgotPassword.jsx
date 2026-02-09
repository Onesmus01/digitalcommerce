import React from 'react'

const ForgotPassword = () => {
  return (
    <section className="flex items-start justify-center pt-16 bg-gradient-to-r from-blue-100 to-blue-50 min-h-screen font-sans">
      <div className="w-full max-w-md mx-auto p-4">

        {/* Forgot Password Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Forgot Your Password?
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Enter your email address below and we'll send you a link to reset your password.
          </p>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Send Reset Link Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors mt-2"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Remembered your password? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </p>

        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
