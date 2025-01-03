const { v2 } = require("cloudinary");
const sharp = require("sharp");
const streamifier = require("streamifier");

const uploadImage = async (file) => {
  let resizedImg = await sharp(file.buffer).webp({ quality: 70 }).toBuffer();

  return new Promise((resolve, reject) => {
    let stream = v2.uploader.upload_stream(
      {
        folder: "images",
      },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(resizedImg).pipe(stream);
  });
};

module.exports = uploadImage;
