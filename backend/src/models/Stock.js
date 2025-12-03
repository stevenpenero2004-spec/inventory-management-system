const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['IN', 'OUT'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Stock', stockSchema)

