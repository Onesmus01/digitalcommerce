import React, { useContext } from 'react'
import { Search, User, ShoppingCart } from 'lucide-react';
import Context from '@/context/ProductContext.jsx'
import {useNavigate} from 'react-router-dom'

const SearchBar = () => {
  const navigate = useNavigate()

  const handleSearch = async(e)=> {
    const {value} = e.target

    if(value){
      navigate(`/search?q=${value}`)
    } else {
      navigate("/search")
    }

  }
  return (
       <div className="flex-1 mx-4 flex justify-center">
          <div className="relative hidden md:inline-flex w-full max-w-md">
            <input
            onChange={handleSearch}
              type="text"
              placeholder="Search Product here..."
              className="w-full pr-14 pl-4 py-2 border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button onClick={()=>navigate('/search')} className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-blue-600 focus-within:shadow-md rounded-r-full hover:bg-blue-700 transition-colors">
              <Search  size={20} className="text-white" />
            </button>
          </div>
        </div>
  )
}

export default SearchBar
