var userSchema = require('../schemas/user');
var roleController = require('../controllers/roles');
let bcrypt = require('bcrypt');

module.exports = {
    GetAllUser: async () => {
        return await userSchema.find({}).populate('role');
    },

    GetUserById: async (id) => {
        return await userSchema.findById(id).populate('role');
    },

    GetUserByEmail: async (email) => {
        return await userSchema.findOne({ email }).populate('role');
    },

    GetUserByToken: async (token) => {
        return await userSchema.findOne({ tokenResetPassword: token }).populate('role');
    },

    CreateAnUser: async ({ username, password, email, fullName, phone, address }) => {
        const GetRole = await roleController.GetRoleByName('user');
        if (!GetRole) {
            throw new Error("Role 'user' không tồn tại");
        }

        const newUser = new userSchema({
            username,
            password,
            email,
            fullName,
            phone,
            address,
            role: GetRole._id
        });

        return await newUser.save();
    },

    UpdateUser: async function (id, body) {
        const allowFields = ["password", "email", "imgURL", "fullName", "phone", "address"];
        const user = await userSchema.findById(id);

        if (user) {
            for (const key of Object.keys(body)) {
                if (allowFields.includes(key)) {
                    user[key] = body[key];
                }
            }
            return await user.save();
        }
    },

    DeleteUser: async function (id) {
        const user = await userSchema.findById(id);
        if (user) {
            user.status = false;
            return await user.save();
        }
    },

    Login: async function (username, password) {
        // Thêm .populate('role') để lấy thông tin role
        const user = await userSchema.findOne({ username }).populate('role');
        
        if (!user) {
            throw new Error("username hoặc mật khẩu không đúng");
        }
    
        if (bcrypt.compareSync(password, user.password)) {
            return user;
        } else {
            throw new Error("username hoặc mật khẩu không đúng");
        }
    },
    SoftDeleteUser: async (id) => {
        return await userSchema.findByIdAndUpdate(
            id,
            { isDelete: true },
            { new: true }
        );
    }
};
