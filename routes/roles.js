var express = require('express');
var router = express.Router();
let roleController = require('../controllers/roles')
var {CreateSuccessRes,CreateErrorRes} = require('../utils/ResHandler')
let {check_authentication,check_authorization} = require('../utils/check_auth')
let constants = require('../utils/constants')
/* GET users listing. */
router.get('/'/* ,check_authentication,check_authorization(constants.ADMIN_PERMISSION) */, async function(req, res, next) {
    let users = await roleController.GetAllRole();
    CreateSuccessRes(res,200,users);
});
router.get('/:id'/* ,check_authentication,check_authorization(constants.ADMIN_PERMISSION) */, async function(req, res, next) {
  try {
    let user = await roleController.GetRoleById(req.params.id)
    CreateSuccessRes(res,200,user);
  } catch (error) {
    next(error);
  }
});
router.post('/'/* ,check_authentication,check_authorization(constants.ADMIN_PERMISSION) */, async function(req, res, next) {
  try {
    let newRole = await roleController.CreateRole(req.body.name);
    CreateSuccessRes(res,200,newRole);
  } catch (error) {
    next(error);
  }
})

router.put('/:id'/* , check_authentication, check_authorization(constants.ADMIN_PERMISSION) */, async function(req, res, next) {
  try {
    let { id } = req.params;
    let { name } = req.body;

    if (!name || name.trim() === '') {
      return CreateErrorRes(res, 400, "Tên vai trò không được để trống");
    }

    let updatedRole = await roleController.UpdateRole(id, name);
    if (!updatedRole) {
      return CreateErrorRes(res, 404, "Không tìm thấy vai trò để cập nhật");
    }

    CreateSuccessRes(res, 200, updatedRole);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id'/* , check_authentication, check_authorization(constants.ADMIN_PERMISSION) */, async function(req, res, next) {
  try {
    let { id } = req.params;

    // Đánh dấu vai trò là đã bị xóa
    let updatedRole = await roleController.SoftDeleteRole(id);
    if (!updatedRole) {
      return CreateErrorRes(res, 404, "Không tìm thấy vai trò để xóa");
    }

    CreateSuccessRes(res, 200, "Vai trò đã được đánh dấu là đã xóa thành công");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
