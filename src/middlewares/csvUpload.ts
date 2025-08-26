import multer from 'multer';
import { CustomError } from '../utils/customErrorUtil';

const ALLOWED_CSV_TYPES = ['text/csv'];
const SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

export const uploadCSV = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: SIZE_LIMIT,
    files: 1,
  },

  fileFilter(req, file, cb) {
    // CSV 파일인지 확인 (확장자 또는 MIME 타입)
    const isCSV =
      file.originalname.toLowerCase().endsWith('.csv') || ALLOWED_CSV_TYPES.includes(file.mimetype);

    if (!isCSV) {
      return cb(CustomError.badRequest('CSV 파일만 업로드 가능합니다.'));
    }

    cb(null, true);
  },
});
