/**
 * no need to install anything for path and crypto
 * they come from node itself
 */
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

/**
 * __dirname -> directory path up until config folder
 * the first '..' goes back to /src, the other goes back to project root
 */
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  /**
   * directory is now available to other files in node
   */
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      /**
       * crypto.randomBytes(10) generates 10 bytes of random text
       * toString('hex') converts it to a hexadecimal string
       */
      const fileHash = crypto.randomBytes(10).toString('hex');
      /**
       * the hash makes it nearly impossible to generate the same filename twice
       */
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
