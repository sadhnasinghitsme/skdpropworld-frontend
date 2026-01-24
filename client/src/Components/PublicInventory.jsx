import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../Footer";
import SupportWidget from "./SupportWidget";
import { Helmet } from "react-helmet-async";
import "./PublicInventory.css";

const PublicInventory = () => {
  const [searchParams] = useSearchParams();
  const [inventories, setInventories] = useState([]);
  const [filteredInventories, setFilteredInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    type: "",
    status: "",
    location: "",
    searchText: ""
  });
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
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    fetchInventories();
    fetchSettings();
  }, []);

  useEffect(() => {
    // Initialize filters from URL parameters
    const urlSearchText = searchParams.get("searchText") || "";
    const urlType = searchParams.get("type") || "";
    
    if (urlSearchText || urlType) {
      setSearchFilters(prev => ({
        ...prev,
        searchText: urlSearchText,
        type: urlType
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    filterInventories();
  }, [inventories, searchFilters]);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE ? `${API_BASE}/api/admin/inventories` : '/api/admin/inventories');
      const data = Array.isArray(res.data) ? res.data : [];
      setInventories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch inventories:", err);
      setError("Failed to load inventory. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(API_BASE ? `${API_BASE}/api/admin/inventories/settings` : '/api/admin/inventories/settings');
      if (res.data) {
        const { _id, createdAt, updatedAt, __v, ...rest } = res.data;
        setSettings((prev) => ({ ...prev, ...rest }));
      }
    } catch (err) {
      console.error("Failed to fetch inventory settings:", err);
    }
  };

  const filterInventories = () => {
    let filtered = [...inventories];

    // Filter by type (Registered/Unregistered)
    if (searchFilters.type) {
      filtered = filtered.filter(item => 
        item.type.toLowerCase().includes(searchFilters.type.toLowerCase())
      );
    }

    // Filter by status
    if (searchFilters.status) {
      filtered = filtered.filter(item => 
        item.status.toLowerCase() === searchFilters.status.toLowerCase()
      );
    }

    // Filter by location
    if (searchFilters.location) {
      filtered = filtered.filter(item => 
        item.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    // Filter by search text
    if (searchFilters.searchText) {
      filtered = filtered.filter(item => 
        item.heading.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
        item.location.toLowerCase().includes(searchFilters.searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchFilters.searchText.toLowerCase())
      );
    }

    setFilteredInventories(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      type: "",
      status: "",
      location: "",
      searchText: ""
    });
  };

  const handleViewDetails = (inventory) => {
    setSelectedInventory(inventory);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInventory(null);
  };

  const handleContactUs = (inventory) => {
    const template =
      settings.whatsappMessageTemplate ||
      "Hi! I'm interested in the property: {propertyName} located at {location}. Can you provide more details?";
    const message = template
      .replace("{propertyName}", inventory.heading || "")
      .replace("{location}", inventory.location || "");

    // Prefer WhatsApp if enabled
    if (settings.enableWhatsappContact && settings.whatsappNumber) {
      const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
      return;
    }

    // Fallback to tel/mail
    if (settings.enablePhoneContact && settings.contactPhone) {
      window.location.href = `tel:${settings.contactPhone}`;
      return;
    }

    if (settings.enableEmailContact && settings.contactEmail) {
      window.location.href = `mailto:${settings.contactEmail}?subject=Property%20Enquiry&body=${encodeURIComponent(
        message
      )}`;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'available': return 'badge bg-success';
      case 'sold': return 'badge bg-danger';
      case 'reserved': return 'badge bg-warning text-dark';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <>
      <Helmet>
        <title>Available Plots & Properties | SKD PropWorld Inventory</title>
        <meta
          name="description"
          content="Browse available YEIDA plots and properties. Find registered and unregistered plots in various sectors with detailed information and pricing."
        />
        <meta
          name="keywords"
          content="YEIDA plots, available properties, registered plots, unregistered plots, real estate inventory, SKD PropWorld"
        />
      </Helmet>

      <Navbar />
      
      <div className="public-inventory-container">
        <div className="container py-5">
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              {settings.pageTitle}
            </h1>
            <p className="lead text-muted">
              {settings.pageSubtitle}
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">🔍 Search & Filter Properties</h5>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Property Type</label>
                      <select
                        name="type"
                        value={searchFilters.type}
                        onChange={handleFilterChange}
                        className="form-select"
                      >
                        <option value="">All Types</option>
                        <option value="Registered">Registered</option>
                        <option value="Unregistered">Unregistered</option>
                        <option value="Semi Commercial">Semi Commercial</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        value={searchFilters.status}
                        onChange={handleFilterChange}
                        className="form-select"
                      >
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                        <option value="reserved">Reserved</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={searchFilters.location}
                        onChange={handleFilterChange}
                        placeholder="e.g., Sector 18"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Search</label>
                      <input
                        type="text"
                        name="searchText"
                        value={searchFilters.searchText}
                        onChange={handleFilterChange}
                        placeholder="Search properties..."
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={clearFilters}
                      className="btn btn-outline-secondary"
                    >
                      Clear Filters
                    </button>
                    <span className="ms-3 text-muted">
                      Showing {filteredInventories.length} of {inventories.length} properties
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading available properties...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              <h4 className="alert-heading">Oops! Something went wrong</h4>
              <p>{error}</p>
              <button onClick={fetchInventories} className="btn btn-outline-danger">
                Try Again
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && filteredInventories.length === 0 && inventories.length > 0 && (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fas fa-search fa-3x text-muted"></i>
              </div>
              <h3>No properties match your search</h3>
              <p className="text-muted">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          )}

          {/* No Inventory Available */}
          {!loading && !error && inventories.length === 0 && (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fas fa-home fa-3x text-muted"></i>
              </div>
              <h3>No Properties Available</h3>
              <p className="text-muted">Please check back later for new listings</p>
            </div>
          )}

          {/* Inventory Grid */}
          {!loading && !error && filteredInventories.length > 0 && (
            <div className="row">
              {filteredInventories.map((inventory) => (
                <div key={inventory._id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow-sm inventory-card">
                    {inventory.image?.url && (
                      <img
                        src={inventory.image.url}
                        alt={inventory.heading}
                        className="card-img-top inventory-image"
                        loading="lazy"
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={getStatusBadgeClass(inventory.status)}>
                          {inventory.status}
                        </span>
                        <span className="badge bg-info">
                          {inventory.type}
                        </span>
                      </div>
                      
                      <h5 className="card-title">{inventory.heading}</h5>
                      
                      <p className="text-muted mb-2">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {inventory.location}
                      </p>
                      
                      <div 
                        className="card-text flex-grow-1"
                        dangerouslySetInnerHTML={{ __html: inventory.description }}
                      />
                      
                      <div className="mt-auto pt-3">
                        <div className="d-grid gap-2">
                          {settings.showViewDetailsButton && (
                            <button 
                              className="btn btn-primary"
                              onClick={() => handleViewDetails(inventory)}
                            >
                              <i className="fas fa-info-circle me-2"></i>
                              {settings.viewDetailsButtonText || "View Details"}
                            </button>
                          )}
                          {settings.showContactButton && (
                            <button 
                              className="btn btn-outline-success"
                              onClick={() => handleContactUs(inventory)}
                            >
                              <i className="fas fa-phone me-2"></i>
                              {settings.contactButtonText || "Contact Us"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      {showModal && selectedInventory && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedInventory.heading}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedInventory.image?.url && (
                  <img
                    src={selectedInventory.image.url}
                    alt={selectedInventory.heading}
                    className="img-fluid mb-3 rounded"
                    style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                  />
                )}
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>📍 Location:</strong> {selectedInventory.location}</p>
                    <p><strong>🏷️ Type:</strong> 
                      <span className="badge bg-info ms-2">{selectedInventory.type}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>📊 Status:</strong> 
                      <span className={`badge ms-2 ${getStatusBadgeClass(selectedInventory.status)}`}>
                        {selectedInventory.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <h6><strong>📝 Description:</strong></h6>
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedInventory.description }}
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => handleContactUs(selectedInventory)}
                >
                  <i className="fas fa-phone me-2"></i>
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <SupportWidget />
      <Footer />
    </>
  );
};

export default PublicInventory;