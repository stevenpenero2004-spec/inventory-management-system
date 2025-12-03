const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    entityType: { type: String },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    message: { type: String, required: true },
    user: { type: String },
    ip: { type: String },
    meta: { type: Object },
  },
  { timestamps: true }
)

activitySchema.index({ type: 1, createdAt: -1 })

module.exports = mongoose.model('Activity', activitySchema)

