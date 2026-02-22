import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* POPUP */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-fadeIn">
        <div className="mb-6">
          {/* CHECKMARK ICON */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600">
            Thank you for your order. Your payment has been received successfully.
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/my-orders")}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md"
        >
          Go to My Orders
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;