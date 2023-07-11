import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef();
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = Math.min(window.innerWidth * 0.9, 1500);
    canvas.height = window.innerHeight * 0.9;
    const resize = () => {
      const ctx = canvas.getContext('2d');
      ctx.canvas.width = window.innerWidth * 0.9;
      ctx.canvas.height = window.innerHeight * 0.9;
      ctx.canvas.style.width = `${window.innerWidth * 0.9}px`;
      ctx.canvas.style.height = `${window.innerHeight * 0.9}px`;
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <main className={`flex flex-col items-center min-h-screen bg-slate-300`}>
      <h1 className='my-2'>Sketch-Pad</h1>
      <div className='shadow-lg p-3 rounded-lg bg-amber-100/30 drop-shadow-md'>
        <canvas ref={canvasRef} className='border border-black bg-white' />
      </div>
    </main>
  );
}
