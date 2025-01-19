import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_SERVICE, FileStorageService } from './file-storage.interface';
import { FileCategory } from './file-categories.enum';
import { StrategyMapping } from '../strategies/strategy-mapping';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private readonly fileStorageService: FileStorageService,
    private readonly strategyMapping: StrategyMapping,
  ) {}

  async uploadFile(file: Express.Multer.File, category: FileCategory) {
    const lastDotIndex = file.originalname.lastIndexOf('.');
    const fileExt = lastDotIndex !== -1 ? file.originalname.substring(lastDotIndex + 1) : '';
    const originalName = lastDotIndex !== -1 ? file.originalname.substring(0, lastDotIndex) : file.originalname;

    if (!fileExt) {
      throw new BadRequestException('Invalid file extension!');
    }

    const fileName = this.generateFileName(category, originalName, fileExt);

    await this.fileStorageService.uploadFile(file.buffer, category, fileName, file.mimetype);

    return fileName;
  }

  generateFileName(category: FileCategory, originalName: string, fileExt: string) {
    const strategy = this.strategyMapping.strategy[category];
    return strategy.generateFileName(fileExt, originalName);
  }
}
