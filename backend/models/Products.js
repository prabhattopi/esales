// server/models/Product.js
const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "Color", "Size"
  value: { type: String, required: true }, // e.g., "Red", "M"
  // Add inventory per variant if needed, otherwise use main product inventory
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  variants: [ // Array of variant types, e.g., [{ type: "Color", options: ["Red", "Blue"]}, {type: "Size", options: ["S", "M"]}]
    {
        name: String, // e.g., "Color"
        options: [String] // e.g., ["Red", "Blue", "Green"]
    }
  ],
  inventory: { type: Number, required: true, default: 100 }, // Total inventory
});

module.exports = mongoose.model('Product', productSchema);