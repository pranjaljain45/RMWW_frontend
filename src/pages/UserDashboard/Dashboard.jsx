import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';

const Dashboard = () => {


  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken(true);

        // console.log('Firebase ID Token:', token);

        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(res.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const isDashboard = location.pathname === '/myaccount';



  return (
    <>
      <Navbar />

      <div className="flex max-w-6xl mx-auto my-8">
        {/* Sidebar */}
        <aside className="w-50 md:w-64 bg-white flex-shrink-0 py-8 px-4">
          <h3 className="text-xl font-bold mt-6 mb-8 text-gray-700 uppercase text-center">
            My Account
          </h3>
          <nav className="flex flex-col items-center space-y-3">
            {['/myaccount', '/myaccount/profile', '/myaccount/address', '/myaccount/orders'].map((to, idx) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded ${isActive
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-800 hover:bg-pink-100'
                  }`
                }
              >
                {['Dashboard', 'My Profile', 'My Address', 'My Orders'][idx]}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="mt-4 text-gray-800 hover:text-pink-600 text-left uppercase"
            >
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <section className="flex-grow bg-white p-8 pl-0 lg:p-8">
          {isDashboard && userData ? (
            <>
              <h2 className="text-2xl font-semibold mb-8">My Dashboard</h2>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="uppercase font-semibold text-lg">
                      {userData.name}
                    </p>
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Link
                    to="/myaccount/profile"
                    className="text-pink-600 hover:underline"
                  >
                    Contact Information
                  </Link>
                  <Link
                    to="/myaccount/address"
                    className="text-pink-600 hover:underline"
                  >
                    Shipping Address
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </section>


      </div>

      <Footer />
    </>
  );
};

export default Dashboard;

