const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createUploader(folderName) {
    const uploadFolder = path.join(__dirname, '../public/uploads/', folderName);
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadFolder);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, uniqueSuffix + ext);
        }
    });

    return multer({ storage: storage });
}

module.exports = createUploader;
