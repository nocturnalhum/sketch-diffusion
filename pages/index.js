import Canvas from '@/components/Canvas';
import Toolbox from '@/components/Toolbox';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  return (
    <main
      className={`flex flex-col items-center max-h-screen bg-slate-300 overflow-y-hidden`}
    >
      <h1 className='my-2'>Sketch-Pad</h1>
      <Toolbox />
      <div className='shadow-lg p-3 rounded-lg bg-amber-100/30 drop-shadow-md touch-none'>
        <Canvas />
      </div>
    </main>
  );
}
