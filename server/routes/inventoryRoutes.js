const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const { v2: cloudinary } = require("cloudinary");
const Inventory = require("../models/Inventory");

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

    let imageUrl = inventory.image;
    let publicId = inventory.public_id;

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
    if (inventory.public_id) {
      await deleteFromCloudinary(inventory.public_id);
    }

    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Inventory deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inventory" });
  }
});

module.exports = router;
