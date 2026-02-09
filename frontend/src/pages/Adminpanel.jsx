import React from 'react'
import { useSelector } from 'react-redux'
import { User } from 'lucide-react'
import { Link ,Outlet} from 'react-router-dom'

const Adminpanel = () => {
  const user = useSelector(state => state?.user?.user)

  return (
    <div className="min-h-[calc(100vh-120px)] flex">
      
      {/* Sidebar */}
      <aside className="bg-white w-full max-w-60 p-4
        shadow-[0_4px_12px_rgba(0,0,0,0.12)]
        hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]
        transition-shadow"
      >
        {/* Profile */}
        <div className="flex flex-col items-center gap-2 py-4 border-b">

          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full cursor-pointer bg-blue-500 flex items-center justify-center
              shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-white cursor-pointer font-bold text-lg">
                  {(user?.name || user?.email || 'U')[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Online dot */}
            <span className="absolute cursor-pointer bottom-0 right-0 h-2.5 w-2.5 bg-green-500
              rounded-full border-2 border-white
              shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
          </div>

          {/* Name */}
          <p className="capitalize font-semibold text-sm">
            {user?.name || 'Admin'}
          </p>

          {/* Role */}
          <p className="text-[10px] cursor-pointer px-2 py-0.5 bg-green-500 text-white
            rounded-full capitalize tracking-wide">
            {user?.role}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex flex-col gap-1 text-sm">
          <Link
            to="all-users"
            className="px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Users
          </Link>
          <Link
            to="all-products"
            className="px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Products
          </Link>
          <Link className='px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition' to={'product'}>product</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 bg-slate-50">
        {/* Admin content>> */}
        <Outlet />
      </main>

    </div>
  )
}

export default Adminpanel
