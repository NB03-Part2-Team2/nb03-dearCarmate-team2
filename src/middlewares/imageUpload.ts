import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CustomError } from '../utils/customErrorUtil';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
const SIZE_LIMIT = 5 * 1024 * 1024; //byte 단위
const PUBLIC_IMAGE_DIR = path.resolve('public');

/*이미지 업로드 미들웨어*/

if (!fs.existsSync(PUBLIC_IMAGE_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGE_DIR, { recursive: true });
}

export const uploadIamge = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_IMAGE_DIR);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, Date.now() + ext);
    },
  }),

  limits: {
    fileSize: SIZE_LIMIT,
  },

  fileFilter(req, file, cb) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(CustomError.badRequest('png, jpeg만 가능합니다'));
    }

    cb(null, true);
  },
});
