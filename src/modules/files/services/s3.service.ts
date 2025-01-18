import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FileStorageService } from './file-storage.interface';

@Injectable()
export class S3Service implements FileStorageService {
  private s3Client: S3Client;
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: Buffer, key: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: mimetype,
    });
  }
}
