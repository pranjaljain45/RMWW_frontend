import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const base = import.meta.env.VITE_BACKEND_URL;

  const getProductJsonPath = (item) =>
    `${base}/api/products/${item.gender}/${item.category}/${item.subcategory}`;


  const fetchProductData = async (item) => {
    try {
      const path = getProductJsonPath(item);
      const res = await fetch(path);
      const products = await res.json();
      return products.find((p) => p.imageUrl === item.imageUrl) || item;
    } catch (err) {
      console.error("Failed to fetch product JSON:", err);
      return item;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        try {
          const res = await fetch(`${base}/api/orders/user-orders/${uid}`);
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      }
    });
    return () => unsubscribe();
  }, [auth, base]);

  useEffect(() => {

    const loadProductData = async () => {
      const updatedOrders = await Promise.all(
        orders.map(async (order) => {
          const items = await Promise.all(
            order.items.map(async (item) => {
              const productData = await fetchProductData(item);
              return { ...item, productData };
            })
          );
          return { ...order, items };
        })
      );
      setOrders(updatedOrders);
    };

    if (orders.length > 0 && orders[0]?.items?.length > 0 && !orders[0]?.items[0]?.productData) {
      loadProductData();
    }
  }, [orders]);

  const calculateDates = (eventDate, rentalDuration) => {
    if (!eventDate) return {};

    const event = new Date(eventDate);

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // delivery = event - 1
    const delivery = new Date(event);
    delivery.setDate(event.getDate() - 1);

    // return = event + duration -1
    const ret = new Date(event);
    ret.setDate(event.getDate() + rentalDuration - 1);

    // pickup = return + 1
    const pickup = new Date(ret);
    pickup.setDate(ret.getDate() + 2);

    return {
      delivery: formatDate(delivery),
      pickup: formatDate(pickup)
    };
  };


  return (
    <>


      <div className="pt-10 px-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p>You haven’t placed any orders yet.</p>
        ) : (
          orders.map((order) =>
            order.items.map((item) => {
              const product = item.productData || item;
              const { delivery, pickup } = calculateDates(
                item.rentalStartDate,
                item.rentalDuration || 3
              );

              return (
                <div key={item._id} className="flex gap-6 border-b pb-4 mt-4">
                  <img
                    src={`${base}/images/${product.gender}/${product.category}/${product.subcategory}/${product.imageUrl}`}
                    alt={product.name}
                    className="w-24 h-28 object-cover rounded"
                  />

                  <div>
                    <h4 className="text-md font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-700">
                      ₹{product.price} &nbsp; Size: {product.size}
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-5 lg:gap-20">
                      <div>
                        <p className="text-xs text-gray-500">
                          Rental Start: {new Date(item.rentalStartDate).toDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rental End: {new Date(item.rentalEndDate).toDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Expected Delivery: {delivery}</p>
                        <p className="text-xs text-gray-600">Expected Pickup: {pickup}</p>
                      </div>
                    </div>

                    <h3 className="text-sm font-semibold">
                      Order Total: ₹{order.totalAmount}
                    </h3>
                  </div>
                </div>
              );
            })


          )
        )}
        <button
          onClick={() => navigate("/")}
          className='bg-[#602e74] text-white px-16 py-3 text-md font-semibold mt-6'
        >
          Continue Shopping
        </button>
      </div>




    </>
  );
};

export default Orders;

