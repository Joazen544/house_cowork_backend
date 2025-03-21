import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { FileStorageService } from './file-storage.interface';

@Injectable()
export class S3Service implements FileStorageService {
  private s3Client: S3Client;

  constructor() {
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

  async uploadFile(file: Buffer, bucketName: string, key: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: mimetype,
    });
    await this.s3Client.send(command);
  }

  async deleteFile(bucketName: string, key: string) {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}
