const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },
    location: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
