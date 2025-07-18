import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { CountrySelect } from "react-country-state-city";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const districts = {
  Dhaka: ["Dhanmondi", "Mirpur", "Gulshan"],
  Chittagong: ["Pahartali", "Kotwali", "Panchlaish"],
  Rajshahi: ["Boalia", "Rajpara", "Shah Makhdum"],
};

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    avatar: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
 const [country, setCountry] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload avatar to imageBB
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const imageData = new FormData();
    imageData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`,
        imageData
      );
      const imageUrl = res.data.data.url;
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      setAvatarPreview(imageUrl);
    } catch (err) {
      setErrorMsg("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Mutation for registration
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post("/api/register", payload); // adjust endpoint
      return res.data;
    },
    onSuccess: () => {
      setErrorMsg("Registration successful!");
      // optionally reset form or redirect
    },
    onError: (err) => {
      setErrorMsg("Registration failed. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const payload = {
      ...formData,
      role: "donor",
      status: "active",
    };

    mutation.mutate(payload);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register as a Donor</h2>

      {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Avatar Upload */}
        <div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {uploading && <p className="text-gray-500 text-sm">Uploading image...</p>}
          {avatarPreview && (
            <img src={avatarPreview} alt="Preview" className="w-20 h-20 mt-2 rounded-full" />
          )}
        </div>

        {/* Blood Group */}
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        {/* District */}
        {/* <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select District</option>
          {Object.keys(districts).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select> */}
        <CountrySelect
        containerClassName="form-group"
        inputClassName="w-full border p-2 rounded"
        onChange={(_country) => setCountry(_country)}
        onTextChange={(_txt) => console.log(_txt)}
        placeHolder="Select Country"
      />
        {/* Upazila */}
        <select
          name="upazila"
          value={formData.upazila}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          disabled={!formData.district}
          required
        >
          <option value="">Select Upazila</option>
          {formData.district &&
            districts[formData.district].map((upz) => (
              <option key={upz} value={upz}>
                {upz}
              </option>
            ))}
        </select>

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          {mutation.isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
