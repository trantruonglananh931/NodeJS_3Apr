var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let productModel = require('../schemas/product');
let {check_authentication,check_authorization} = require('../utils/check_auth')
let constants = require('../utils/constants')

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

router.get('/:id', async function(req, res) {
  try {
    let { id } = req.params;

    let category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh mục", error: error.message });
  }
});

router.post('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function(req, res) {
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

router.put('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res) {
  try {
    let { id } = req.params;
    let { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: "Tên danh mục không được để trống" });
    }

    let updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục để cập nhật" });
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật danh mục", error: error.message });
  }
});

router.delete('/:id' , check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function(req, res) {
  try {
    let { id } = req.params;

    let deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục để xóa" });
    }

    res.status(200).json({ success: true, message: "Danh mục đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa danh mục", error: error.message });
  }
});


module.exports = router;
