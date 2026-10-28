
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import PhotoMemoryIntro from './components/PhotoMemoryIntro';
import MatrixIntro from './components/MatrixIntro';
import { Envelope3D } from './components/Envelope/Envelope3D';
import PolaroidCard from './components/PolaroidCard';
import BirthdayWish from './components/BirthdayWish';
import { HandwrittenLetter } from './components/Letter/HandwrittenLetter';
import { FlowerPetalsCanvas } from './components/Flowers/FlowerPetalsCanvas';
import { FloatingMediaGallery } from './components/MediaGallery/FloatingMediaGallery';
import { MediaViewerModal } from './components/MediaViewer/MediaViewerModal';
import { EndingVortexScene } from './components/EndingScene/EndingVortexScene';
import { AudioToggle } from './components/AudioControl/AudioToggle';
import { MediaItem } from './config/websiteConfig';

type AppFlowState =
  | 'matrix'
  | 'intro'
  | 'envelope'
  | 'reading'
  | 'ending_vortex';

export default function App() {
  const [flowState, setFlowState] =
    useState<AppFlowState>('matrix');

  const [selectedMedia, setSelectedMedia] =
    useState<MediaItem | null>(null);

  // Từ màn hình dây ảnh chuyển sang phong bì
  const handleOpenIntro = () => {
    setFlowState('envelope');
  };

  // Khi phong thư mở hoàn tất, chuyển sang đọc thư
  const handleEnvelopeOpenComplete = () => {
    setFlowState('reading');
  };

  // Khi đọc thư xong, chuyển sang màn hình kết thúc
  const handleReadDone = () => {
    setFlowState('ending_vortex');
  };

  // Khởi động lại từ màn hình dây ảnh
  const handleRestart = () => {
    setFlowState('matrix');
    setSelectedMedia(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#FFF6F0] text-[#704858] font-sans">

      {/* Nhạc nền */}
      <AudioToggle />

      {/* Hiệu ứng hoa và cánh hoa */}
     {flowState !== 'ending_vortex' &&
  flowState !== 'intro' &&
  flowState !== 'matrix' && (
    <FlowerPetalsCanvas />
  )}

      {/* TRANG MỞ ĐẦU MATRIX: TÊN, NGÀY SINH VÀ HAPPY 23+ */}
      {flowState === 'matrix' && (
  <MatrixIntro
    onContinue={() => {
      setFlowState('intro');
    }}
  />
)}

      {/* MÀN HÌNH ĐẦU TIÊN: DÂY ẢNH VÀ ĐÈN VÀNG */}
      {flowState === 'intro' && (
        <PhotoMemoryIntro
          onOpenLetter={handleOpenIntro}
        />
      )}

      {/* MÀN HÌNH PHONG BÌ 3D */}
      {flowState === 'envelope' && (
        <main className="relative z-20 flex min-h-screen w-full max-w-none flex-col items-center justify-center p-0">
          <Envelope3D
            onOpenComplete={handleEnvelopeOpenComplete}
          />
        </main>
      )}

      {/* MÀN HÌNH ĐỌC THƯ VÀ XEM KỶ NIỆM */}
      {flowState === 'reading' && (
        <main className="relative z-20 min-h-screen w-full animate-fade-in">

          <FloatingMediaGallery
            onSelectItem={(item) => setSelectedMedia(item)}
          />

          {/* ẢNH POLAROID */}
          <section className="relative z-30 flex flex-col items-center gap-4 px-4 pt-8">
            <h2 className="text-center text-xl font-semibold text-[#a14f70]">
              Một chút kỷ niệm của chúng mình 💗
            </h2>

            <PolaroidCard
              image={`${import.meta.env.BASE_URL}images/p17.jpg`}
              date="2024.10.25 ✨"
              message="Anh yêu Em 💕"
              alt="Ảnh kỷ niệm của chúng mình"
            />

            <p className="text-sm text-[#a14f70]">
              Chạm vào ảnh để lật xem lời nhắn 💌
            </p>
          </section>

          {/* BÁNH SINH NHẬT VÀ LỜI CHÚC */}
          <BirthdayWish />

          {/* LÁ THƯ VIẾT TAY */}
          <div className="pt-8 sm:pt-12">
            <HandwrittenLetter
              onReadDone={handleReadDone}
              isEndingInProgress={false}
            />
          </div>

        </main>
      )}

      {/* MÀN HÌNH KẾT THÚC */}
      {flowState === 'ending_vortex' && (
        <EndingVortexScene onRestart={handleRestart} />
      )}

      {/* MODAL XEM ẢNH HOẶC VIDEO */}
      <MediaViewerModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />

    </div>
  );
}
