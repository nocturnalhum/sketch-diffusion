import Canvas from '@/components/Canvas';
import Toolbox from '@/components/Toolbox';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  return (
    <main
      className={`flex flex-col items-center min-h-screen bg-slate-300 touch-none`}
    >
      <h1 className='my-2'>Sketch-Pad</h1>
      <Toolbox />
      <div className='shadow-lg p-3 rounded-lg bg-amber-100/30 drop-shadow-md'>
        <Canvas />
      </div>
    </main>
  );
}
