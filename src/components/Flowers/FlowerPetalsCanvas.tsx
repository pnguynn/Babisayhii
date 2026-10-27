/**
 * @file FlowerPetalsCanvas.tsx
 * @description Hiệu ứng background đa dạng với:
 * - Cánh hoa đào / hoa hồng rơi
 * - Hoa hướng dương rực rỡ
 * - Hoa hồng kiêu sa
 * - Hoa cẩm tú cầu tím/lam pastel
 * - Trái tim hồng rơi lấp lánh
 * Sử dụng HTML5 Canvas hiệu năng cao 60 FPS với chiều sâu 3D và quỹ đạo lắc lư tự nhiên.
 */

import React, { useEffect, useRef } from 'react';

interface FlowerPetalsCanvasProps {
  isSuckingToCenter?: boolean;
  centerTarget?: { x: number; y: number };
}

type FallingItemType = 'heart' | 'sunflower' | 'rose' | 'hydrangea' | 'petal';

interface FallingItem {
  type: FallingItemType;
  x: number;
  y: number;
  z: number; // 0.6 đến 1.4 (chiều sâu 3D)
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  swingProgress: number;
  swingSpeed: number;
  opacity: number;
}

export const FlowerPetalsCanvas: React.FC<FlowerPetalsCanvasProps> = ({
  isSuckingToCenter = false,
  centerTarget
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const totalCount = Math.min(window.innerWidth < 640 ? 28 : 42, 45);
    const items: FallingItem[] = [];

    const types: FallingItemType[] = ['sunflower', 'rose', 'hydrangea', 'heart', 'petal', 'petal'];

    const createItem = (startY?: number): FallingItem => {
      const z = 0.6 + Math.random() * 0.8;
      const type = types[Math.floor(Math.random() * types.length)];
      let baseSize = 14;

      if (type === 'sunflower') baseSize = 20;
      else if (type === 'rose') baseSize = 18;
      else if (type === 'hydrangea') baseSize = 16;
      else if (type === 'heart') baseSize = 13;
      else baseSize = 12;

      return {
        type,
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        z,
        size: baseSize * z,
        // Tốc độ rơi hoa được tinh chỉnh chậm lại nhẹ nhàng và lãng mạn hơn
        speedY: (0.35 + Math.random() * 0.55) * z * 0.6,
        speedX: (Math.random() - 0.5) * 0.45,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.018,
        swingProgress: Math.random() * Math.PI * 2,
        swingSpeed: 0.01 + Math.random() * 0.018,
        opacity: 0.65 + Math.random() * 0.35
      };
    };

    for (let i = 0; i < totalCount; i++) {
      items.push(createItem());
    }

    // 1. Vẽ Trái tim rơi
    const drawHeart = (item: FallingItem) => {
      const s = item.size * 0.7;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.2, s * 0.5, 0, s * 1.2);
      ctx.bezierCurveTo(s * 1.2, s * 0.5, s, -s * 0.5, 0, s * 0.3);
      ctx.fillStyle = `rgba(244, 114, 182, ${item.opacity * 0.9})`;
      ctx.fill();
    };

    // 2. Vẽ Hoa Hướng Dương (Sunflower)
    const drawSunflower = (item: FallingItem) => {
      const s = item.size;
      const petalCount = 10;
      // Cánh vàng
      ctx.fillStyle = `rgba(255, 209, 102, ${item.opacity})`;
      for (let i = 0; i < petalCount; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.42, s * 0.15, s * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Nhụy nâu sẫm
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(107, 68, 35, ${item.opacity * 0.95})`;
      ctx.fill();
      // Chấm nhụy vàng nhạt ở giữa
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244, 162, 97, ${item.opacity})`;
      ctx.fill();
    };

    // 3. Vẽ Hoa Hồng (Rose)
    const drawRose = (item: FallingItem) => {
      const s = item.size;
      // Cánh ngoài
      ctx.fillStyle = `rgba(239, 71, 111, ${item.opacity * 0.85})`;
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 5);
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.32, s * 0.26, s * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Cánh trong màu hồng phấn
      ctx.fillStyle = `rgba(247, 141, 167, ${item.opacity * 0.95})`;
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI * 2) / 4 + 0.4);
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.18, s * 0.18, s * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Tâm hoa hồng xoắn nhẹ
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 4, 82, ${item.opacity})`;
      ctx.fill();
    };

    // 4. Vẽ Hoa Cẩm Tú Cầu (Hydrangea)
    const drawHydrangea = (item: FallingItem) => {
      const s = item.size;
      const florets = [
        { x: -s * 0.22, y: -s * 0.22, color: 'rgba(186, 215, 233, ' },
        { x: s * 0.22, y: -s * 0.22, color: 'rgba(218, 203, 237, ' },
        { x: 0, y: s * 0.25, color: 'rgba(248, 200, 220, ' }
      ];

      florets.forEach((f) => {
        ctx.fillStyle = `${f.color}${item.opacity * 0.9})`;
        for (let j = 0; j < 4; j++) {
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate((j * Math.PI) / 2);
          ctx.beginPath();
          ctx.ellipse(0, -s * 0.14, s * 0.08, s * 0.14, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        // Nhụy nhỏ giữa bông
        ctx.beginPath();
        ctx.arc(f.x, f.y, s * 0.03, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${item.opacity})`;
        ctx.fill();
      });
    };

    // 5. Vẽ Cánh Hoa Đào (Cherry blossom petal)
    const drawPetal = (item: FallingItem) => {
      const s = item.size;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
      ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
      ctx.fillStyle = `rgba(244, 175, 196, ${item.opacity * 0.9})`;
      ctx.fill();
    };

    let targetX = centerTarget?.x || width / 2;
    let targetY = centerTarget?.y || height / 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      items.forEach((item) => {
        if (isSuckingToCenter) {
          const dx = targetX - item.x;
          const dy = targetY - item.y;
          item.x += dx * 0.07;
          item.y += dy * 0.07;
          item.rotation += 0.09;
          item.size = Math.max(0, item.size * 0.95);
          item.opacity = Math.max(0, item.opacity * 0.95);
        } else {
          item.swingProgress += item.swingSpeed;
          item.x += Math.sin(item.swingProgress) * 0.9 + item.speedX;
          item.y += item.speedY;
          item.rotation += item.rotationSpeed;

          if (item.y > height + 30) {
            item.y = -30;
            item.x = Math.random() * width;
          }
          if (item.x < -30) item.x = width + 30;
          if (item.x > width + 30) item.x = -30;
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.scale(item.z, item.z);

        if (item.type === 'heart') drawHeart(item);
        else if (item.type === 'sunflower') drawSunflower(item);
        else if (item.type === 'rose') drawRose(item);
        else if (item.type === 'hydrangea') drawHydrangea(item);
        else drawPetal(item);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSuckingToCenter, centerTarget]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
    />
  );
};
