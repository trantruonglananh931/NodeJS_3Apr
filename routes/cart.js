const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carts');
const { check_authentication } = require('../utils/check_auth');

// Thêm sản phẩm vào giỏ (cần đăng nhập)
router.post('/add', check_authentication, cartController.addToCart);

// Cập nhật số lượng sản phẩm (cần đăng nhập)
router.put('/update', check_authentication, cartController.updateCart);

// Xem giỏ hàng (cần đăng nhập)
router.get('/', check_authentication, cartController.getCart);

// Xoá sản phẩm khỏi giỏ (cần đăng nhập)
router.post('/remove', check_authentication, cartController.removeFromCart);

module.exports = router;
