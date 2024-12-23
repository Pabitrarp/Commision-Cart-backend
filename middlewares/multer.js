const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Define the upload folder path relative to your project
const uploadFolder = 'uploads';

// Check if the upload folder exists, if not, create it
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}


const storage = multer.diskStorage({
    // Set the correct relative path for storing files
    destination: function (req, file, cb) {
        cb(null, uploadFolder); // Use the relative uploadFolder path
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Ensure correct file extension
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };
