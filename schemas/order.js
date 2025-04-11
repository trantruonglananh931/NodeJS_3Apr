const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    totalAmount: Number,
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('order', orderSchema);
