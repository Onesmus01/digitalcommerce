import { createContext, useEffect, useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export const Context = createContext(null);

let backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api"

// 🔥 HELPER: Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const ProductContext = ({ children }) => {
  const navigate = useNavigate()
  const user = useSelector(state => state?.user?.user)

  const [loading, setLoading] = useState(false)
  const [cartProductCount, setCartProductCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [wishlistItems, setWishlistItems] = useState([])

  const [userDetails, setUserDetails] = useState(null)
  const [updateUser, setUpdateUser] = useState({
    _id: "",
    name: "",
    email: "",
    role: ""
  })

  const [allUsers, setAllUsers] = useState([])

  const getAllUsers = async () => {
    try {
      const responseData = await fetch(`${backendUrl}/user/all-users`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      })
      const response = await responseData.json()
      if (responseData.ok) {
        setAllUsers(response.data)
      } else {
        toast.error(response.message || "Failed to fetch")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateUserData = async (id, role) => {
    if (!id) {
      toast.error("No user selected to update");
      return;
    }

    try {
      const responseData = await fetch(`${backendUrl}/user/update-user`, {
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: id,
          role,
        }),
      });

      const response = await responseData.json();

      if (responseData.ok) {
        toast.success(response.message);
        getAllUsers();
      } else {
        toast.error(response.message || "Failed to update");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🔥 FIXED: fetchCountCart - removed loading check, wrapped in useCallback
  const fetchCountCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setCartProductCount(0);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/user/count-cart-products`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const responseData = await response.json();

      if (response.ok) {
        setCartProductCount(Number(responseData.data) || 0);
        console.log("✅ Cart count fetched:", responseData.data);
      } else {
        console.log("❌ Cart count failed:", response.status);
        setCartProductCount(0);
      }
    } catch (error) {
      console.error("❌ fetchCountCart error:", error);
      setCartProductCount(0);
    }
  }, []);

  // 🔥 NEW: fetchUserAddToCart - fetches cart and updates count
  const fetchUserAddToCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setCartProductCount(0);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/user/view-cart-product`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        const count = responseData.data?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
        setCartProductCount(count);
        console.log("✅ Cart updated from fetchUserAddToCart:", count);
      } else {
        setCartProductCount(0);
      }
    } catch (error) {
      console.error("❌ fetchUserAddToCart error:", error);
      setCartProductCount(0);
    }
  }, []);

  // 🔥 FIXED: useEffect - trigger when token or user changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCountCart();
    }
  }, [user?._id, fetchCountCart]);

  // 🔥 NEW: Listen for storage changes (login from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (token) {
        fetchCountCart();
      } else {
        setCartProductCount(0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchCountCart]);

  const AddWishlist = useCallback(async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/add`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: productId
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Added to wishlist");
        setWishlistCount(prev => prev + 1);
        await GetWishlist();
        return { success: true, data };
      } else {
        toast.error(data.message || "Failed to add");
        return { success: false, message: data.message };
      }

    } catch (error) {
      toast.error(error.message || "Something went wrong");
      throw error;
    }
  }, [backendUrl]);

  const GetWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/wishlist/get`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (data.success) {
        const transformedItems = data.data.map(item => ({
          wishlistId: item._id,
          id: item.productId?._id,
          name: item.productId?.productName || item.productId?.name,
          brand: item.productId?.brand,
          price: item.productId?.selling || item.productId?.price,
          originalPrice: item.productId?.price,
          rating: item.productId?.rating || 4.5,
          reviews: item.productId?.reviews || 0,
          image: item.productId?.productImage?.[0] || item.productId?.image,
          category: item.productId?.category,
          inStock: item.productId?.inStock !== false,
          addedDate: item.addedAt || item.createdAt || new Date().toISOString(),
          discount: item.productId?.discount || 0,
          isNew: item.productId?.isNew || false,
          rawProduct: item.productId
        }));

        setWishlistItems(transformedItems);
        setWishlistCount(transformedItems.length);

        return { success: true, data: transformedItems };
      } else {
        toast.error(data.message || "Failed to fetch wishlist");
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error(error.message || "Failed to load wishlist");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const RemoveWishlist = useCallback(async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/remove`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Removed from wishlist");
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        setWishlistCount(prev => Math.max(0, prev - 1));
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false };
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, [backendUrl]);

  const CheckWishlistStatus = useCallback(async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/check/${productId}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      return data.inWishlist || false;
    } catch (error) {
      console.error("Check wishlist status error:", error);
      return false;
    }
  }, [backendUrl]);

  const ClearWishlist = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/clear`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Wishlist cleared");
        setWishlistItems([]);
        setWishlistCount(0);
        return { success: true };
      } else {
        toast.error(data.message);
        return { success: false };
      }
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, [backendUrl]);

  const BulkRemoveWishlist = useCallback(async (productIds) => {
    try {
      await Promise.all(productIds.map(id => RemoveWishlist(id)));
      toast.success(`${productIds.length} items removed`);
      return { success: true };
    } catch (error) {
      toast.error("Failed to remove items");
      throw error;
    }
  }, [RemoveWishlist]);

  useEffect(() => {
    if (user?._id) {
      GetWishlist();
    }
  }, [user, GetWishlist]);

  const value = {
    userDetails,
    setUserDetails,
    allUsers,
    setAllUsers,
    getAllUsers,
    setUpdateUser,
    updateUserData,
    toast,
    backendUrl,
    Link,
    setCartProductCount,
    fetchCountCart,
    cartProductCount,
    wishlistCount,
    setWishlistCount,
    wishlistItems,
    setWishlistItems,
    navigate,
    loading,
    AddWishlist,
    RemoveWishlist,
    GetWishlist,
    CheckWishlistStatus,
    ClearWishlist,
    BulkRemoveWishlist,
    getAuthHeaders,
    fetchUserAddToCart, // 🔥 NOW INCLUDED!
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default ProductContext
