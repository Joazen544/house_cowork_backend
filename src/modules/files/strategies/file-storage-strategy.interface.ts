export interface FileStorageStrategy {
  generateFileName(fileExt: string, originalFileName?: string): string;
  getBucketName(): string;
  getFileKey(fileName: string): string;
}
