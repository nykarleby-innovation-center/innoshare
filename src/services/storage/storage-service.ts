import { AzureStorageService } from "./azure-storage-service"

export type FileAccessType = "public" | "private"

export interface StorageService {
  uploadFile(args: {
    path: string
    data: Buffer
    access: FileAccessType
  }): Promise<void>

  getPublicFileUrl(path: string): Promise<string>

  getPrivateFileDownloadUrl(path: string): Promise<string>

  deleteFile(args: { path: string; access: FileAccessType }): Promise<void>
}

export const StorageService = AzureStorageService
