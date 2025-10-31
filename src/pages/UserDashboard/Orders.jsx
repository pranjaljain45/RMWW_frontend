import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading orders...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">MY ORDERS</h2>

      {orders.length === 0 ? (
        <div className="flex flex-col mt-15 items-center space-y-4">
          <p className="text-lg text-gray-500 uppercase">No orders placed yet</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <p className="font-medium">
                Order #{idx + 1} –{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700">Status: {order.status}</p>
              <p className="text-gray-700">
                Total: <span className="font-semibold">₹{order.totalAmount}</span>
              </p>
              <ul className="mt-2 list-disc list-inside text-gray-600">
                {order.items.map((item, i) => (
                  <li key={i} className="ml-2">
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;