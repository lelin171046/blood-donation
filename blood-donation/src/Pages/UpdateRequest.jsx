import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/Hook/useAuth";
import useAxiosSecure from "@/Hook/useAxiosSecure";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const districts = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara"],
  Chattogram: ["Pahartali", "Panchlaish"],
  Khulna: ["Sonadanga", "Khalishpur"],
  Sylhet: ["Beanibazar", "Zindabazar"],
};

const UpdateRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState(null);
  const [upazilas, setUpazilas] = useState([]);

  useEffect(() => {
    if (!loading && user?.status === "blocked") {
      navigate("/blocked");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    axiosSecure.get(`/donation-requests/${id}`).then(res => {
      setFormData(res.data);
     
    });
  }, [axiosSecure, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "recipientDistrict") {
      setUpazilas(districts[value] || []);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        recipientUpazila: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      requesterName: user.displayName,
      requesterEmail: user.email,
      status: "pending",
    };

    await axiosSecure.patch(`/donation-requests/${id}`, updated);
    navigate("/dashboard/my-requests");
  };

  if (!formData) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Update Donation Request</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label>Requester Name</label> 
          l
          <Input type="text" value={user.displayName} readOnly />
        </div>
        <div>
          <label>Requester Email</label>
          <Input type="email" value={user.email} readOnly />
        </div>
        <div>
          <label>Recipient Name</label>
          <Input name="recipientName" value={formData.recipientName} onChange={handleChange} required />
        </div>
        <div>
          <label>Recipient District</label>
          <select name="recipientDistrict" value={formData.recipientDistrict} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select District</option>
            {Object.keys(districts).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Recipient Upazila</label>
          <select name="recipientUpazila" value={formData.recipientUpazila} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">Select Upazila</option>
            {upazilas.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Hospital Name</label>
          <Input name="hospitalName" value={formData.hospitalName} onChange={handleChange} required />
        </div>
        <div>
          <label>Full Address</label>
          <Input name="fullAddress" value={formData.fullAddress} onChange={handleChange} required />
        </div>
        <div>
          <label>Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select Blood Group</option>
            {bloodGroups.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Donation Date</label>
          <Input type="date" name="donationDate" value={formData.donationDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Donation Time</label>
          <Input type="time" name="donationTime" value={formData.donationTime} onChange={handleChange} required />
        </div>
        <div>
          <label>Request Message</label>
          <Textarea name="requestMessage" value={formData.requestMessage} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full mt-4">Update Request</Button>
      </form>
    </div>
  );
};

export default UpdateRequest;
