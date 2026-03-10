import { createContext, useEffect, useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import user from '../../store/userSlice.js'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export const Context = createContext(null);

let backendUrl = import.meta.env.VITE_BACKEND_URL

const ProductContext = ({ children }) => {
  const navigate = useNavigate()
  const user = useSelector(state => state?.user?.user)

  const [loading, setLoading] = useState(false)
  const [cartProductCount, setCartProductCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [wishlistItems, setWishlistItems] = useState([]) // ✅ Store full wishlist items

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
      })
      const response = await responseData.json()
      if (responseData.ok) {
        setAllUsers(response.data)
      } else {
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

  const fetchCountCart = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${backendUrl}/user/count-cart-products`, {
        method: "GET",
        credentials: "include"
      })

      const responseData = await response.json()
      if (response.ok) {
        setCartProductCount(responseData.data || 0)
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong")
      setCartProductCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchCountCart();
    }
  }, [user])

  // ✅ FIXED: AddWishlist is now a regular async function
  const AddWishlist = useCallback(async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: productId
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Added to wishlist");
        setWishlistCount(prev => prev + 1);
        // Refresh wishlist to get populated data
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

  // ✅ FIXED: GetWishlist now stores populated product data
  const GetWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/wishlist/get`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (data.success) {
        // Transform backend data to match frontend structure
        // Your backend returns: [{ _id, userId, productId: { populated product }, addedAt }]
        const transformedItems = data.data.map(item => ({
          wishlistId: item._id,           // Wishlist entry ID
          id: item.productId?._id,        // Product ID
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
          // Keep raw product data for reference
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

  // ✅ Remove from wishlist
  const RemoveWishlist = useCallback(async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/remove`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Removed from wishlist");
        // Remove from local state
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

  // ✅ Check if product is in wishlist
  const CheckWishlistStatus = useCallback(async (productId) => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/check/${productId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      return data.inWishlist || false;
    } catch (error) {
      console.error("Check wishlist status error:", error);
      return false;
    }
  }, [backendUrl]);

  // ✅ Clear entire wishlist
  const ClearWishlist = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/wishlist/clear`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
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

  // ✅ Bulk remove (if your backend supports it, otherwise use Promise.all)
  const BulkRemoveWishlist = useCallback(async (productIds) => {
    try {
      // If backend has bulk endpoint:
      // const res = await fetch(`${backendUrl}/wishlist/bulk-remove`, {...});
      
      // Otherwise remove one by one
      await Promise.all(productIds.map(id => RemoveWishlist(id)));
      toast.success(`${productIds.length} items removed`);
      return { success: true };
    } catch (error) {
      toast.error("Failed to remove items");
      throw error;
    }
  }, [RemoveWishlist]);

  // Load wishlist on mount when user is available
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
    wishlistItems,        // ✅ Full wishlist items with populated product data
    setWishlistItems,
    navigate,
    loading,
    // Wishlist functions
    AddWishlist,
    RemoveWishlist,
    GetWishlist,
    CheckWishlistStatus,
    ClearWishlist,
    BulkRemoveWishlist
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export default ProductContext