const mongoose = require("mongoose");

const inventorySettingsSchema = new mongoose.Schema(
  {
    contactPhone: { type: String, default: "+91 9091010909" },
    whatsappNumber: { type: String, default: "919091010909" }, // without +
    contactEmail: { type: String, default: "info@skdpropworld.com" },
    viewDetailsButtonText: { type: String, default: "View Details" },
    contactButtonText: { type: String, default: "Contact Us" },
    whatsappMessageTemplate: {
      type: String,
      default:
        "Hi! I'm interested in the property: {propertyName} located at {location}. Can you provide more details?",
    },
    pageTitle: {
      type: String,
      default: "Available Plots & Properties",
    },
    pageSubtitle: {
      type: String,
      default: "Discover premium YEIDA plots with clear documentation and competitive pricing",
    },
    showContactButton: { type: Boolean, default: true },
    showViewDetailsButton: { type: Boolean, default: true },
    enableWhatsappContact: { type: Boolean, default: true },
    enablePhoneContact: { type: Boolean, default: true },
    enableEmailContact: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventorySettings", inventorySettingsSchema);

