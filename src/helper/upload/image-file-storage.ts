import { HttpException, HttpStatus } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const imageStorageOption = {
  // sử dụng memory storage
  storage: memoryStorage(),
  // tối đa 4 Mb
  limits: {
    fileSize: Math.pow(1024, 2) * 4,
  },
  // lọc những file khác file ảnh
  fileFilter : (request : any, file : Express.Multer.File, callback : (error: Error, approve: boolean) => void) => {
    if (!file.mimetype.includes('image')) {
      return callback(
        new HttpException({
          errors: {
            image: "Chỉ được upload file ảnh"
          },
          status: HttpStatus.BAD_REQUEST
        }, HttpStatus.BAD_REQUEST),
        null,
      );
    }

    callback(null, true);
  }
};
