import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & Description */}
        <div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">DigitalCommerce</h1>
          <p className="text-sm text-gray-400">
            Your one-stop online shop for electronics, gadgets, and more. Quality products, fast delivery.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-red-500"><FaFacebookF /></a>
            <a href="#" className="hover:text-red-500"><FaTwitter /></a>
            <a href="#" className="hover:text-red-500"><FaInstagram /></a>
            <a href="#" className="hover:text-red-500"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-red-500">Home</a></li>
            <li><a href="#" className="hover:text-red-500">Products</a></li>
            <li><a href="#" className="hover:text-red-500">Categories</a></li>
            <li><a href="#" className="hover:text-red-500">About Us</a></li>
            <li><a href="#" className="hover:text-red-500">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-red-500">FAQs</a></li>
            <li><a href="#" className="hover:text-red-500">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-red-500">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-red-500">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to get the latest updates and offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-red-500 w-full sm:w-auto"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
        © 2025 DigitalCommerce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
