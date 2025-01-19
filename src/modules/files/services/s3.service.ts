import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FileStorageService } from './file-storage.interface';
import { FileCategory } from './file-categories.enum';
import { StrategyMapping } from '../strategies/strategy-mapping';

@Injectable()
export class S3Service implements FileStorageService {
  private s3Client: S3Client;

  constructor(private readonly strategyMapping: StrategyMapping) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || '',
      credentials:
        process.env.NODE_ENV === 'development'
          ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            }
          : undefined,
    });
  }

  async uploadFile(file: Buffer, category: FileCategory, fileName: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: this.getBucketName(category),
      Key: this.getFileKey(category, fileName),
      Body: file,
      ContentType: mimetype,
    });
    await this.s3Client.send(command);
  }

  getBucketName(category: FileCategory) {
    const strategy = this.strategyMapping.strategy[category];
    return strategy.getBucketName();
  }

  getFileKey(category: FileCategory, fileName: string) {
    const strategy = this.strategyMapping.strategy[category];
    return strategy.getFileKey(fileName);
  }
}
