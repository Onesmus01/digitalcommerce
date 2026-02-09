import React from 'react'
import {Link} from 'react-router-dom'

const Logo = () => {
  return (
    <Link to={'/'}>
        <h2 className="text-2xl text-gray-600 font-black tracking-wider cursor-pointer uppercase hover:text-green-400 group hoverEffect font-sans">DIGITAL<span className='text-green-500 group-hover:text-blue-500'>COMMERce</span></h2>
    </Link>
  )
}

export default Logo