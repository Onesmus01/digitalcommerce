import {createContext,useEffect,useState} from 'react'
import {toast} from 'react-hot-toast'
import user from '../../store/userSlice.js'
import {useSelector} from 'react-redux'
import {Link,useNavigate} from 'react-router-dom'
export const Context = createContext(null);

let backendUrl = import.meta.env.VITE_BACKEND_URL
const ProductContext = ({children}) => {

  const navigate = useNavigate()

    const user = useSelector(state=>state?.user?.user)

    const [loading,setLoading] = useState(false)
    const [cartProductCount,setCartProductCount] = useState(0)

    const [userDetails,setUserDetails]=useState(null)
    const [updateUser,setUpdateUser] = useState({
        _id: "",      
        name: "",
        email: "",
        role: ""
             
    })

    const [allUsers,setAllUsers] = useState([])

    const getAllUsers = async()=> {
        try {
            
            const responseData = await fetch(`${backendUrl}/user/all-users`,{
                method: "GET",
                credentials: "include",
            })
            const response = await responseData.json()
            if(responseData.ok){
                setAllUsers(response.data)
            }else{
                toast.error(toast.message || "Failed to fetch")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // update user
    const updateUserData = async (id, role) => {
  if (!id) {
    toast.error("No user selected to update");
    return;
  }

  try {
    const responseData = await fetch(`${backendUrl}/user/update-user`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        role, // only send the role if that's all you want to update
      }),
    });

    const response = await responseData.json();

    if (responseData.ok) {
      toast.success(response.message);
      getAllUsers(); // refresh the list after update
    } else {
      toast.error(response.message || "Failed to update");
    }
  } catch (error) {
    toast.error(error.message);
  }
    };

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

    const value ={
        userDetails,
        setUserDetails,
        allUsers,
        setAllUsers,
        getAllUsers,
        setUpdateUser,
        updateUserData,
        toast,backendUrl,Link,
        setCartProductCount,fetchCountCart,cartProductCount,
        navigate
    }

    return(
        <Context.Provider value={value}>
        {children}
        </Context.Provider>
    )
}

export default ProductContext