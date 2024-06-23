import { unlink } from 'fs'
import { join } from 'path'
import { PUBLIC_DIR } from '@/config/env'

export const deleteFileFromPublic = (filename: string) => {
  const filePath = join(__dirname, '../../', PUBLIC_DIR, filename)
  unlink(filePath, (err) => {
    if (err) {
      throw new Error('Internal Server Error - 303')
    }
  })
}
