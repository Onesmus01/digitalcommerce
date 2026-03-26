import { toast } from 'react-hot-toast'

let backendUrl = import.meta.env.VITE_BACKEND_URL

// 🔥 HELPER: Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const addToCart = async (e, id) => {
  e?.stopPropagation()
  e?.preventDefault()

  const response = await fetch(`${backendUrl}/user/add-to-cart`, {
    method: "POST",
    credentials: "include",  // ✅ Cookies kept
    headers: getAuthHeaders(),  // 🔥 Added auth headers
    body: JSON.stringify({ productId: id })
  })

  const responseData = await response.json()
  
  if (response.ok) {
    toast.success(responseData.message)
  } else {
    toast.error(responseData.message)
  }
  
  return responseData
}

export default addToCart