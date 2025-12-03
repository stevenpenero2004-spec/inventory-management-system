const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, default: '' },
    productsSupplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Supplier', supplierSchema)

