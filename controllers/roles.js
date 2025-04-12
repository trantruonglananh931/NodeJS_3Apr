var roleSchema = require('../schemas/role');

module.exports = {
    GetAllRole: async () => {
        return await roleSchema.find({ isDelete: false }); 
    },
    
    GetRoleById: async (id) => {
        return await roleSchema.findOne({ _id: id, isDelete: false }); 
    },
    
    GetRoleByName: async (name) => {
        return await roleSchema.findOne({
            name: name,
            isDelete: false 
        });
    },
    
    CreateRole: async (name) => {
        let newRole = new roleSchema({
            name: name
        });
        return await newRole.save();
    },
    
    UpdateRole: async (id, name) => {
        return await roleSchema.findByIdAndUpdate(
            id,
            { name: name },
            { new: true }
        );
    },
    
    SoftDeleteRole: async (id) => {
        return await roleSchema.findByIdAndUpdate(
            id,
            { isDelete: true },
            { new: true }
        );
    }
}
