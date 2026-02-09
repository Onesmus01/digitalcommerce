import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import displayKESCurrency from '@/helpers/displayCurrency.js';

const CardView = ({ products, onEdit, onDelete }) => {
  return (
    <div className="w-full max-w-6xl p-2 sm:p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col overflow-hidden"
        >
          {/* Image */}
          <div className="w-full h-44 sm:h-36 md:h-32 flex items-center justify-center bg-gray-50 border-b p-2 sm:p-3">
            {product.productImage?.length > 0 ? (
              <img
                src={product.productImage[0]}
                alt={product.productName}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-xs sm:text-sm text-gray-400">No Image</span>
            )}
          </div>

          {/* Content */}
          <div className="p-2 sm:p-3 flex flex-col flex-1 space-y-1">
            <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
              {product.productName}
            </h3>

            <div className="flex  flex-col gap-1">
              <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                Brand: <span className="text-blue-500">{product.brandName || 'No brand'}</span>
              </p>
              <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                Category: <span className="text-blue-500">{product.category || 'No category'}</span>
              </p>
            </div>

            <div className="mt-1 flex flex-col lg:flex text-[10px] sm:text-sm">
              <span className="font-semibold line-through text-gray-600">
                {displayKESCurrency(Number(product.price))}
              </span>
              <span className="font-semibold text-green-600">
                {displayKESCurrency(Number(product.selling))}
              </span>
            </div>

            <p className="text-[9px] sm:text-xs text-gray-400">
              {new Date(product.createdAt).toLocaleDateString()}
            </p>

            {/* Actions */}
            <div className="mt-auto pt-2 flex gap-1 sm:gap-2">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center gap-1 bg-yellow-100 hover:bg-yellow-400 text-yellow-700 hover:text-white py-1 text-[9px] sm:text-xs transition"
              >
                <FiEdit size={14} /> Edit
              </button>

              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 flex items-center justify-center gap-1 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white py-1 text-[9px] sm:text-xs transition"
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;
