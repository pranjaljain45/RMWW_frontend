import React, { useContext, useEffect, useState } from 'react';
import './OrderSummary.css';
import CartDrawer from '../../components/SideCart/CartDrawer';
import { Link } from 'react-router-dom';
import { CartContext } from '../../components/CartContext/CartContext';
import { getAuth } from 'firebase/auth';

const OrderSummary = () => {
  const { cartItems } = useContext(CartContext);
  const [userEmail, setUserEmail] = useState('');
  const [showCart, setShowCart] = useState(false); // <-- this line fixes your error

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    }
  }, []);


  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const refundableDeposit = cartItems.reduce((acc, item) => {
    const refund = Number(item.price) - 500;
    return acc + (refund > 0 ? refund : 0);
  }, 0);

  const estimatedTaxes = 900;
  const total = subtotal + estimatedTaxes;

  return (

    <>

      {/* NAVBAR */}

      <div className="navbar-order-page">
        <div className="navbar-overlay" />

        <div className="navbar-content">

          <div className="site-title">
            <h3>RentMy</h3>
            <h2>Wedding</h2>
            <h3>Wear</h3>
          </div>

          <div className="navbar-right">
            <span className="user-email">{userEmail}</span>
            <Link to="#" onClick={() => setShowCart(true)} className="cart-icon">
              <i className="fas fa-shopping-bag icon" title="Cart"></i>
              {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
            </Link>
          </div>
        </div>
      </div>


      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
      <div className="order-summary-container">

        {/* LEFT SIDE: Account + Delivery + Payment */}

        <div className="left-section">
          {/* Account Email */}
          <div className="account-box">
            <h3>Account</h3>
            <p>{userEmail}</p>
            <label>
              <input type="checkbox" />
              Email me with news and offers
            </label>
          </div>

          {/* Delivery Form */}
          <div className="delivery-box">
            <h3>Delivery</h3>

            <form>

              <input type="text" value="India" readonly />


              <div className="name-fields">
                <input type="text" placeholder="First name" required />
                <input type="text" placeholder="Last name" />
              </div>
              <input type="text" placeholder="Company (optional)" />
              <input type="text" placeholder="Address" required />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" />
              <div className="city-section">
                <input type="text" placeholder="City" required />
                <select name="state" required defaultValue="">
                  <option value="" disabled>
                    State
                  </option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>

                <input type="text" placeholder="PIN code" required />
              </div>
              <input type="text" placeholder="Phone" required />
            </form>

          </div>

          {/* Razorpay Payment */}
          {/* <div className="payment-section">
            <h2>Payment</h2>
            <div className="payment-box">
              <p>Razorpay Secure (UPI, Cards, Wallets, NetBanking)</p>
              <img src="/assets/razorpay-ui.png" alt="Razorpay" width="100%" />
              <p>After clicking “Pay now”, you'll be redirected to Razorpay to complete your purchase securely.</p>
            </div>
          </div> */}

          {/* Billing Address */}
          <div className="billing-address">
            <h3>Billing address</h3>
            <label><input type="radio" name="billing" /> Same as shipping address</label>
            <label><input type="radio" name="billing" defaultChecked /> Use a different billing address</label>
            <form>

              <input type="text" value="India" readonly />

              <div className="name-fields">
                <input type="text" placeholder="First name" />
                <input type="text" placeholder="Last name" />
              </div>
              <input type="text" placeholder="Company (optional)" />
              <input type="text" placeholder="Address" />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" />
              <div className="city-section">
                <input type="text" placeholder="City" required />
                <select name="state" required defaultValue="">
                  <option value="" disabled>
                    State
                  </option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>

                <input type="text" placeholder="PIN code" required />
              </div>
              <input type="text" placeholder="Phone (optional)" />
            </form>
            <button className="pay-now">Pay now</button>
          </div>
        </div>

        {/* RIGHT SIDE: Cart Summary */}
        <div className="right-section">
          <div className="cart-summary">
            {cartItems.map((item, index) => (
              <div className="item" key={index}>
                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.imageUrl}`} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <small> 4 Days / {item.size}</small>
                </div>
                <p>₹{item.price}</p>
              </div>
            ))}

            {/* Refundable Deposit */}
            <div className="item">
              <div><p>Refundable Deposit</p></div>
              <p>₹{refundableDeposit}</p>
            </div>
          </div>

          {/* Totals */}
          <div className="totals">
            <div className="discount">
              <input type="text" placeholder="Discount code" />
              <button>Apply</button>
            </div>

            <p>Subtotal · {cartItems.length} items <span>₹{subtotal}</span></p>
            <p>Shipping <span>Enter shipping address</span></p>
            <p>Estimated taxes <span>₹{estimatedTaxes}</span></p>
            <h3>Total <span>INR ₹{total}</span></h3>
          </div>
        </div>
      </div >
    </>
  );
};

export default OrderSummary;
