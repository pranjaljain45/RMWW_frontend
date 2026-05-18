import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderSummary = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        // Fetch the current order from database
        const fetchOrder = async () => {
            try {
                const user = auth.currentUser;

                if (!user) {
                    setLoading(false);
                    return;
                }

                const uid = user.uid;
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/orders/curr-order/${uid}`
                );
                const data = await res.json();

                if (data.success && data.order) {
                    setOrder(data.order);
                }
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [auth]);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const calculateDates = (eventDate, rentalDuration) => {
        if (!eventDate) return {};

        const event = new Date(eventDate);

        // delivery = event - 1
        const delivery = new Date(event);
        delivery.setDate(event.getDate() - 1);

        // return = event + duration - 1
        const ret = new Date(event);
        ret.setDate(event.getDate() + rentalDuration - 1);

        // pickup = return + 2
        const pickup = new Date(ret);
        pickup.setDate(ret.getDate() + 2);

        return {
            delivery: formatDate(delivery),
            returnDate: formatDate(ret),
            pickup: formatDate(pickup),
        };
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading order details...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-xl text-gray-600">Loading your order...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="max-w-5xl mx-auto p-6 my-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600">
                    Thank you for your order. We'll send you a confirmation email shortly.
                </p>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-md p-2 mb-4">
                    <h2 className="text-xl font-semibold  border-b pb-2">
                        Order Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-6">
                        <p className="text-sm text-gray-600">Order Status :  {order.orderStatus}</p>
                        <p className="text-sm text-gray-600">Order Date: {formatDate(order.placedAt)}</p>
                        <p className="text-sm text-gray-600">Payment Method: {order.payment?.method}</p>
                        <p className="text-sm text-gray-600">Payment Status: {order.payment?.status}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-3">
                        Order Items
                    </h2>

                    <div className="space-y-6">
                        {order.items?.map((item, idx) => {
                            const dates = calculateDates(
                                item.rentalStartDate,
                                item.rentalDuration || 2
                            );

                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row gap-4 border-b pb-4 last:border-b-0"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full sm:w-32 h-40 object-cover rounded"
                                    />

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Size: {item.size}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Price: ₹{item.price} / day
                                        </p>

                                        <div className="mt-3 space-y-1">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Event Date:</span>{' '}
                                                {formatDate(item.rentalStartDate)}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">Return Date:</span>{' '}
                                                {dates.returnDate}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">
                                                    Expected Delivery:
                                                </span>{' '}
                                                {dates.delivery}
                                            </p>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">
                                                    Expected Pickup:
                                                </span>{' '}
                                                {dates.pickup}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right sm:text-left">
                                        <p className="text-lg font-bold text-gray-800">
                                            ₹{item.price * (item.rentalDuration || 2)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>



                {/* Price Summary */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold pb-2">
                        Price Summary
                    </h2>

                    <div>
                        <div className="flex justify-between text-gray-700">
                            <span>Subtotal</span>
                            <span className="font-semibold">Rs.{order.totalAmount}</span>
                        </div>

                        {order.refundableDeposit > 0 && (
                            <div className="flex justify-between text-gray-700 pt-2">
                                <div>
                                    <p className="font-semibold">Refundable Deposit</p>
                                    <p className="text-sm text-gray-500">
                                        Will be refunded after return
                                    </p>
                                </div>
                                <span className="font-semibold">
                                    Rs.{order.refundableDeposit}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between text-xl font-bold text-gray-900   pt-3">
                            <span>Total Amount</span>
                            <span>
                                Rs.{order.totalAmount + (order.refundableDeposit || 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/myaccount/orders')}
                        className="bg-gray-800 text-white px-8 py-3 rounded font-semibold hover:bg-gray-700"
                    >
                        View All Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#602e74] text-white px-8 py-3 rounded font-semibold hover:bg-[#6b4e7f]"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default OrderSummary;
