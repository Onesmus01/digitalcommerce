import React,{useState} from 'react'
import Upload from '@/components/Upload.jsx'
const Product = () => {
    const [openProduct,setOpenProduct] = useState(false)
  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className="bg-white flex justify-between  items-center p-5 py-5 px-8 rounded-md ">
        <h2>All Products</h2>
        <button onClick={()=>setOpenProduct(true)} className='bg-blue-500 text-white py-1 px-2 rounded-full hover:bg-green-500 hover:text-white cursor-pointer '>Upload product</button>
      </div>
      <div className="">
        {openProduct &&  <Upload onClose={()=>setOpenProduct(false)} />}
      </div>

    </div>
  )
}

export default Product
