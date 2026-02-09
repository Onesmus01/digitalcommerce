import React,{useState} from 'react'
import { FiX } from "react-icons/fi";
import productCategories from "@/helpers/ProductCategory.jsx";

const Upload = ({ onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <div className="bg-white w-full max-w-2xl h-[80vh] rounded-xl shadow-xl relative flex flex-col">
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          Upload Products
        </h2>

        <FiX
          onClick={onClose}
          className="cursor-pointer text-gray-500 hover:text-red-500 transition"
          size={22}
        />
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto">
        {/* Upload form goes here */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
          Drag & drop product images here or click to upload
        </div>
      </div>
      <div className="text-lg font-bold ">Select Categories</div>
      <div className="gap-3 flex-col md:grid-cols-4 lg:grid-cols-3 grid-cols-1 grid my-4">
        {
            productCategories.map((cat)=>(
                <button className={`px-3 py-1 bg-blue-500 rounded-full text-white ${selectedCategory.category === cat?.id}? "bg-green-500" ? "bg-blue-500 hover:bg-blue-600" `} key={cat?.id} value={cat?.value}>{cat.name}</button>
            ))
        }
      </div>

    </div>
  )
}

export default Upload
