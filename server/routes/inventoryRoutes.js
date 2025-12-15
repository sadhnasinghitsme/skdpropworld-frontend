const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const { v2: cloudinary } = require("cloudinary");
const Inventory = require("../models/Inventory");
const InventorySettings = require("../models/InventorySettings");

// Default settings (used on first run)
const defaultSettings = {
  contactPhone: "+91 9091010909",
  whatsappNumber: "919091010909",
  contactEmail: "info@skdpropworld.com",
  viewDetailsButtonText: "View Details",
  contactButtonText: "Contact Us",
  whatsappMessageTemplate:
    "Hi! I'm interested in the property: {propertyName} located at {location}. Can you provide more details?",
  pageTitle: "Available Plots & Properties",
  pageSubtitle:
    "Discover premium YEIDA plots with clear documentation and competitive pricing",
  showContactButton: true,
  showViewDetailsButton: true,
  enableWhatsappContact: true,
  enablePhoneContact: true,
  enableEmailContact: false,
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "inventories" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// DELETE image from Cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
  }
};

// CREATE inventory
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const newInventory = new Inventory({
      ...req.body,
      image: {
        url: imageUrl,
        public_id: publicId,
      },
    });

    const saved = await newInventory.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({ message: "Failed to create inventory" });
  }
});

// READ all inventories
router.get("/", async (req, res) => {
  try {
    const inventories = await Inventory.find().sort({ createdAt: -1 });
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventories" });
  }
});

// UPDATE inventory
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Not found" });

    let imageUrl = inventory.image?.url || "";
    let publicId = inventory.image?.public_id || "";

    if (req.file) {
      // Delete old image if it exists
      if (publicId) await deleteFromCloudinary(publicId);

      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const updated = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: {
          url: imageUrl,
          public_id: publicId,
        },
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update inventory" });
  }
});

// DELETE inventory
router.delete("/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Not found" });

    // Delete image from Cloudinary
    if (inventory.image?.public_id) {
      await deleteFromCloudinary(inventory.image.public_id);
    }

    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Inventory deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inventory" });
  }
});

// SETTINGS ENDPOINTS

// GET inventory settings (persisted)
router.get("/settings", async (req, res) => {
  try {
    let settings = await InventorySettings.findOne();
    if (!settings) {
      settings = await InventorySettings.create(defaultSettings);
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

// POST/UPDATE inventory settings (persisted)
router.post("/settings", async (req, res) => {
  try {
    const settings = await InventorySettings.findOneAndUpdate(
      {},
      { $set: { ...defaultSettings, ...req.body } },
      { upsert: true, new: true }
    );
    res
      .status(200)
      .json({ message: "Settings saved successfully", settings });
  } catch (error) {
    console.error("Failed to save settings:", error);
    res.status(500).json({ message: "Failed to save settings" });
  }
});

module.exports = router;
