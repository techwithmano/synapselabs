import mongoose, { Schema } from 'mongoose';
import './Product';

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true, default: [] },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['kwd', 'usd'], default: 'kwd' },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

const Order = mongoose.models.Order ?? mongoose.model('Order', orderSchema);

export default Order;
