import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String, default: '' },
  price: { type: Number, default: 0 },
})

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    tableNumber: { type: Number, required: true, index: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'cooking', 'ready', 'served', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true },
)

// Auto-generate orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderId = `ORD-${String(count + 1).padStart(3, '0')}`
  }
  next()
})

export default mongoose.model('Order', orderSchema)
