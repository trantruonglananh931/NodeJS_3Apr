var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let productModel = require('../schemas/product');

// Lấy danh sách categories
router.get('/', async function(req, res) {
  try {
    let categories = await categoryModel.find({});
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách danh mục",
      error: error.message
    });
  }
});

// Lấy danh mục theo ID
router.get('/:id', async function(req, res) {
  try {
    let { id } = req.params;

    // Kiểm tra xem ID có đúng định dạng MongoDB ObjectId không
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "ID không hợp lệ" });
    }

    let category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh mục", error: error.message });
  }
});

// Tạo danh mục mới
router.post('/', async function(req, res) {
  try {
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: "Tên danh mục không được để trống" });
    }

    let newCategory = new categoryModel({
      name: req.body.name
    });

    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi tạo danh mục", error: error.message });
  }
});



module.exports = router;
