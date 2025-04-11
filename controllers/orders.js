const Order = require('../schemas/order');
const OrderDetail = require('../schemas/orderDetail');

module.exports = {
    CreateOrder: async function (req, res) {
        const cart = req.session.cart;
        const user = req.user; // Lấy từ middleware check_authentication

        if (!cart || cart.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
        }

        try {
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Tạo đơn hàng mới
            const newOrder = new Order({
                user: user._id,
                fullName: user.fullName,
                address: user.address,
                phone: user.phone,
                totalAmount: total
            });

            const savedOrder = await newOrder.save();

            // Lưu chi tiết đơn hàng
            for (const item of cart) {
                const detail = new OrderDetail({
                    order: savedOrder._id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                });
                await detail.save();
            }

            req.session.cart = [];

            res.json({ success: true, message: 'Đặt hàng thành công', orderId: savedOrder._id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng' });
        }
    },

    GetAllOrders: async function () {
        return await Order.find().populate('user');
    },

    GetOrderById: async function (id) {
        return await Order.findById(id).populate('user');
    },

    GetOrderDetailsByOrderId: async function (orderId) {
        return await OrderDetail.find({ order: orderId }).populate('productId');
    }
};
