/**
 * @file MediaViewerModal.tsx
 * @description Modal phóng to ảnh và video với trải nghiệm xem toàn màn hình cao cấp,
 * hỗ trợ nút X, đóng bằng click bên ngoài, phím Escape, và bộ điều khiển video đầy đủ.
 */

import React, { useEffect } from 'react';
import { X, Play, Volume2, Sparkles } from 'lucide-react';
import { MediaItem } from '../../config/websiteConfig';

interface MediaViewerModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ item, onClose }) => {
  // Lắng nghe phím Escape để đóng modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      // Ngăn cuộn trang phía sau khi đang mở modal
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Nút X đóng rõ ràng ở góc trên bên phải */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Đóng"
        className="fixed top-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40 active:scale-95 cursor-pointer"
      >
        <X className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Khung nội dung ảnh/video chính giữa */}
      <div
        className="relative max-h-[90vh] max-w-lg w-full flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-2xl transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'image' ? (
          <div className="relative w-full flex items-center justify-center bg-black">
            <img
              src={item.url}
              alt={item.caption || 'Kỷ niệm 20/10'}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-full object-contain select-none"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            <video
              src={item.url}
              poster={item.thumbnail}
              controls
              autoPlay
              playsInline
              className="max-h-[75vh] w-full object-contain"
            >
              Trình duyệt của bạn không hỗ trợ phát video này.
            </video>
          </div>
        )}

        {/* Chú thích ảnh / video */}
        {item.caption && (
          <div className="w-full bg-[#1A1A1A] px-4 py-3 text-center border-t border-white/10">
            <p className="text-sm font-medium text-white/90 flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#F4AFC4]" />
              <span>{item.caption}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
