import cloudinary from '../config/cloudinary.js';
import { promisify } from 'util';

const uploadAsync = promisify(cloudinary.uploader.upload);

export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const uploadOptions = {
      folder: options.folder || 'visual-diary',
      resource_type: 'auto',
      unique_filename: options.unique_filename !== false,
      overwrite: options.overwrite || false,
      ...options
    };

    // Remove undefined options to prevent Cloudinary errors
    if (!options.public_id) delete uploadOptions.public_id;
    if (!options.filename_override) delete uploadOptions.filename_override;

    // Handle both file paths and base64 strings
    let uploadSource;
    if (file instanceof Buffer) {
      uploadSource = `data:image/jpeg;base64,${file.toString('base64')}`;
    } else if (typeof file === 'string') {
      // If it's already a base64 string
      if (file.startsWith('data:')) {
        uploadSource = file;
      } else {
        uploadSource = `data:image/jpeg;base64,${file}`;
      }
    } else {
      throw new Error('Unsupported file format for Cloudinary upload');
    }

    const result = await uploadAsync(uploadSource, uploadOptions);

    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, options);
    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image: ${result.result}`);
    }
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};