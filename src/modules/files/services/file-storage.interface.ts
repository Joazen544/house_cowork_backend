export const FILE_STORAGE_SERVICE = Symbol('FileStorageService');

export interface FileStorageService {
  uploadFile(buffer: Buffer, bucketName: string, key: string, mimeType: string): Promise<void>;
  deleteFile(bucketName: string, key: string): Promise<void>;
}
