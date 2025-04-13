var express = require('express');
var router = express.Router();
let userController = require('../controllers/users')
var { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let {check_authentication,check_authorization} = require('../utils/check_auth')
let constants = require('../utils/constants')
const createUploader = require('../routes/upload');
const uploadAvatar = createUploader('avatars');

let { validate, validationSiginUp } = require('../utils/validator')
/* GET users listing. */
router.get('/',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let users = await userController.GetAllUser();
    CreateSuccessRes(res, 200, users);
  } catch (error) {
    next(error)
  }
});

router.get('/:id',check_authentication,check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let user = await userController.GetUserById(req.params.id)
    CreateSuccessRes(res, 200, user);
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});
router.post('/',check_authentication, check_authorization(constants.ADMIN_PERMISSION), uploadAvatar.single('avatarUrl'), validationSiginUp, validate, async function (req, res, next) {  try {
      let { username, password, email, fullName, phone, address } = req.body;
      let avatarUrl = "";
      if (req.file) {
          avatarUrl = `uploads/avatars/${req.file.filename}`;
      }
      let result = await userController.CreateAnUser({
          username,
          password,
          email,
          fullName,
          phone,
          address,
          avatarUrl,
          roleName: 'user'
      });

      let token = jwt.sign({
          id: result._id,
          expire: new Date(Date.now() + 24 * 3600 * 1000)
      }, constants.SECRET_KEY);

      CreateSuccessRes(res, 200, token);
  } catch (error) {
      next(error);
  }
});
router.put('/:id', uploadAvatar.single('avatarUrl'), async function (req, res, next) {
  try {
    let updateData = req.body;

    if (req.file) {
      updateData.avatarUrl = `uploads/avatars/${req.file.filename}`;
    } else if (req.body.avatarUrl) {
      updateData.avatarUrl = req.body.avatarUrl; 
    }

    let updatedUser = await userController.UpdateUser(req.params.id, updateData);

    if (!updatedUser) {
      return CreateErrorRes(res, 404, "Không tìm thấy người dùng để cập nhật");
    }

    CreateSuccessRes(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
});



router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let deletedUser = await userController.SoftDeleteUser(req.params.id);
    if (!deletedUser) {
      return CreateErrorRes(res, 404, "Không tìm thấy người dùng để xóa");
    }
    CreateSuccessRes(res, 200, "Người dùng đã được đánh dấu là đã xóa thành công");
  } catch (error) {
    next(error);
  }
});



module.exports = router;
