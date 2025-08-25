import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CustomError } from '../utils/customErrorUtil';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
const ALLOWED_CONTRACT_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const SIZE_LIMIT = 5 * 1024 * 1024; //byte 단위
const PUBLIC_DIR = path.resolve('public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

/*이미지 업로드 미들웨어*/
export const uploadIamge = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_DIR);
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

/*계약서 업로드 미들웨어*/
export const uploadContractDocument = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_DIR);
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
    if (!ALLOWED_CONTRACT_TYPES.includes(file.mimetype)) {
      return cb(CustomError.badRequest('png, jpeg, pdf만 가능합니다.'));
    }
    if (file.size > SIZE_LIMIT) {
      return cb(CustomError.badRequest('5MB 이하 파일만 가능합니다.'));
    }

    cb(null, true);
  },
});
