const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
)

productSchema.index({ name: 'text', description: 'text', sku: 1 })

module.exports = mongoose.model('Product', productSchema)

