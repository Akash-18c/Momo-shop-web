const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const sharp = require('sharp');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // accept up to 10MB, we compress it down
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  },
});

// Compress buffer with sharp before uploading
const compressBuffer = async (buffer) => {
  return sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true }) // max 1200px wide, never upscale
    .webp({ quality: 78 })                             // convert to WebP, ~78% quality
    .toBuffer();
};

const uploadToCloudinary = async (buffer, folder = 'mdb-restrocafe') => {
  const compressed = await compressBuffer(buffer);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto:good',   // Cloudinary further auto-optimises
        fetch_format: 'auto',   // serve best format per browser
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(compressed);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
