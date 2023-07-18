import React, { useState } from 'react';
import Image from 'next/image';
import { LuLoader2 } from 'react-icons/lu';
import { dataURLtoFile } from '@/utils/dataURLtoFIle';
import { v4 as uuidv4 } from 'uuid';
import aws from '@/pages/api/s3uploader';

export default function ControlNet({ canvasRef }) {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlGenerated, setImageUrlGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const canvas = canvasRef.current;
  //   const drawingDataUrl = canvas.toDataURL('image/png');
  //   const convertedUrlToFile = dataURLtoFile(drawingDataUrl, 'canvas-img.png');
  //   const formData = new FormData();
  //   formData.append('file', convertedUrlToFile);
  //   formData.append(
  //     'upload_preset',
  //     process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  //   );

  //   fetch(
  //     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
  //     {
  //       method: 'POST',
  //       body: formData,
  //     }
  //   )
  //     .then((response) => response.json())
  //     .then(async (data) => {
  //       console.log('Image uploaded:', data);
  //       setCloudinary(data.secure_url);
  //       // Perform additional actions with the uploaded image URL
  //       setLoading(true);
  //       console.log('Fetching Stable-Diffusion API');
  //       const response = await fetch('/api/controlnet', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           value: inputValue,
  //           img: data.secure_url,
  //         }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log('Data', data);
  //         setImageUrl(data[0]);
  //         setImageUrlGenerated(data[1]);
  //       } else {
  //         console.error('Error', response.statusText);
  //       }
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error uploading image:', error);
  //     });
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Uploading!');
    setLoading(true);
    const canvas = canvasRef.current;
    const drawingDataUrl = canvas.toDataURL('image/png');
    const fileId = uuidv4();
    const convertedUrlToFile = dataURLtoFile(
      drawingDataUrl,
      `canvas-${fileId}.png`
    );
    let returnData = await aws(convertedUrlToFile);
    setMessage('Processing Image');

    const response = await fetch('/api/controlnet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: inputValue,
        img: returnData,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Data', data);
      setImageUrl(data[0]);
      setImageUrlGenerated(data[1]);
      setLoading(false);
      setMessage('Processing Complete');
    } else {
      console.error('Error', response.statusText);
      setMessage('Error');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className=''>
        <p className='text-red-500'>{message}</p>
        <form onSubmit={handleSubmit} className='flex m-4 space-x-3'>
          {/* <input type='file' name='file' className='hidden' /> */}
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className='w-[700px] px-5 py-3 text-gray-700 bg-gray-200 rounded'
            placeholder='Enter a prompt...'
          />
          <button
            type='submit'
            className='flex justify-center w-24 px-3 py-4 text-white bg-blue-500 rounded-md focus:outline-none'
            disabled={loading}
          >
            ControlNet
          </button>
        </form>
      </div>
      {loading && (
        <div className='mt-12 flex justify-center'>
          <LuLoader2 size={40} className=' animate-spin' />
        </div>
      )}
      <div className='flex'>
        {imageUrl && !loading && (
          <div className='mt-12 flex justify-center'>
            <Image
              priority={true}
              src={imageUrl}
              alt='Generated Image'
              height={832}
              width={512}
              className='rounded-xl shadow-lg h-auto'
            />
          </div>
        )}
        {imageUrlGenerated && !loading && (
          <div className='mt-12 flex justify-center'>
            <Image
              priority={true}
              src={imageUrlGenerated}
              alt='Generated Image'
              height={832}
              width={512}
              className='rounded-xl shadow-lg h-auto'
            />
          </div>
        )}
      </div>
    </div>
  );
}
