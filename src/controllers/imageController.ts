import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { BadRequestError } from /*'에러핸들러 추가 필요'*/;

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const IMAGE_SIZE_LIMIT = 5 * 1024 * 1024; //byte 단위
const PUBLIC_PATH = './public';
const STATIC_PATH = './static';

export const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, PUBLIC_PATH);
    },
    filename(req, file, cb) {
      cb(null, file.originalname + '-' + Date.now());
    },
  }),

  limits: {
    fileSize: IMAGE_SIZE_LIMIT,
  },

  fileFilter(req, file, cb) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      const err = new BadRequestError('png, jpeg, jpg만 가능합니다'); //에러핸들러 맞춰서 수정
      return cb(err);
    }

    cb(null, true);
  },
});

export const uploadImage = async (req: Request, res: Response) => {
  const host = req.get('host');
  if (!host) {
    throw new BadRequestError('Host가 필요합니다');
  }
  if (!req.file) {
    throw new BadRequestError('파일이 필요합니다');
  }
  const filePath = path.join(host, STATIC_PATH, req.file.filename);
  const url = `http://${filePath}`;
  res.send({ url });
};
