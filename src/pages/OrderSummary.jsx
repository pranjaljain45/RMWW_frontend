import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
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
          const res = await fetch(`${base}/api/orders/curr-order/${uid}`);
          const data = await res.json();
          if (data.success) {
            setOrders(data.order);
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

    if (
      orders.length > 0 && orders[0].items && orders[0].items.length > 0 && !orders[0].items[0].productData
    ) {
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
      <Navbar />

      <h2 className="text-center text-2xl font-semibold mt-12 mb-5">
        ORDER SUMMARY
      </h2>

      <div className="mx-10 max-w-3xl mt-10 space-y-6 lg:mx-auto">
        {orders.map((order) =>
          order.items.map((item) => {
            const product = item.productData || item;
            const { delivery, pickup } = calculateDates(
              item.rentalStartDate,
              item.rentalDuration || 3
            );

            return (
              <div key={item._id} className="flex gap-6 border-b pb-4">
                <img
                  src={`${base}/images/${product.gender}/${product.category}/${product.subcategory}/${product.imageUrl}`}
                  alt={product.name}
                  className="w-24 h-28 object-cover rounded"
                />

                <div>
                  <h4 className="text-lg font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-700">
                    ₹{product.price} &nbsp; Size: {product.size}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-5 lg:gap-20">

                    <div>

                      <p className="text-sm text-gray-500">
                        Rental Start: {new Date(item.rentalStartDate).toDateString()}
                      </p>
                      <p className="text-sm  text-gray-500">
                        Rental End: {new Date(item.rentalEndDate).toDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Expected Delivery: {delivery}
                      </p>

                      <p className="text-sm text-gray-600">
                        Expected Pickup: {pickup}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {orders.length > 0 && (
          <div className="flex justify-between mt-3 text-lg font-semibold">
            <span>Total Amount</span>
            <span>₹{orders.totalAmount}</span>
          </div>
        )}
      </div>

      <div className="text-center mt-8">

        <button
          onClick={() => navigate("/")}
          className='bg-[#602e74] text-white px-16 py-3 text-md font-semibold'
        >
          Continue Shopping
        </button>

      </div>

      <Footer />
    </>
  );
};

export default OrderSummary;
