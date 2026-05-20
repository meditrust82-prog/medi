const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadStream = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'meditrust/products', ...options },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

const WATERMARK_OPTIONS = {
  transformation: [
    {
      overlay: {
        font_family: 'Arial',
        font_size: 24,
        font_weight: 'bold',
        text: 'Meditrust Nepal',
      },
      gravity: 'south_east',
      x: 12,
      y: 12,
      opacity: 55,
      color: '#ffffff',
    },
  ],
};

const uploadToCloudinary = async (files) => {
  const results = await Promise.all(
    files.map((f) => uploadStream(f.buffer, WATERMARK_OPTIONS))
  );
  return results.map((r) => ({ url: r.secure_url, alt: '' }));
};

module.exports = { uploadToCloudinary };
