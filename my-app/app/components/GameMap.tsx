"use client";

import { useEffect, useRef, useState } from 'react';
import AnimatedGif from './AnimatedGif';

interface MapPoint {
  x: number;
  y: number;
  name: string;
  type: 'city' | 'data-center' | 'restricted' | 'network' | 'hq';
  active?: boolean;
}

const GameMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [gifLoaded, setGifLoaded] = useState(false);

  // Map noktaları
  const [points, setPoints] = useState<MapPoint[]>([
    { x: 0.2, y: 0.3, name: 'SİBER ŞEHİR', type: 'city', active: true },
    { x: 0.8, y: 0.25, name: 'VERİ MERKEZİ', type: 'data-center' },
    { x: 0.15, y: 0.7, name: 'YASAK BÖLGE', type: 'restricted' },
    { x: 0.7, y: 0.8, name: 'NÖRAL AĞ', type: 'network' },
    { x: 0.5, y: 0.5, name: 'MERKEZ ÜS', type: 'hq', active: true },
  ]);

  // Nokta tıklama işleyicisi
  const handlePointClick = (index: number) => {
    setActivePoint(activePoint === index ? null : index);
  };

  // Canvas çizim efekti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas boyutlarını ayarla
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const size = Math.min(container.clientWidth, container.clientHeight) * 0.9;
      canvas.width = size;
      canvas.height = size;
      drawMap(ctx, size, size);
    };

    // Grid çiz
    const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(0, 255, 200, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      
      // Yatay çizgiler
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Dikey çizgiler
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    };

    // Noktalar arası bağlantıları çiz
    const drawConnections = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.strokeStyle = 'rgba(0, 255, 200, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      // Merkez noktasına bağlantılar
      const hq = points.find(p => p.type === 'hq');
      if (!hq) return;
      
      points.forEach(point => {
        if (point.type !== 'hq') {
          ctx.beginPath();
          ctx.moveTo(hq.x * width, hq.y * height);
          ctx.lineTo(point.x * width, point.y * height);
          ctx.stroke();
        }
      });
      
      ctx.setLineDash([]);
    };

    // Noktaları çiz
    const drawPoints = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      points.forEach((point, index) => {
        const x = point.x * width;
        const y = point.y * height;
        const isActive = activePoint === index || point.active;
        
        // Bağlantı efekti
        if (isActive) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
          gradient.addColorStop(0, 'rgba(0, 255, 200, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 255, 200, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Nokta
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 8 : 6, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#ff007f' : '#00ffc8';
        ctx.fill();
        
        // Parlama efekti
        const glowGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, isActive ? 20 : 15
        );
        glowGradient.addColorStop(0, isActive ? 'rgba(255, 0, 127, 0.8)' : 'rgba(0, 255, 200, 0.5)');
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(x - 25, y - 25, 50, 50);
      });
    };
    
    // Etiketleri çiz
    const drawLabels = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.font = '14px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      points.forEach((point, index) => {
        const x = point.x * width;
        const y = point.y * height;
        const isActive = activePoint === index || point.active;
        
        // Arka plan
        const textWidth = ctx.measureText(point.name).width;
        const padding = 10;
        const rectX = x - (textWidth / 2) - padding;
        const rectY = y - 35;
        const rectWidth = textWidth + (padding * 2);
        const rectHeight = 24;
        
        // Gölge efekti
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(rectX - 2, rectY + 2, rectWidth, rectHeight);
        
        // Arka plan
        ctx.fillStyle = isActive ? 'rgba(255, 0, 127, 0.2)' : 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
        
        // Kenar çizgisi
        ctx.strokeStyle = isActive ? '#ff007f' : '#00ffc8';
        ctx.lineWidth = 1;
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
        
        // Metin
        ctx.fillStyle = isActive ? '#ff007f' : '#00ffc8';
        ctx.fillText(point.name, x, y - 23);
      });
    };

    // Ana çizim fonksiyonu
    const drawMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Arka plan
      ctx.fillStyle = 'rgba(13, 1, 31, 0.9)';
      ctx.fillRect(0, 0, width, height);
      
      // Grid çiz
      drawGrid(ctx, width, height);
      
      // Bağlantıları çiz
      drawConnections(ctx, width, height);
      
      // Noktaları çiz
      drawPoints(ctx, width, height);
      
      // Etiketleri çiz
      drawLabels(ctx, width, height);
      
      // Tarama çizgisi efekti
      if (gifLoaded) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 255, 200, 0.02)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 200, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 255, 200, 0.02)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
    };

    // İlk çizim
    resizeCanvas();
    
    // Pencere boyutu değiştiğinde yeniden boyutlandır
    const handleResize = () => {
      requestAnimationFrame(() => {
        resizeCanvas();
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animasyon döngüsü
    let animationFrameId: number;
    const animate = () => {
      drawMap(ctx, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activePoint, gifLoaded, points]);

  return (
    <div className="map-container">
      {/* Arkaplan efektleri */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5" />
        <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10" />
        
        {/* Uzay efekti */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-cyan-400"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              boxShadow: '0 0 10px 1px rgba(0, 255, 200, 0.8)',
              animation: `pulse ${Math.random() * 2 + 1}s infinite alternate`,
            }}
          />
        ))}
      </div>
      
      {/* Ana harita canvas'ı */}
      <canvas 
        ref={canvasRef} 
        className="relative z-10 w-full h-full"
      />
      
      {/* Etkileşimli noktalar */}
      {points.map((point, index) => {
        const isActive = activePoint === index || point.active;
        return (
          <button
            key={index}
            className={`absolute z-20 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              isActive ? 'ring-2 ring-pink-500' : 'ring-1 ring-cyan-400'
            }`}
            style={{
              left: `${point.x * 100}%`,
              top: `${point.y * 100}%`,
            }}
            onClick={() => handlePointClick(index)}
            aria-label={point.name}
          >
            <span className="sr-only">{point.name}</span>
          </button>
        );
      })}
      
      {/* Animasyonlu gifler */}
      <div className="absolute inset-0 pointer-events-none">
        {activePoint !== null && (
          <div 
            className="absolute z-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 opacity-30"
            style={{
              left: `${points[activePoint].x * 100}%`,
              top: `${points[activePoint].y * 100}%`,
            }}
          >
            <AnimatedGif
              src="/images/hologram.gif"
              alt="Hologram effect"
              className="w-full h-full object-contain"
              playOnHover={false}
              loop={true}
            />
          </div>
        )}
      </div>
      
      {/* Tarama çizgisi efekti için görünmez yükleme */}
      <div className="hidden">
        <img 
          src="/images/scanline.png" 
          alt="" 
          onLoad={() => setGifLoaded(true)} 
        />
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GameMap;
