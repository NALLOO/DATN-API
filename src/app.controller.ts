import { FirebaseService } from './firebase/firebase.service';
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageStorageOption } from './helper/upload/image-file-storage';
import CustomResponse from './helper/response/response';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private firebaseService: FirebaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', imageStorageOption))
  async upload(@UploadedFile() file: Express.Multer.File) {
    try {
      const res = await this.firebaseService.uploadFile(file, 'bus');
      return new CustomResponse(res)
    } catch (error) {
      console.log(error);
    }
  }
}
