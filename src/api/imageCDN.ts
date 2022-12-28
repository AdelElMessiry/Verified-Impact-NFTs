import axios from 'axios';

//upload images to server api 

export async function uploadImg(file: File) {
  console.log('File', file);

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', 'nftmarketplace');
  const res = await axios.post(
    'https://api.cloudinary.com/v1_1/dhekwzdub/image/upload',
    body
  );
  return res.data.secure_url;
}
