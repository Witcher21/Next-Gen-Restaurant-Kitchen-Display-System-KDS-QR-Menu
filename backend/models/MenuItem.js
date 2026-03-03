import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    emoji: { type: String, default: '🍽️' },
    gradient: { type: String, default: 'linear-gradient(135deg, #EA580C, #F59E0B)' },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true },
)

export default mongoose.model('MenuItem', menuItemSchema)
