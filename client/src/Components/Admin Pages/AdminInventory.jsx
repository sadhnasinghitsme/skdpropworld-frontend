""; // --- AdminInventory.jsx (Updated with Cloudinary integration and Fari functionality) ---

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const AdminInventory = () => {
  const [inventories, setInventories] = useState([]);
  const [form, setForm] = useState({
    heading: "",
    location: "",
    type: "",
    status: "available",
    description: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchInventories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/inventories`);
      const data = Array.isArray(res.data) ? res.data : []; // ✅ Safe fallback
      setInventories(data);
    } catch {
      toast.error("Failed to fetch inventory");
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dfigx6dgg/image/upload`,
        formData
      );
      return {
        url: res.data.secure_url,
        public_id: res.data.public_id,
      };
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("heading", form.heading);
      formData.append("location", form.location);
      formData.append("type", form.type);
      formData.append("status", form.status);
      formData.append("description", form.description);
      if (form.image) {
        formData.append("image", form.image); // append actual file
      }

      if (editId) {
        await axios.put(
          `${API_BASE}/api/admin/inventories/${editId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Inventory updated!");
      } else {
        await axios.post(`${API_BASE}/api/admin/inventories`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Inventory added!");
      }

      setForm({
        heading: "",
        location: "",
        type: "",
        status: "available",
        description: "",
        image: null,
      });
      setEditId(null);
      fetchInventories();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Error saving inventory");
    }
  };

  const handleEdit = (inv) => {
    setForm({
      heading: inv.heading,
      location: inv.location,
      type: inv.type,
      status: inv.status,
      description: inv.description,
      image: null,
    });
    setEditId(inv._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/inventories/${id}`);
      toast.success("Inventory deleted");
      fetchInventories();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container p-4">
      <Helmet>
        <title>YEIDA Inventories - SKD Propworld Admin</title>
        <meta
          name="description"
          content="Manage YEIDA inventory pamphlets with status and location."
        />
      </Helmet>

      <h1 className="mb-4 text-warning">Add to YEIDA Inventories</h1>
      <form onSubmit={handleSubmit} className="row g-3 mb-5">
        <div className="col-md-6">
          <label className="form-label text-white">Heading</label>
          <input
            type="text"
            name="heading"
            value={form.heading}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-white">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-white">Type</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-white">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label text-white">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="form-control"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-white">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="form-control"
          />
        </div>
        {!form.image && editId && (
          <div className="col-md-6">
            <label className="form-label text-white">Current Image</label>
            <img
              src={
                inventories.find((inv) => inv._id === editId)?.image?.url || ""
              }
              alt="Current"
              className="img-fluid rounded"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        <div className="col-12">
          <button type="submit" className="btn btn-dark">
            {editId ? "Update" : "Add"} Inventory
          </button>
        </div>
      </form>

      <h4 className="mb-3 text-white">Existing Inventories</h4>
      <div className="row">
        {inventories.map((inv) => (
          <div className="col-md-4 mb-4" key={inv._id}>
            <div className="card h-100">
              {inv.image && (
                <img
                  src={inv.image?.url}
                  alt="inventory"
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <span className="badge bg-primary float-end">{inv.status}</span>
                <h5 className="card-title">{inv.heading}</h5>
                <p>
                  <strong>Location:</strong> {inv.location}
                </p>
                <p>
                  <strong>Type:</strong> {inv.type}
                </p>
                <div dangerouslySetInnerHTML={{ __html: inv.description }} />
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  onClick={() => handleEdit(inv)}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(inv._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {inventories.length === 0 && (
          <p className="text-white">No inventories available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
