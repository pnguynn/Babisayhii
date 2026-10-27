/**
 * @file AudioToggle.tsx
 * @description Nút bật/tắt nhạc nền nổi tinh tế ở góc màn hình,
 * hiển thị trạng thái đang phát bằng đĩa nhạc xoay tròn hoặc sóng nhạc.
 */

import React, { useState, useEffect } from 'react';
import { Disc3, VolumeX } from 'lucide-react';
import { audioController } from '../../utils/audioPlayer';

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = audioController.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    audioController.toggle();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      title={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
      className="fixed top-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-[#E05780] shadow-md backdrop-blur-md border border-[#F4AFC4]/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
    >
      {isPlaying ? (
        <Disc3 className="h-5 w-5 animate-spin" style={{ animationDuration: '3.5s' }} />
      ) : (
        <VolumeX className="h-5 w-5 text-[#704858]/60" />
      )}
    </button>
  );
};
