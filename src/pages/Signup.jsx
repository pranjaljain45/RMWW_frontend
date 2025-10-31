import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  const checkPasswordRules = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters long.');
    if (!/[A-Z]/.test(password)) errors.push('Password must include at least one uppercase letter.');
    if (!/[a-z]/.test(password)) errors.push('Password must include at least one lowercase letter.');
    if (!/\d/.test(password)) errors.push('Password must include at least one number.');
    if (!/[\W_]/.test(password)) errors.push('Password must include at least one special character.');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordErrors(checkPasswordRules(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password, name } = formData;

    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // console.log("Firebase signup success:", userCredential.user);

      // Send uid, email, and name to your backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        uid: user.uid,
        email,
        name
      });

      // console.log('Backend response:', response.data);



      navigate('/');
      alert('Signup successful!');
    } catch (err) {
      console.log("Signup error:", err.response ? err.response.data : err.message);

      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 8 characters');
      } else {
        setError(err.response?.data?.message || 'Signup failed. Please try again.');
      }
    }

  };




  const handleNavigation = () => navigate('/');

  return (
    <>
      <Navbar />


      <div className="text-center px-4 py-12 md:py-16">
        <h2 className="text-3xl font-semibold mt-10 mb-6">Signup time!</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-[90%] sm:max-w-90 m-auto mt-14 gap-4 text-gray-500">
          <div className="flex flex-col gap-8 w-full justify-center">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />

            {passwordErrors.length > 0 && (
              <div className="text-sm text-red-600 space-y-1 w-full text-left">
                {passwordErrors.map((err, idx) => <p key={idx}>{err}</p>)}
              </div>
            )}
          </div>

          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer">Forget your password?</p>
            <p className="cursor-pointer"><a href="/login" className="hover:underline">Login here</a></p>
          </div>

          <div className='flex gap-8'>
            <button
              type="submit"
              className="bg-[#602e74] mt-5 text-white px-8  rounded-md font-medium text-md hover:bg-[#4f2660] transition"
            >
              Submit
            </button>


            <button
              type="button"
              onClick={handleNavigation}
              className="bg-[#602e74] mt-5 text-white px-8 py-3 rounded-md font-medium text-md hover:bg-[#4f2660] transition"
            >
              Cancel
            </button>


          </div>

        </form >

      </div >


      <Footer />
    </>
  );
};

export default Signup;
