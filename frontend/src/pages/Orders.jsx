import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-hot-toast'
import { Context } from '@/context/ProductContext.jsx'

const Orders = () => {
  const [fetchOrders, setFetchOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const { backendUrl } = useContext(Context)

  const handleOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${backendUrl}/product/orders`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const responseData = await response.json()
      console.log("response for orders", responseData)

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to fetch orders")
      }

      setFetchOrders(responseData.data || [])
      toast.success("Orders fetched successfully")

    } catch (error) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleOrders()
  }, [])

  return (
    <div className="container mx-auto px-4">
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        fetchOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          fetchOrders.map((order) => (
            <div key={order._id} className="border p-4 mb-3 rounded">
              <p className="font-semibold">{order.name}</p>
              <p>Price: {order.price}</p>
            </div>
          ))
        )
      )}
    </div>
  )
}

export default Orders
