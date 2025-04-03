let mongoose = require('mongoose');
const slugify = require('slugify');

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    imgURL: {
        type: String,
        default: ""
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Trước khi lưu vào database, tự động tạo slug từ tên sản phẩm
productSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    next();
});

module.exports = mongoose.model('product', productSchema);
