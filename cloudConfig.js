
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//backend ko cloud se jod rhe hai uske liye code hai yhe
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

//storage ko define kar rhe hai
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wandelust_DEV',
      allowedFormat: ["png","jpg","jpeg","pdf"], // supports promises as well
      
    },
  });

module.exports={
    cloudinary,
    storage,
};






