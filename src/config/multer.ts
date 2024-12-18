import { Request } from 'express'
import { diskStorage, FileFilterCallback, Options } from 'multer'
import path from 'path'
import { randomUUID } from 'crypto'
import { MAX_FILESIZE, PUBLIC_DIR } from './env'
import { File } from '@/types/file.type'

type FileNameCallback = (error: Error | null, filename: string) => void

const acceptedMimetypes = [
  'image/png',
  'image/jpeg',
  'image/avif',
  'image/webp',
  'application/pdf',
  'audio/webm'
]

const storage = diskStorage({
  destination: path.join(__dirname, '../../', PUBLIC_DIR),
  filename: (_req: Request, file: File, cb: FileNameCallback) => {
    cb(null, randomUUID() + path.extname(file.originalname))
  }
})

const limits: Options['limits'] = {
  fileSize: MAX_FILESIZE + 1
}

const fileFilter = (_req: Request, file: File, cb: FileFilterCallback) => {
  if (acceptedMimetypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export const fileUploadOptions = {
  storage,
  fileFilter,
  limits
}

export const acceptedFileFormats = ['png', 'jpeg', 'jpg', 'avif', 'webp', 'pdf', 'webm']
