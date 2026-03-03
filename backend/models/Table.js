import mongoose from 'mongoose'

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    qrCodeHash: { type: String, unique: true },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
    capacity: { type: Number, default: 4 },
  },
  { timestamps: true },
)

export default mongoose.model('Table', tableSchema)
