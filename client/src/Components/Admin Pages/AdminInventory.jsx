import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const AdminInventory = () => {
  const [activeTab, setActiveTab] = useState("inventory");
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
  
  // Settings state
  const [settings, setSettings] = useState({
    contactPhone: "+91 9091010909",
    whatsappNumber: "919091010909",
    contactEmail: "info@skdpropworld.com",
    viewDetailsButtonText: "View Details",
    contactButtonText: "Contact Us",
    whatsappMessageTemplate: "Hi! I'm interested in the property: {propertyName} located at {location}. Can you provide more details?",
    pageTitle: "Available Plots & Properties",
    pageSubtitle: "Discover premium YEIDA plots with clear documentation and competitive pricing",
    showContactButton: true,
    showViewDetailsButton: true,
    enableWhatsappContact: true,
    enablePhoneContact: true,
    enableEmailContact: false
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchInventories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/inventories`);
      const data = Array.isArray(res.data) ? res.data : [];
      setInventories(data);
    } catch {
      toast.error("Failed to fetch inventory");
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/inventories/settings`);
      if (res.data) {
        const { _id, createdAt, updatedAt, __v, ...rest } = res.data;
        setSettings({ ...settings, ...rest });
      }
    } catch (err) {
      console.log("Settings not found, using defaults");
    }
  };

  const saveSettings = async () => {
    try {
      const { _id, createdAt, updatedAt, __v, ...payload } = settings;
      await axios.post(`${API_BASE}/api/admin/inventories/settings`, payload);
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  useEffect(() => {
    fetchInventories();
    fetchSettings();
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
        <title>Inventory Management - SKD Propworld Admin</title>
        <meta
          name="description"
          content="Comprehensive inventory management system with settings and CRUD operations."
        />
      </Helmet>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-warning">📋 Inventory Management System</h1>
        <div className="btn-group">
          <button
            className={`btn ${activeTab === "inventory" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setActiveTab("inventory")}
          >
            📦 Manage Inventory
          </button>
          <button
            className={`btn ${activeTab === "settings" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
          <button
            className={`btn ${activeTab === "preview" ? "btn-warning" : "btn-outline-warning"}`}
            onClick={() => setActiveTab("preview")}
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Inventory Management Tab */}
      {activeTab === "inventory" && (
        <div>
          <h2 className="mb-4 text-white">Add/Edit Inventory Items</h2>
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
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div>
          <h2 className="mb-4 text-white">⚙️ Inventory System Settings</h2>
          
          <div className="row">
            <div className="col-md-6">
              <div className="card bg-dark text-white mb-4">
                <div className="card-header">
                  <h5>📞 Contact Information</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                      placeholder="+91 9091010909"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">WhatsApp Number (without +)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})}
                      placeholder="919091010909"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      placeholder="info@skdpropworld.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card bg-dark text-white mb-4">
                <div className="card-header">
                  <h5>🎨 Button & Text Settings</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">View Details Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.viewDetailsButtonText}
                      onChange={(e) => setSettings({...settings, viewDetailsButtonText: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Button Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.contactButtonText}
                      onChange={(e) => setSettings({...settings, contactButtonText: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Page Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.pageTitle}
                      onChange={(e) => setSettings({...settings, pageTitle: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Page Subtitle</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={settings.pageSubtitle}
                      onChange={(e) => setSettings({...settings, pageSubtitle: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card bg-dark text-white mb-4">
                <div className="card-header">
                  <h5>💬 WhatsApp Message Template</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Message Template</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={settings.whatsappMessageTemplate}
                      onChange={(e) => setSettings({...settings, whatsappMessageTemplate: e.target.value})}
                      placeholder="Use {propertyName} and {location} as placeholders"
                    />
                    <small className="text-muted">
                      Use <code>{"{propertyName}"}</code> and <code>{"{location}"}</code> as placeholders
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card bg-dark text-white mb-4">
                <div className="card-header">
                  <h5>🔧 Feature Toggles</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.showViewDetailsButton}
                          onChange={(e) => setSettings({...settings, showViewDetailsButton: e.target.checked})}
                        />
                        <label className="form-check-label">Show View Details Button</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.showContactButton}
                          onChange={(e) => setSettings({...settings, showContactButton: e.target.checked})}
                        />
                        <label className="form-check-label">Show Contact Button</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check form-switch mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.enableWhatsappContact}
                          onChange={(e) => setSettings({...settings, enableWhatsappContact: e.target.checked})}
                        />
                        <label className="form-check-label">Enable WhatsApp Contact</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <button onClick={saveSettings} className="btn btn-success btn-lg">
                💾 Save All Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div>
          <h2 className="mb-4 text-white">👁️ Live Preview</h2>
          <div className="alert alert-info">
            <h5>📋 Current Settings Preview:</h5>
            <p><strong>Page Title:</strong> {settings.pageTitle}</p>
            <p><strong>Page Subtitle:</strong> {settings.pageSubtitle}</p>
            <p><strong>Contact Phone:</strong> {settings.contactPhone}</p>
            <p><strong>WhatsApp:</strong> {settings.whatsappNumber}</p>
            <p><strong>View Details Button:</strong> "{settings.viewDetailsButtonText}" {settings.showViewDetailsButton ? "✅" : "❌"}</p>
            <p><strong>Contact Button:</strong> "{settings.contactButtonText}" {settings.showContactButton ? "✅" : "❌"}</p>
          </div>
          
          <div className="card bg-dark text-white">
            <div className="card-header d-flex justify-content-between">
              <h5>🌐 Public Page Preview</h5>
              <a 
                href="/inventory" 
                target="_blank" 
                className="btn btn-sm btn-primary"
              >
                Open Live Page
              </a>
            </div>
            <div className="card-body">
              <p>The inventory page will use these settings:</p>
              <ul>
                <li>Total Inventory Items: <strong>{inventories.length}</strong></li>
                <li>WhatsApp Contact: <strong>{settings.enableWhatsappContact ? "Enabled" : "Disabled"}</strong></li>
                <li>Message Template: <em>"{settings.whatsappMessageTemplate}"</em></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
