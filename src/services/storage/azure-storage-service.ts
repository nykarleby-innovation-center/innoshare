import { ENVIRONMENT } from "@/utils/env"
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob"
import { StorageService } from "./storage-service"

export type AzureStorageServiceEnvironmentVariables = {
  AZURE_STORAGE_ACCOUNT_NAME: string
  AZURE_STORAGE_ACCOUNT_KEY: string
  AZURE_STORAGE_ACCOUNT_PUBLIC_CONTAINER: string
  AZURE_STORAGE_ACCOUNT_PRIVATE_CONTAINER: string
  AZURE_STORAGE_ROOT_URL: string
}

const blobServiceClient = new BlobServiceClient(
  `https://${ENVIRONMENT.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  new StorageSharedKeyCredential(
    ENVIRONMENT.AZURE_STORAGE_ACCOUNT_NAME,
    ENVIRONMENT.AZURE_STORAGE_ACCOUNT_KEY
  )
)
const publicContainerClient = blobServiceClient.getContainerClient(
  ENVIRONMENT.AZURE_STORAGE_ACCOUNT_PUBLIC_CONTAINER
)
const privateContainerClient = blobServiceClient.getContainerClient(
  ENVIRONMENT.AZURE_STORAGE_ACCOUNT_PRIVATE_CONTAINER
)

export const AzureStorageService: StorageService = {
  async uploadFile({ path, data, access }) {
    const blockBlobClient = (
      access === "private" ? privateContainerClient : publicContainerClient
    ).getBlockBlobClient(path)
    await blockBlobClient.upload(data, data.length)
  },

  async getPublicFileUrl(path: string) {
    return `${ENVIRONMENT.AZURE_STORAGE_ROOT_URL}/${ENVIRONMENT.AZURE_STORAGE_ACCOUNT_PUBLIC_CONTAINER}/${path}`
  },

  async getPrivateFileDownloadUrl(path: string) {
    return privateContainerClient.generateSasUrl({
      expiresOn: new Date(new Date().getTime() + 86400),
    })
  },

  async deleteFile({ path, access }) {
    const blockBlobClient = (
      access === "private" ? privateContainerClient : publicContainerClient
    ).getBlockBlobClient(path)
    await blockBlobClient.delete()
  },
}
