/* eslint-disable camelcase */
import cloudinary from 'cloudinary';
import createDebug from 'debug';
import { cloudinaryKey, cloudinaryName, cloudinarySecret } from '../config.js';
import { ImageData } from '../entities/avatar.js';
const debug = createDebug('SN:Media');

// Export class CloudinaryService {
// const options = {
//   use:filename:true,
//   unique_filename:false,
//   overwrite:true
// };
//   Image: string;
//   constructor() {}
//   uploadImage() {}
// }
const image = './assets/julio.jpg';

const cloud = cloudinary.v2;
cloud.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryKey,
  api_secret: cloudinarySecret,
});
const result = await cloud.uploader.upload(image);
debug(result as ImageData);
