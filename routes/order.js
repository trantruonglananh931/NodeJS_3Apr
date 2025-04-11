const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const { check_authentication } = require('../utils/check_auth');

router.post('/create', check_authentication, orderController.CreateOrder);

// Lấy toàn bộ đơn hàng
router.get('/', async (req, res) => {
    try {
        const orders = await orderController.GetAllOrders();
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đơn hàng' });
    }
});

// Lấy chi tiết đơn theo ID
router.get('/:id', async (req, res) => {
    try {
        const order = await orderController.GetOrderById(req.params.id);
        const details = await orderController.GetOrderDetailsByOrderId(req.params.id);
        res.json({ success: true, order, details });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
});

module.exports = router;
