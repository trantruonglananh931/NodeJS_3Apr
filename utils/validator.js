const { body, validationResult } = require('express-validator');
const util = require('util');
const {
    ERROR_USERNAME,
    ERROR_EMAIL,
    ERROR_PASSWORD,
} = require('./constants');

const options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }
};

module.exports = {
    validate: function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        } else {
            next();
        }
    },

    validationSiginUp: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").isStrongPassword(options.password).withMessage(
            util.format(ERROR_PASSWORD,
                options.password.minLength,
                options.password.minLowercase,
                options.password.minUppercase,
                options.password.minNumbers,
                options.password.minSymbols
            )
        ),
        body("email").isEmail().withMessage(ERROR_EMAIL),
        body("fullName").notEmpty().withMessage("Họ tên không được để trống"),
        body("phone").notEmpty().isMobilePhone().withMessage("Số điện thoại không hợp lệ"),
        body("address").notEmpty().withMessage("Địa chỉ không được để trống")
    ],

    validationCreateUser: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").isStrongPassword(options.password).withMessage(ERROR_PASSWORD),
        body("email").isEmail().withMessage(ERROR_EMAIL),
        body('role').isIn(['user', 'admin', 'mod']).withMessage("Role không hợp lệ")
    ],

    validationChangePassword: [
        body("password").isStrongPassword(options.password).withMessage(ERROR_PASSWORD)
    ],

    validationLogin: [
        body("username").notEmpty().withMessage("Username là bắt buộc"),
        body("password").notEmpty().withMessage("Password là bắt buộc")
    ]
};
