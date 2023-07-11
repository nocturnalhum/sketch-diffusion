import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef();
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = Math.min(window.innerWidth * 0.9, 1500);
    canvas.height = window.innerHeight * 0.9;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    contextRef.current = ctx;
    const savedDrawing = localStorage.getItem('drawing');
    if (savedDrawing) {
      const image = new Image();
      image.src = savedDrawing;
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
    }
    const resize = () => {
      ctx.canvas.width = window.innerWidth * 0.9;
      ctx.canvas.height = window.innerHeight * 0.9;
      ctx.canvas.style.width = `${window.innerWidth * 0.9}px`;
      ctx.canvas.style.height = `${window.innerHeight * 0.9}px`;
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const startDrawing = (e) => {
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX: x, offsetY: y } = e.nativeEvent;
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishtDrawing = () => {
    const drawing = canvasRef.current.toDataURL('image/png');
    localStorage.setItem('drawing', drawing);
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <main className={`flex flex-col items-center min-h-screen bg-slate-300`}>
      <h1 className='my-2'>Sketch-Pad</h1>
      <div className='shadow-lg p-3 rounded-lg bg-amber-100/30 drop-shadow-md'>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={finishtDrawing}
          onMouseOut={finishtDrawing}
          className='border border-black bg-white'
        />
      </div>
    </main>
  );
}
