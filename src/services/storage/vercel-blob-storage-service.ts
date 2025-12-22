import { ENVIRONMENT } from "@/utils/env"
import { StorageService } from "./storage-service"
import { put, del } from "@vercel/blob"

export type VercelBlobStorageServiceEnvironmentVariables = {
  VERCEL_BLOB_BASE_URL: string
}

export const VercelBlobStorageService: StorageService = {
  async uploadFile({ path, data, access }) {
    if (access === "private") {
      throw new Error("Vercel Blob Storage does not support private files")
    }

    await put("public/" + path, data, {
      access: "public",
    })
  },

  async getPublicFileUrl(path: string) {
    return `${ENVIRONMENT.VERCEL_BLOB_BASE_URL}/public/${path}`
  },

  async getPrivateFileDownloadUrl(path: string) {
    throw new Error("Vercel Blob Storage does not support private files")
  },

  async deleteFile({ path, access }) {
    await del((access === "private" ? "private/" : "public/") + path)
  },
}
