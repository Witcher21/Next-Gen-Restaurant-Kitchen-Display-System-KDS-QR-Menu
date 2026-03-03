import mongoose from 'mongoose'

const inventorySchema = new mongoose.Schema(
  {
    ingredientName: { type: String, required: true, unique: true },
    stockLevel: { type: Number, required: true, default: 0 },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'l', 'ml', 'pcs', 'units'],
      default: 'units',
    },
    minStockAlert: { type: Number, default: 10 },
    category: { type: String, default: 'general' },
    lastRestocked: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// Virtual: check if stock is low
inventorySchema.virtual('isLowStock').get(function () {
  return this.stockLevel <= this.minStockAlert
})

inventorySchema.set('toJSON', { virtuals: true })

export default mongoose.model('Inventory', inventorySchema)
