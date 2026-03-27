// BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        fixed bottom-4 left-4 
        sm:hidden             /* hide on larger screens */
        bg-gray-800 text-white 
        px-3 py-2 rounded-full 
        shadow-lg hover:bg-gray-700 
        transition-all
        z-50
      "
      title="Go back"
    >
      ←
    </button>
  );
};

export default BackButton;