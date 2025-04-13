const express = require('express');
const router = express.Router();
const cartController = require('../controllers/carts');
const { check_authentication } = require('../utils/check_auth');

router.post('/', cartController.addToCart);

router.put('/', cartController.updateCart);

router.get('/', cartController.getCart);

router.delete('/', cartController.removeFromCart);

module.exports = router;
