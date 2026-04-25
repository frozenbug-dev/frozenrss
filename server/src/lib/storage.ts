import {createStorage} from 'unstorage'
import fsDriver from 'unstorage/drivers/fs'
import s3Driver from 'unstorage/drivers/s3'

import {ENV} from '../env.js'

export const storage = createStorage({
  driver: createStorageDriver(),
})

export function getAssetUrl(path: string): string {
  const baseUrl = ENV.STORAGE.ASSETS_PUBLIC_URL
  if (baseUrl) {
    return new URL(path, baseUrl).toString()
  }
  return path
}

function createStorageDriver() {
  if (ENV.STORAGE.S3_ENABLED) {
    return s3Driver({
      accessKeyId: ENV.STORAGE.S3_ACCESS_KEY_ID!,
      secretAccessKey: ENV.STORAGE.S3_SECRET_ACCESS_KEY!,
      bucket: ENV.STORAGE.S3_BUCKET_NAME!,
      endpoint: ENV.STORAGE.S3_ENDPOINT!,
      region: ENV.STORAGE.S3_REGION!,
    })
  }
  return fsDriver({base: ENV.STORAGE.BASE_PATH})
}
