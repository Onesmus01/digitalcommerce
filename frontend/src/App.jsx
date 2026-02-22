import React,{useEffect,useState} from 'react'
import Home from './pages/Home.jsx'
import Header from '@/components/Header.jsx'
import Footer from '@/components/Footer.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '@/pages/Login.jsx'
import SignUp from '@/pages/SignUp.jsx'
import ForgotPassword from '@/pages/ForgotPassword.jsx'
import { Toaster } from "react-hot-toast";
import Context from '@/context/index.js'
import {useDispatch, useSelector} from 'react-redux'
import { setUserDetails } from '../store/userSlice.js'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import AdminPanel from '@/pages/Adminpanel.jsx'
import AllProducts from '@/pages/AllProducts.jsx'
import AllUsers from '@/pages/AllUsers.jsx'
import Products from '@/pages/Product.jsx'
import CategoryProduct from '@/pages/CategoryProduct.jsx'
import ProductDetails from '@/pages/ProductDetails.jsx'
import Cart from '@/pages/Cart.jsx'
import SearchProduct from '@/components/SearchProduct.jsx'
import Orders from '@/pages/Orders.jsx'
import CheckoutPage from '@/pages/CheckoutPage.jsx'
import Payment from '@/pages/Payment.jsx'
import ThankYouPage from '@/pages/ThankyouPage.jsx'

let backendUrl = import.meta.env.VITE_BACKEND_URL
const App = () => {
  const user = useSelector(state=>state?.user?.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userData = useSelector(state=>state?.user?.user)
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const [cartProductCount,setCartProductCount] = useState(0)

  const fetchCountCart = async()=> {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/user/count-cart-products`,{
        method: "GET",
        credentials: "include"
      })

      const responseData = await response.json()
      if(response.ok) {
        setCartProductCount(responseData.data || 0)
      } else {
        toast.error(responseData.message)
      } 
    } catch (error) {
      toast.error(error.message || "Something went wrong")
      setCartProductCount(0)
    }finally {
      setLoading(false)
    }
  }
  
  useEffect(()=> {
    if (user?._id) {       // only fetch cart count if user exists
    fetchCountCart();
  }

  },[user])

    const fetchUserDetails = async()=> {
      const dataResponse = await fetch(`${backendUrl}/user/user-details`,{
        method: "GET",
        credentials: "include"
      }
    )
    const response = await dataResponse.json()
    if(dataResponse.ok){
      dispatch(setUserDetails(response.data))
    }
    }

    useEffect(()=> {
      fetchUserDetails()
    },[])

    //logout session
    
  return (
    <Context.Provider value={{
      fetchUserDetails,navigate,
      cartProductCount,setCartProductCount,fetchCountCart
    }} >
      <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Toaster position="top-center" />
      <div className=""></div>
      <Header />

      {/* Main content grows to take available space */}
      <main className="flex-1 pt-[16px]">
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path={'/login'} element={<Login />} />
          <Route path={'/forgot-password'} element={<ForgotPassword />} />
          <Route path={'/sign-up'} element={<SignUp />} />
          <Route path="/product-category/:categoryName?" element={<CategoryProduct />} />

          <Route path={'/product/:id'} element={<ProductDetails />} />
          <Route path={'/cart'} element={<Cart />} /> 
          <Route path={'/search'} element={<SearchProduct />} />

          {user && <Route path={'/orders'} element={<Orders />} />}
          {user && <Route path={'/checkout'} element={<CheckoutPage />} />}
          {user && <Route path={'/payment'} element={<Payment />} />}
          {user && <Route path={'/thank-you'} element={<ThankYouPage />} />}



           
           {/* Admin routes */}
          {userData?.role==='ADMIN' && <Route path={'admin-panel'} element={<AdminPanel />}>
          <Route path={'all-users'} element={<AllUsers />} />
          <Route path={'all-products'} element={<AllProducts />}/>
          <Route path={'product'} element={<Products />}/>


          </Route>}

        </Routes>
      </main>

      {/* Footer sticks to the bottom */}
      <Footer />
    </div>

    </Context.Provider>
    
  )
}

export default App 