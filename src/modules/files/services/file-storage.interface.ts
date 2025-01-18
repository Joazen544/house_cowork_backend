export const FILE_STORAGE_SERVICE = Symbol('FileStorageService');

export interface FileStorageService {
  uploadFile(buffer: Buffer, key: string, mimeType: string): Promise<void>;
}
