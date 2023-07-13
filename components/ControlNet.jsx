import React, { useState } from 'react';
import Image from 'next/image';
import { LuLoader2 } from 'react-icons/lu';

export default function ControlNet({ canvasRef }) {
  const [inputValue, setInputValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlGenerated, setImageUrlGenerated] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const drawingDataUrl = canvas.toDataURL('image/png');
    const formData = new FormData();
    formData.append('file', drawingDataUrl);
    formData.append('upload_preset', 'unsigned-uploads');

    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
      .then((response) => response.json())
      .then(async (data) => {
        console.log('Image uploaded:', data.secure_url);
        // Perform additional actions with the uploaded image URL
        setLoading(true);
        console.log('Fetching Stable-Diffusion API');
        const response = await fetch('/api/controlnet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: inputValue, img: data.secure_url }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Data', data);
          setImageUrl(data[0]);
          setImageUrlGenerated(data[1]);
        } else {
          console.error('Error', response.statusText);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

  return (
    <div>
      <div className=''>
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
        <div className='mt-12 flex justify-center animate-spin'>
          <LuLoader2 size={40} />
        </div>
      )}
      {imageUrl && !loading && (
        <div className='mt-12 flex justify-center'>
          <Image
            priority={true}
            src={imageUrl}
            alt='Generated Image'
            height={512}
            width={512}
            className='rounded-xl shadow-lg h-auto'
          />
        </div>
      )}
      {imageUrl && !loading && (
        <div className='mt-12 flex justify-center'>
          <Image
            priority={true}
            src={imageUrlGenerated}
            alt='Generated Image'
            height={512}
            width={512}
            className='rounded-xl shadow-lg h-auto'
          />
        </div>
      )}
    </div>
  );
}
