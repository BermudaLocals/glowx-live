import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET!
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL!

export type MediaType = 'image' | 'video' | 'audio' | 'mesh'

function getPrefix(creatorId: string, type: MediaType) {
  return `${type}s/${creatorId}/${randomUUID()}`
}

// Generate a presigned upload URL (client uploads directly to R2)
export async function getUploadUrl(creatorId: string, type: MediaType, contentType: string) {
  const key = `${getPrefix(creatorId, type)}`
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType })
  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 900 }) // 15 min
  const publicUrl = `${PUBLIC_URL}/${key}`
  return { uploadUrl, publicUrl, key }
}

// Delete a media file
export async function deleteMedia(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

// Get a signed download URL for private content
export async function getDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key })
  return getSignedUrl(r2, command, { expiresIn })
}

// Direct server-side upload (for small files like thumbnails)
export async function uploadBuffer(
  buffer: Buffer,
  creatorId: string,
  type: MediaType,
  contentType: string
) {
  const key = getPrefix(creatorId, type)
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET, Key: key, Body: buffer, ContentType: contentType,
  }))
  return `${PUBLIC_URL}/${key}`
}
