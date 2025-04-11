const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
    order: { type: Schema.Types.ObjectId, ref: 'order' },
    productId: { type: Schema.Types.ObjectId, ref: 'product' },
    quantity: Number,
    price: Number
});

module.exports = mongoose.model('orderdetail', orderDetailSchema);
