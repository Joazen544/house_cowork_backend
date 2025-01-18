import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_SERVICE, FileStorageService } from './file-storage.interface';
import { FileCategory } from './file-categories.enum';
import { strategyMapping } from '../strategies/strategy-mapping';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService,
  ) {}

  async uploadFile(file: Express.Multer.File, category: FileCategory) {
    const fileExt = file.originalname.split('.').pop();
    if (!fileExt) {
      throw new BadRequestException('Invalid file extension!');
    }

    const fileName = this.generateFileName(category, fileExt);

    await this.fileStorageService.uploadFile(file.buffer, category, fileName, file.mimetype);

    return fileName;
  }

  generateFileName(category: FileCategory, fileExt: string) {
    const strategy = strategyMapping[category];
    return strategy.generateFileName(category, fileExt);
  }
}
