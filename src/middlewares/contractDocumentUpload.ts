import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CustomError } from '../utils/customErrorUtil';

const ALLOWED_CONTRACT_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];
const SIZE_LIMIT = 5 * 1024 * 1024; //byte 단위
const PUBLIC_DOCUMENT_DIR = path.resolve('document');

/*계약서 업로드 미들웨어*/

if (!fs.existsSync(PUBLIC_DOCUMENT_DIR)) {
  fs.mkdirSync(PUBLIC_DOCUMENT_DIR, { recursive: true });
}

export const uploadContractDocument = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_DOCUMENT_DIR);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      const originalName = path.basename(file.originalname, ext); // 확장자 제외한 파일명
      const timestamp = Date.now();
      const filename = `${originalName}_${timestamp}${ext}`; // 타임스탬프 추가
      cb(null, filename);
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
