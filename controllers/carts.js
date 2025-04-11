// controllers/cartController.js
const productModel = require('../schemas/product');

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, name, price, quantity } = req.body;
    if (!req.session.cart) req.session.cart = [];
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    const existing = req.session.cart.find(p => p.productId === productId);
    const totalQuantity = existing ? existing.quantity + parseInt(quantity) : parseInt(quantity);
    if (totalQuantity > product.quantity) {
      return res.status(400).json({ success: false, message: "Số lượng vượt quá tồn kho" });
    }
    if (existing) {
      existing.quantity += parseInt(quantity) || 1;
    } else {
      req.session.cart.push({
        productId,
        name,
        price,
        quantity: parseInt(quantity) || 1
      });
    }

    res.json({ success: true, cart: req.session.cart });
  } catch (err) {
    next(err);
  }
};

exports.getCart = (req, res) => {
  const cart = req.session.cart || [];
  res.json({ success: true, cart });
};

exports.updateCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!req.session.cart) return res.json({ success: false, message: 'Giỏ hàng trống' });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });

    if (quantity > product.quantity) {
      return res.status(400).json({ success: false, message: "Số lượng vượt quá tồn kho" });
    }

    const item = req.session.cart.find(p => p.productId === productId);
    if (item) item.quantity = parseInt(quantity);

    res.json({ success: true, cart: req.session.cart });
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = (req, res) => {
  const { productId } = req.body;
  if (!req.session.cart) return res.json({ success: false, message: 'Giỏ hàng trống' });

  req.session.cart = req.session.cart.filter(p => p.productId !== productId);
  res.json({ success: true, cart: req.session.cart });
};

exports.checkout = (req, res) => {
  const cart = req.session.cart;
  if (!cart || cart.length === 0) {
    return res.json({ success: false, message: 'Không có sản phẩm nào trong giỏ hàng' });
  }

  // TODO: Lưu đơn hàng vào database nếu cần

  // Xoá giỏ hàng
  req.session.cart = [];
  res.json({ success: true, message: 'Đặt hàng thành công' });
};
