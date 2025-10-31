import React, { useState } from 'react';
import { getAuth } from "firebase/auth";

const Address = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pinCode: ''
  });


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("User not logged in");
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Address saved successfully!");
        setForm({
          name: "",
          phone: "",
          pincode: "",
          addressLine: "",
          city: "",
          state: "",
          country: "",
        });
      } else {
        alert(data.message || "Failed to save address");
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-2">ADD ADDRESS</h2>
      <p className="text-gray-600 mb-6">SHIPPING ADDRESS</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <input
            name="name"
            placeholder="Name*"
            onChange={handleChange}
            required
            className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700"
          />
        </div>

        {/* Email & Mobile */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
          <input
            name="email"
            placeholder="Email ID*"
            onChange={handleChange}
            required
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700"
          />
          <input
            name="mobile"
            placeholder="Mobile Number*"
            onChange={handleChange}
            required
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700"
          />
        </div>

        {/* Address Lines */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
          <input
            name="addressLine1"
            placeholder="Address Line1*"
            onChange={handleChange}
            required
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700"
          />
          <input
            name="addressLine2"
            placeholder="Address Line2"
            onChange={handleChange}
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700"
          />
        </div>

        {/* City / State / Country */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
          <input
            name="city"
            placeholder="City*"
            onChange={handleChange}
            required
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700"
          />
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700 bg-transparent"
          >
            <option value="">Select State*</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
          </select>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700 bg-transparent"
          >
            <option value="India">India</option>
          </select>
        </div>

        {/* Pin Code */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 items-center">
          <input
            name="pinCode"
            placeholder="Pin Code*"
            onChange={handleChange}
            required
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-gray-700"
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
};

export default Address;


// import React, { useState } from 'react';
// import './Address.css';

// const Address = () => {
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     mobile: '',
//     addressLine1: '',
//     addressLine2: '',
//     city: '',
//     state: '',
//     country: 'India',
//     pinCode: ''
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/address`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // if using JWT/Firebase
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (res.ok) alert("Address saved successfully!");
//       else alert(data.message || "Failed to save address");
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong!");
//     }
//   };

//   return (
//     <div className="address-form-container">
//       <h2>ADD ADDRESS</h2>
//       <p className="section-title">SHIPPING ADDRESS</p>
//       <form onSubmit={handleSubmit} className="address-form">
//         <div className="form-row">
//           <input name="firstName" placeholder="First Name*" onChange={handleChange} required />
//           <input name="lastName" placeholder="Last Name*" onChange={handleChange} />
//         </div>
//         <div className="form-row">
//           <input name="email" placeholder="Email ID*" onChange={handleChange} required />
//           <input name="mobile" placeholder="Mobile Number*" onChange={handleChange} required />
//         </div>
//         <div className="form-row">
//           <input name="addressLine1" placeholder="Address Line1*" onChange={handleChange} required />
//           <input name="addressLine2" placeholder="Address Line2" onChange={handleChange} />
//         </div>

//         <div className="form-row">
//           <input name="city" placeholder="City*" onChange={handleChange} required />
//           <select name="state" value={form.state} onChange={handleChange} required>
//             <option value="">Select State*</option>
//             <option value="Delhi">Delhi</option>
//             <option value="Maharashtra">Maharashtra</option>
//             <option value="Karnataka">Karnataka</option>
//           </select>

//           <select name="country" value={form.country} onChange={handleChange}>
//             <option value="India">India</option>
//           </select>

//         </div>
//         <div className="form-row">
//           <input name="pinCode" placeholder="Pin Code*" onChange={handleChange} required />
//           <select name="country" onChange={handleChange}>
//             <option value="India">India</option>
//             F          </select>
//         </div>
//         <button type="submit" className="submit-btn1">Save Address</button>
//       </form>
//     </div>
//   );
// };

// export default Address;
