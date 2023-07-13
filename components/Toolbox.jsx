import React, { useRef, useState } from 'react';
import { BsImages } from 'react-icons/bs';
import { SlActionUndo, SlActionRedo } from 'react-icons/sl';
export default function Toolbox({ canvasRef, contextRef }) {
  const inputRef = useRef(null);

  const handleClick = (e) => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const scale =
        image.naturalWidth > image.naturalHeight
          ? canvas.height / image.naturalHeight
          : canvas.width / image.naturalWidth;
      const imageWidth = image.naturalWidth * scale;
      const imageHeight = image.naturalHeight * scale;
      const startX = (canvas.width - imageWidth) / 2;
      const startY = (canvas.height - imageHeight) / 2;
      context.drawImage(image, startX, startY, imageWidth, imageHeight);
      const drawing = canvasRef.current.toDataURL('image/png');
      localStorage.setItem('drawing', drawing);
    };
  };

  const savePNG = (e) => {
    let link = e.currentTarget;
    link.setAttribute('download', 'canvas.png');
    let image = canvasRef.current.toDataURL('image/png');
    link.setAttribute('href', image);
  };

  const clearCanvas = () => {
    let canvas = canvasRef.current;
    let context = canvas.getContext('2d');
    context.fillStyle = '#FFF'; // Set the background color to white
    context.fillRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem('drawing');
  };

  return (
    <div className='flex justify-between items-center w-[calc(100vw*0.95)] md:max-w-[1600px] h-12 md:h-16 rounded-full bg-gray-100 px-2 my-2'>
      <div className='flex items-center justify-center space-x-1'>
        <button className='rounded-full bg-sky-500  h-12 w-12 text-white select-none text-sm'>
          Tools
        </button>
        <form
          onClick={handleClick}
          className='flex items-center justify-center h-12 w-12 rounded-full bg-sky-500 text-white select-none cursor-pointer'
        >
          <BsImages size={25} />
          <input
            type='file'
            ref={inputRef}
            onChange={handleFileChange}
            accept='image/*'
            className='hidden'
          />
        </form>
      </div>
      <div className='flex space-x-1'>
        <button className='flex items-center justify-center rounded-xl bg-sky-500 h-12 w-12 text-white select-none text-sm'>
          <SlActionUndo size={25} />
        </button>
        <button className='flex items-center justify-center rounded-xl bg-sky-500 h-12 w-12 text-white select-none text-sm'>
          <SlActionRedo size={25} />
        </button>
      </div>
      <div className='flex items-center justify-center space-x-1'>
        <div className='flex items-center justify-center rounded-xl bg-sky-500 h-12 w-12 text-white text-sm'>
          <a
            onClick={savePNG}
            href='download_link'
            className='rounded-xl px-2 py-3.5 select-none'
          >
            Save
          </a>
        </div>
        <button
          onClick={clearCanvas}
          className='rounded-xl bg-sky-500  h-12 w-12 text-white text-sm select-none'
        >
          Clear
        </button>
      </div>
    </div>
  );
}
