import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const UserOrders = () => {
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

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const calculateDates = (eventDate, rentalDuration) => {
        if (!eventDate) return {};

        const event = new Date(eventDate);

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
                    <p>You haven't placed any orders yet.</p>
                ) : (
                    orders.map((order) => {
                        // Calculate order breakdown
                        const subtotal = order.items.reduce((acc, item) => acc + (item.price * (item.rentalDuration || 3)), 0);
                        const estimatedTaxes = 700;
                        const deliveryFee = 200;
                        const orderTotal = subtotal + estimatedTaxes + deliveryFee;

                        return (
                            <div key={order._id} className="p-6 mb-6 bg-white shadow-sm">


                                {/* Order Items */}
                                <div className="mb-4">
                                    <h3 className="text-md font-semibold mb-3">Items:</h3>
                                    {order.items.map((item) => {
                                        const product = item.productData || item;
                                        const { delivery, pickup } = calculateDates(
                                            item.rentalStartDate,
                                            item.rentalDuration || 3
                                        );

                                        return (
                                            <div key={item._id} className="flex gap-6 border-b pb-4 mb-4 last:border-b-0">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-24 h-28 object-cover rounded"
                                                />

                                                <div className="flex-1">
                                                    <h4 className="text-md font-medium">{product.name}</h4>
                                                    <p className="text-sm text-gray-700">
                                                        ₹{product.price} &nbsp; Size: {product.size}
                                                    </p>
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-5 lg:gap-20 mt-2">
                                                        <div>
                                                            <p className="text-xs text-gray-500">
                                                                Rental Start: {formatDate(item.rentalStartDate)}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Rental End: {formatDate(item.rentalEndDate)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600">Expected Delivery: {delivery}</p>
                                                            <p className="text-xs text-gray-600">Expected Pickup: {pickup}</p>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        );
                                    })}

                                    <div> <span>Order Total: Rs.{orderTotal} </span>    </div>
                                    <div>  <span>Payment Method: {order.payment?.method}</span>  </div>

                                </div>
                            </div>
                        );
                    })
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

export default UserOrders;
