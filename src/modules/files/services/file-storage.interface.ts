import { FileCategory } from '../enum/file-categories.enum';

export const FILE_STORAGE_SERVICE = Symbol('FileStorageService');

export interface FileStorageService {
  uploadFile(buffer: Buffer, category: FileCategory, fileName: string, mimeType: string): Promise<void>;
}
