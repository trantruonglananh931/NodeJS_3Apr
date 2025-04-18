var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let productModel = require('../schemas/product');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send(
    {
      message:"heheeheheh"
    }
  );
});

// Lấy tất cả sản phẩm trong một danh mục theo slug
router.get('danhmuc/:category', async function(req, res) {
  try {
    let category = await categoryModel.findOne({ slug: req.params.category });
    if (!category) {
      return res.status(404).json({ success: false, message: "Danh mục không tồn tại" });
    }
    let products = await productModel.find({ category: category._id }).populate("category", "name");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy sản phẩm trong danh mục", error: error.message });
  }
});

// Lấy sản phẩm theo slug category và slug sản phẩm
router.get('danhmuc/:category/:product', async function(req, res) {
  try {
    let category = await categoryModel.findOne({ slug: req.params.category });
    if (!category) {
      return res.status(404).json({ success: false, message: "Danh mục không tồn tại" });
    }
    let product = await productModel.findOne({ slug: req.params.product, category: category._id }).populate("category", "name");
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy sản phẩm theo slug", error: error.message });
  }
});


module.exports = router;
