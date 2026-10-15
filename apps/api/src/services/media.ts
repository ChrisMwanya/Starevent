import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { env } from '../config/env.js';

// CLOUDINARY_URL (cloudinary://<clé>:<secret>@<cloud>) est lu par le SDK lui-même
cloudinary.config({ secure: true });

export const isMediaConfigured = Boolean(env.CLOUDINARY_URL);

/** Envoie une image à Cloudinary et renvoie son adresse publique (https://res.cloudinary.com/…). */
export function uploadImageBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: env.CLOUDINARY_FOLDER, resource_type: 'image' },
      (error, result?: UploadApiResponse) => {
        if (error || !result) return reject(error ?? new Error('Réponse Cloudinary vide'));
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
}
