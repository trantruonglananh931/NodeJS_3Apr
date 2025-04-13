let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let userController = require('../controllers/users')

module.exports = {
    check_authentication: async function (req, res, next) {
        try {
            if (!req.headers || !req.headers.authorization) {
                throw new Error("ban chua dang nhap")
            }
            let authorization = req.headers.authorization;

            if (authorization.startsWith("Bearer ")) {
                let token = authorization.split(" ")[1];
                if (!token) {
                    throw new Error("Token khong hop le")
                }

                let result = jwt.verify(token, constants.SECRET_KEY);
                if (result) {
                    let id = result.id;
                    let user = await userController.GetUserById(id);
                    req.user = user;
                    next();
                } else {
                    throw new Error("Token khong hop le")
                }
            } else {
                throw new Error("ban chua dang nhap")
            }
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: err.message });
        }
    },

    check_authorization: function (requiredRole) {
        return function (req, res, next) {
            try {
                let role = req.user.role.name;
                if (requiredRole.includes(role)) {
                    next();
                } else {
                    throw new Error("ban khong co quyen")
                }
            } catch (err) {
                console.error(err);
                res.status(403).json({ message: err.message });
            }
        }
    }
}
