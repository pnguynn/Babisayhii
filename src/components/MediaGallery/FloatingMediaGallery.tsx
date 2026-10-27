/**
 * @file FloatingMediaGallery.tsx
 * @description Ảnh và video kỷ niệm rơi từ trên xuống đáy màn hình và lặp lại liên tục,
 * tương tự như hoa và trái tim nhưng rơi chậm hơn, có hiệu ứng 3D trước - sau,
 * lớp chồng lớp và độ nghiêng tự nhiên như ảnh polaroid trôi trong gió.
 * Người dùng có thể chạm vào bất cứ lúc nào để phóng to xem chi tiết.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { MediaItem, websiteConfig } from '../../config/websiteConfig';

interface FloatingMediaGalleryProps {
  onSelectItem: (item: MediaItem) => void;
  isSuckingToCenter?: boolean;
}

interface FallingMediaCard {
  item: MediaItem;
  xPercent: number; // Tọa độ ngang theo % màn hình (chia về 2 bên cánh để không che thư)
  y: number;        // Tọa độ dọc (px)
  speedY: number;   // Tốc độ rơi chậm rãi
  rotation: number; // Độ nghiêng polaroid
  scale: number;    // Tỉ lệ theo chiều sâu 3D (0.75 đến 1.05)
  zIndex: number;   // Lớp trước sau (12 đến 24)
  opacity: number;  // Độ trong suốt theo lớp
  swaySeed: number; // Hạt giống lắc lư
}

export const FloatingMediaGallery: React.FC<FloatingMediaGalleryProps> = ({
  onSelectItem,
  isSuckingToCenter = false
}) => {
  const mediaList = websiteConfig.mediaItems;
  const [cards, setCards] = useState<FallingMediaCard[]>([]);
  const requestRef = useRef<number | null>(null);
  const cardsRef = useRef<FallingMediaCard[]>([]);

  // Khởi tạo vị trí rơi so le cho các ảnh/video
  useEffect(() => {
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isMobile = window.innerWidth < 640;

    // Phân bổ tọa độ X sang 2 bên để giữ khoảng trống ở giữa cho việc đọc thư
    const xSlots = isMobile
      ? [2, 68, 4, 65, 8, 62] // % trên mobile: áp sát 2 mép
      : [4, 76, 8, 72, 12, 68]; // % trên màn hình rộng

    // Trải đều 30 ảnh và video (21 ảnh + 9 video) trên không gian cuộn dọc
    const spreadHeight = Math.max(screenH * 3.6, 2800);

    const initialCards: FallingMediaCard[] = mediaList.map((item, idx) => {
      // Phân tầng 3D: Một số ở trước (to, đậm), một số ở sau (nhỏ hơn, mờ nhẹ)
      const isFrontLayer = idx % 2 === 0;
      const zIndex = isFrontLayer ? 22 : 14;
      const scale = isFrontLayer ? (isMobile ? 0.92 : 1.05) : (isMobile ? 0.75 : 0.85);
      const opacity = isFrontLayer ? 0.98 : 0.88;

      return {
        item,
        xPercent: xSlots[idx % xSlots.length],
        // Rải đều 30 ảnh và video để xuất hiện lần lượt rơi xuống êm ái
        y: (idx * (spreadHeight / Math.max(1, mediaList.length))) - 250,
        speedY: (0.42 + (idx % 4) * 0.12), // Rơi chậm rãi hơn cánh hoa rất nhiều
        rotation: (idx % 2 === 0 ? -1 : 1) * (4 + (idx % 4) * 2),
        scale,
        zIndex,
        opacity,
        swaySeed: Math.random() * Math.PI * 2
      };
    });

    cardsRef.current = initialCards;
    setCards(initialCards);

    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.66, 2.0);
      lastTime = now;

      if (!isSuckingToCenter) {
        const height = window.innerHeight;

        cardsRef.current = cardsRef.current.map((card) => {
          let newY = card.y + card.speedY * dt;
          card.swaySeed += 0.02 * dt;

          // Khi rơi qua đáy màn hình -> quay lại phía trên đỉnh và tiếp tục rơi
          if (newY > height + 160) {
            newY = -180;
          }

          return {
            ...card,
            y: newY
          };
        });

        setCards([...cardsRef.current]);
      }

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mediaList, isSuckingToCenter]);

  return (
    <div className="pointer-events-none fixed inset-0 z-15 overflow-hidden">
      {cards.map((card, index) => {
        const swayOffset = Math.sin(card.swaySeed) * 8;

        return (
          <div
            key={card.item.id || index}
            style={{
              left: `${card.xPercent}%`,
              top: `${card.y}px`,
              zIndex: card.zIndex,
              transform: isSuckingToCenter
                ? 'scale(0) rotate(180deg)'
                : `translateX(${swayOffset}px) scale(${card.scale}) rotate(${card.rotation}deg)`,
              opacity: isSuckingToCenter ? 0 : card.opacity,
              transition: isSuckingToCenter
                ? `all 1.1s cubic-bezier(0.6, 0, 0.2, 1) ${index * 0.15}s`
                : 'transform 0.1s linear'
            }}
            className="pointer-events-auto absolute w-32 sm:w-44 select-none cursor-pointer group"
            onClick={() => onSelectItem(card.item)}
          >
            {/* Khung ảnh Polaroid với hiệu ứng 3D viền nổi và bóng đổ đa tầng */}
            <div className="rounded-2xl bg-white p-2 sm:p-2.5 shadow-xl border border-[#F4AFC4]/50 transition-all duration-300 group-hover:scale-110 group-hover:z-50 group-hover:shadow-2xl">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-slate-100">
                {card.item.type === 'image' ? (
                  <img
                    src={card.item.url}
                    alt={card.item.caption || 'Kỷ niệm'}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="relative h-full w-full bg-slate-900">
                    <img
                      src={card.item.thumbnail || card.item.url}
                      alt="Video preview"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 text-[#E05780] shadow-md backdrop-blur-xs">
                        <Play className="h-3.5 w-3.5 fill-[#E05780] ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/80 backdrop-blur-xs text-[#E05780]">
                  <Sparkles className="h-3 w-3" />
                </div>
              </div>

              {card.item.caption && (
                <div className="mt-1.5 truncate px-1 text-center font-sans text-[10px] sm:text-xs font-medium text-[#704858]">
                  {card.item.caption}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
