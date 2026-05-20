const multer = require('multer');
const path = require('path');

const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!file.mimetype.startsWith('image/') || !ALLOWED_EXTS.has(ext)) {
      return cb(new Error('Only image files (jpg, jpeg, png, gif, webp, avif) are allowed'));
    }
    cb(null, true);
  },
});

module.exports = upload;
