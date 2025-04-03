var express = require('express'); 
var router = express.Router();
const slugify = require('slugify');
let productModel = require('../schemas/product');
let CategoryModel = require('../schemas/category');

function buildQuery(obj) {
  let result = {};
  
  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }

  if (obj.price) {
    result.price = {};
    if (obj.price.$gte) {
      result.price.$gte = obj.price.$gte;
    }
    if (obj.price.$lte) {
      result.price.$lte = obj.price.$lte;
    }
  }

  return result;
}

// Lấy danh sách sản phẩm
router.get('/', async function(req, res) {
  try {
    let query = buildQuery(req.query);
    let products = await productModel.find(query).populate("category");
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message
    });
  }
});

// Lấy sản phẩm theo ID
router.get('/:id', async function(req, res) {
  try {
    let product = await productModel.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
});


// Thêm sản phẩm mới
router.post('/', async function(req, res) {
  try {
    let category = await CategoryModel.findOne({ name: req.body.category });
    
    if (!category) {
      return res.status(400).json({ success: false, message: "Danh mục không tồn tại" });
    }

    let newProduct = new productModel({
      name: req.body.name,
      slug: slugify(req.body.name, { lower: true, strict: true }),
      price: req.body.price,
      quantity: req.body.quantity,
      category: category._id
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi tạo sản phẩm", error: error.message });
  }
});

// Cập nhật sản phẩm
router.put('/:id', async function(req, res) {
  try {
    let updateObj = {};
    let { name, price, quantity, category } = req.body;

    if (name) {
      updateObj.name = name;
      updateObj.slug = slugify(name, { lower: true, strict: true });
    }
    if (price) updateObj.price = price;
    if (quantity) updateObj.quantity = quantity;

    if (category) {
      let cate = await CategoryModel.findOne({ name: category });
      if (!cate) {
        return res.status(400).json({ success: false, message: "Danh mục không tồn tại" });
      }
      updateObj.category = cate._id;
    }

    let updatedProduct = await productModel.findByIdAndUpdate(req.params.id, updateObj, { new: true });
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm để cập nhật" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật sản phẩm", error: error.message });
  }
});

// Xóa sản phẩm (đánh dấu isDeleted)
router.delete('/:id', async function(req, res) {
  try {
    let product = await productModel.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm để xóa" });
    }

    product.isDeleted = true;
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
});

module.exports = router;
