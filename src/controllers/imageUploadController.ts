import { Request, Response } from 'express';
import { CustomError } from '../utils/customErrorUtil';

class ImageController {
  upload = async (req: Request, res: Response) => {
    const host = req.get('host');
    if (!host) {
      throw CustomError.badRequest('Host가 필요합니다');
    }
    if (!req.file) {
      throw CustomError.badRequest('파일이 필요합니다');
    }

    const proto = req.protocol;
    const base = `${proto}://${req.get('host')}`;
    const imageUrl = new URL(`/images/${req.file.filename}`, base).toString();
    res.send({ imageUrl });
  };
}

export default new ImageController();
