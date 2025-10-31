import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar/Navbar';
import Footer from "../components/Footer/Footer";

const Login = () => {

  const demoEmail = "dummy@gmail.com";
  const demoPassword = "Dummy@11";

  const [email, setEmail] = useState(demoEmail);
  const [password, setPassword] = useState(demoPassword);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (auth.currentUser) {
        await signOut(auth);
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      navigate("/");

    } catch (err) {
      console.error("Login error", err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(`Login failed. (${err.message})`);
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="text-center px-4 py-12 md:py-16">
        <h2 className="text-3xl font-semibold mt-10 mb-6">Say “I Do” to Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col items-center w-[90%] sm:max-w-90 m-auto mt-14 gap-4 text-gray-500">

          <div className="flex flex-col gap-8 w-full justify-center">

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />

          </div>

          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer">Forget your password?</p>
            <p className="cursor-pointer"><a href="/signup" className="hover:underline">Create account</a></p>
          </div>

          <button
            type="submit"
            className="bg-[#602e74] mt-5 text-white px-8 py-3 rounded-md font-medium text-lg hover:bg-[#4f2660] transition"
          >
            Sign In
          </button>

        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}

      </div>

      <Footer />

    </>
  );
};

export default Login;

