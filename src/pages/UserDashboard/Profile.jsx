import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({
    phoneNumber: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    bustSize: '',
    bodyType: '',
    primaryDressSize: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        // console.log("Sending token:", token);

        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/userinfo`, {

            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData(res.data);
          setForm({
            phoneNumber: res.data.phoneNumber || '',
            heightFeet: res.data.heightFeet || '',
            heightInches: res.data.heightInches || '',
            weight: res.data.weight || '',
            bustSize: res.data.bustSize || '',
            bodyType: res.data.bodyType || '',
            primaryDressSize: res.data.primaryDressSize || '',
          });
        } catch (err) {
          console.error("Error fetching user:", err.response?.status, err.response?.data || err.message);
        }
      }
    }
    fetchUser();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/updateUserProfile`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Changes saved successfully!');
      } catch {
        alert(err.response?.data?.message || 'Failed to save changes');
      } finally {
        setSaving(false);
      }
    }
  };




  if (!userData) return <p className="p-6 text-center">Loading profile...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800">MY PROFILE</h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col">

        <h3 className="text-lg font-medium text-gray-600 mt-6">ACCOUNT DETAILS</h3>
        <div className="flex flex-wrap gap-6 mt-4">

          <label className="mb-1 text-gray-700">Name</label>
          <input type="text" value={userData.name} disabled
            className="border-b border-gray-300 py-2 focus:outline-none cursor-not-allowed" />

        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          <div className="flex-1 min-w-[210px] flex flex-col">
            <label className="mb-1 text-gray-700">Email</label>
            <input type="email" value={userData.email} readOnly
              className="border-b border-gray-300 py-2 focus:outline-none cursor-not-allowed" />
          </div>

          <div className="flex-1 min-w-[210px] flex flex-col">
            <label className="mb-1 text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={10}
              required                       // <--- make it required
              className="border-b border-gray-300 py-2 focus:outline-none"
            />
          </div>


        </div>

        <h3 className="text-lg font-medium text-gray-600 mt-8">MEASUREMENTS</h3>
        <div className="flex flex-wrap gap-6 mt-4">

          {/* Height */}

          <div className="flex-1 min-w-[140px] flex flex-col">
            <label className="mb-1 text-gray-700">Feet</label>
            <select name="heightFeet" value={form.heightFeet} onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:outline-none">
              <option value="">--</option>
              {[...Array(8).keys()].map(i => (
                <option key={i} value={i + 3}>{i + 3}</option>
              ))}
            </select>
          </div>


          <div className="flex-1 min-w-[140px] flex flex-col">
            <label className="mb-1 text-gray-700">Inches</label>
            <select name="heightInches" value={form.heightInches} onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:outline-none">
              <option value="">--</option>
              {[...Array(12).keys()].map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          {/* weight */}

          <div className="flex-1 min-w-[140px] flex flex-col">
            <label className="mb-1 text-gray-700">Weight</label>
            <input type="number" name="weight" value={form.weight} onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:outline-none" />
          </div>

        </div>

        <div className="flex flex-wrap gap-6 mt-6">

          {/* bust size */}

          <div className="flex-1 min-w-[180px] flex flex-col">
            <label className="mb-1 text-gray-700">Bust Size</label>
            <select name="bustSize" value={form.bustSize} onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:outline-none">
              <option value="">Select</option>
              {['32', '34', '36', '38', '40'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* body type */}

          <div className="flex-1 min-w-[180px] flex flex-col">
            <label className="mb-1 text-gray-700">Body Type</label>
            <select name="bodyType" value={form.bodyType} onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:outline-none">
              <option value="">Select</option>
              {['Slim', 'Athletic', 'Curvy', 'Plus'].map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dress Size */}

        <div className="flex flex-wrap gap-6 mt-6">
          <div className="flex-1 min-w-full sm:min-w-[220px] flex flex-col">
            <label className="mb-1 text-gray-700">Primary Dress Size</label>
            <select name="primaryDressSize" value={form.primaryDressSize} onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:outline-none">
              <option value="">Select</option>
              {['XS', 'S', 'M', 'L', 'XL'].map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          <button type="submit"
            disabled={saving}
            className="bg-black text-white py-2 px-6 rounded font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {saving ? 'Saving...' : 'SAVE CHANGES'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

