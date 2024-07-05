const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dbmjwxqqu',
    api_key: '492557473345419',
    api_secret: 's-RGyzpYV6wLid0JV8dEXlBJu-I'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'YelpCamp',
        allowedFormats:['jpeg','png','jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}
