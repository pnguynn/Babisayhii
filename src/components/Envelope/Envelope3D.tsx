/**
 * @file Envelope3D.tsx
 * @description Màn hình phong thư ban đầu và animation mở nắp phong thư 3D.
 * Theo yêu cầu mới:
 * 1. Nắp phong thư mở lên 3D.
 * 2. Ngay tại miệng phong thư, 1 đóa hoa rực rỡ nở rộ (scale, xoay, bung cánh và phát sáng).
 * 3. Bức thư từ từ trồi lên từ sau đóa hoa, sau đó chuyển sang chế độ lướt đọc thư mượt mà.
 */
import './Envelope3D.css';
import React, { useState, useRef, useCallback } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { websiteConfig } from '../../config/websiteConfig';
import { audioController } from '../../utils/audioPlayer';

interface Envelope3DProps {
  onOpenComplete: () => void;
}

type Stage =
  | 'initial'
  | 'first_confirm'
  | 'second_confirm'
  | 'opening_flap'
  | 'flower_blooming'
  | 'letter_rising'
  | 'done';

export const Envelope3D: React.FC<Envelope3DProps> = ({ onOpenComplete }) => {
  const [stage, setStage] = useState<Stage>('initial');
  const [teaseMessage, setTeaseMessage] = useState<string | null>(null);

  // Vị trí di chuyển né tránh của nút "Rồi"
  const [yesButtonPos, setYesButtonPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isMovingRef = useRef(false);

  // Xử lý khi nhấn nút ban đầu / xác nhận lần 1
  const handleMainButtonClick = () => {
    if (stage === 'initial') {
      setStage('first_confirm');
    } else if (stage === 'first_confirm') {
      setStage('second_confirm');
    }
  };

  // Logic nút "Rồi": Di chuyển ngẫu nhiên an toàn trong khung nhìn
  const dodgeYesButton = useCallback(() => {
    if (isMovingRef.current) return;
    isMovingRef.current = true;

    const maxX = Math.min(window.innerWidth * 0.35, 120);
    const maxY = Math.min(window.innerHeight * 0.25, 100);

    const randomX = (Math.random() - 0.5) * 2 * maxX;
    const randomY = (Math.random() - 0.5) * 2 * maxY;

    setYesButtonPos({ x: randomX, y: randomY });

    setTimeout(() => {
      isMovingRef.current = false;
    }, 150);
  }, []);

  // Logic nút "Chưa": Khởi chạy nhạc, mở phong thư, nở hoa và đưa lá thư lên
  const handleNoClick = async () => {
    // 1. Kích hoạt âm nhạc từ thao tác hợp lệ của người dùng
    audioController.play();

    // 2. Hiện thông điệp trêu đùa ngọt ngào
    setTeaseMessage(websiteConfig.intro.noTeaseMessage);

    // 3. Sau khi đọc thông điệp, kích hoạt trình tự mở nắp thư 3D
    setTimeout(() => {
      setTeaseMessage(null);
      setStage('opening_flap');

      // 4. Bước 2: Nắp mở xong -> Bông hoa bung nở rực rỡ tại miệng thư
      setTimeout(() => {
        setStage('flower_blooming');

        // 5. Bước 3: Đóa hoa nở xong -> Bức thư từ từ trồi lên từ sau đóa hoa
        setTimeout(() => {
          setStage('letter_rising');

          // 6. Bước 4: Chuyển hoàn toàn sang giao diện lướt đọc thư
          setTimeout(() => {
            setStage('done');
            onOpenComplete();
          }, 1400);
        }, 1200);
      }, 800);
    }, 1300);
  };

  const isEnvelopeOpeningOrBeyond =
    stage === 'opening_flap' ||
    stage === 'flower_blooming' ||
    stage === 'letter_rising' ||
    stage === 'done';

  return (
    <div
      ref={containerRef}
      className="envelope-scene relative flex min-h-screen w-full max-w-none flex-col items-center justify-center px-4 py-8 select-none"
    >
      <div className="fairy-glow" aria-hidden="true" />
      {/* Thông điệp trêu đùa ngọt ngào khi bấm "Chưa" */}
      
{/* Ảnh Polaroid trang trí hai góc */}
<div className="envelope-polaroids" aria-hidden="true">
  <div className="envelope-polaroid polaroid-left">
    <img
      src={`${import.meta.env.BASE_URL}images/memory-left.jpg`}
      alt=""
    />
    <span>Our memories ♡</span>
  </div>

  <div className="envelope-polaroid polaroid-right">
    <img
      src={`${import.meta.env.BASE_URL}images/memory-right.jpg`}
      alt=""
    />
    <span>Forever together ♡</span>
  </div>
</div>

      {teaseMessage && (
        <div className="fixed top-12 z-50 mx-4 max-w-sm rounded-2xl bg-white/95 px-6 py-3.5 text-center shadow-xl backdrop-blur-md border border-[#F4AFC4] transition-all animate-bounce">
          <p className="text-sm font-medium text-[#704858]">{teaseMessage}</p>
        </div>
      )}

      {/* KHUNG PHONG THƯ 3D */}
      <div className="perspective-1000 my-auto flex flex-col items-center">
        <div
          className={`relative h-60 w-84 sm:h-64 sm:w-96 rounded-2xl bg-gradient-to-br from-[#FAD2E1] to-[#F4AFC4] p-2 transition-transform duration-700 envelope-shadow ${
            stage === 'initial' || stage === 'first_confirm' || stage === 'second_confirm'
              ? 'animate-soft-float'
              : ''
          } ${isEnvelopeOpeningOrBeyond ? 'scale-105' : ''}`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Nắp phong thư (Flap) - Animation lật 3D */}
          <div
            className="absolute -top-[1px] left-0 right-0 z-30 h-28 origin-top transition-transform duration-800 ease-in-out"
            style={{
              transform: isEnvelopeOpeningOrBeyond ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
              pointerEvents: 'none'
            }}
          >
            {/* Mặt ngoài nắp phong thư hình tam giác */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                background: 'linear-gradient(180deg, #F9CDDE 0%, #F4AFC4 100%)',
                boxShadow: '0 4px 6px -1px rgba(112, 72, 88, 0.1)'
              }}
            >
              {/* Con dấu sáp trái tim nổi bật */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#E05780] shadow-md border-2 border-[#FFA6C9]">
                <Heart className="h-5 w-5 fill-white text-white drop-shadow" />
              </div>
            </div>

            {/* Mặt trong nắp phong thư khi lật ngược lên */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                background: '#FFDEEB',
                transform: 'rotateX(180deg)',
                backfaceVisibility: 'hidden'
              }}
            />
          </div>

          {/* ĐÓA HOA NỞ RỘ NGAY MIỆNG PHONG THƯ (YÊU CẦU MỚI) */}
          {(stage === 'flower_blooming' || stage === 'letter_rising' || stage === 'done') && (
            <div
              className="absolute top-2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-1000 ease-out"
              style={{
                transform:
                  stage === 'flower_blooming'
                    ? 'translate(-50%, -50%) scale(1.3) rotate(15deg)'
                    : 'translate(-50%, -100%) scale(0.9) rotate(0deg)',
                opacity: stage === 'letter_rising' ? 0.75 : 1
              }}
            >
              <div className="relative flex items-center justify-center">
                {/* Vầng hào quang bung tỏa */}
                <div className="absolute h-32 w-32 rounded-full bg-gradient-to-r from-[#FFB7B2]/40 via-[#FFDAC1]/50 to-[#E2F0CB]/30 blur-xl animate-ping" />

                {/* SVG Đóa hoa nở rộ đa tầng cánh (hoa hồng / hoa mẫu đơn) */}
                <svg
                  width="110"
                  height="110"
                  viewBox="0 0 100 100"
                  className="drop-shadow-[0_8px_16px_rgba(224,87,128,0.4)] animate-spin"
                  style={{ animationDuration: '24s' }}
                >
                  <g transform="translate(50,50)">
                    {/* Lớp cánh ngoài cùng */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <path
                        key={`outer-${i}`}
                        d="M 0 0 C -16 -24 -24 -36 0 -48 C 24 -36 16 -24 0 0"
                        fill="#F4AFC4"
                        opacity="0.9"
                        transform={`rotate(${angle})`}
                      />
                    ))}
                    {/* Lớp cánh giữa */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
                      <path
                        key={`mid-${i}`}
                        d="M 0 0 C -12 -18 -18 -28 0 -36 C 18 -28 12 -18 0 0"
                        fill="#F8C8DC"
                        opacity="0.95"
                        transform={`rotate(${angle})`}
                      />
                    ))}
                    {/* Lớp cánh trong */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <path
                        key={`inner-${i}`}
                        d="M 0 0 C -8 -12 -12 -20 0 -26 C 12 -20 8 -12 0 0"
                        fill="#FFDAE6"
                        transform={`rotate(${angle})`}
                      />
                    ))}
                    {/* Nhụy hoa vàng óng ánh */}
                    <circle cx="0" cy="0" r="9" fill="#FFD166" />
                    <circle cx="0" cy="0" r="5" fill="#FFEAA7" />
                  </g>
                </svg>

                {/* Hạt lấp lánh xung quanh đóa hoa */}
                <Sparkles className="absolute -top-3 -right-3 h-5 w-5 text-[#FFEAA7] animate-bounce" />
                <Sparkles className="absolute -bottom-2 -left-3 h-4 w-4 text-[#FFD166] animate-pulse" />
              </div>
            </div>
          )}

          {/* Thân trong phong bì & Bức thư trồi lên */}
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#FDE2EC] border border-white/60">
            {/* Lá thư từ từ trồi lên từ phía sau đóa hoa */}
            <div
              className={`absolute left-3 right-3 rounded-xl bg-[#FFFCFA] p-4 shadow-xl border border-[#F4AFC4]/50 transition-all duration-1200 ease-out ${
                stage === 'letter_rising' || stage === 'done'
                  ? 'top-[-80px] bottom-[-20px] opacity-100 scale-105'
                  : 'top-3 bottom-3 opacity-90'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#F8C8DC] pb-1.5 text-[11px] font-sans text-[#704858]/80">
                <span className="flex items-center gap-1 font-semibold text-[#E05780]">
                  <Sparkles className="h-3.5 w-3.5" /> 20.10.2026
                </span>
                <span className="text-xs">Gửi Người Thương</span>
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <p
                  className="text-base font-bold text-[#E05780]"
                  style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
                >
                  {websiteConfig.letter.greeting}
                </p>
                <div className="h-1.5 w-4/5 rounded bg-[#F8C8DC]/70" />
                <div className="h-1.5 w-full rounded bg-[#FDE2EC]" />
                <div className="h-1.5 w-3/4 rounded bg-[#FDE2EC]" />
              </div>
            </div>

            {/* Mặt trước phong thư (vạt bao phủ) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                clipPath: 'polygon(0% 0%, 50% 50%, 100% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(135deg, #F8C8DC 0%, #F4AFC4 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.4)'
              }}
            >
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-4 py-1 text-xs font-medium text-[#704858] shadow-sm backdrop-blur-sm border border-white">
                To My Beloved ✨
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CỤM NÚT BẤM VÀ CÂU HỎI TƯƠNG TÁC */}
      <div className="mt-8 flex w-full max-w-xs flex-col items-center justify-center">
        {(stage === 'initial' || stage === 'first_confirm') && (
          <button
            onClick={handleMainButtonClick}
            className="group relative flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F4AFC4] to-[#E05780] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <span>
              {stage === 'initial'
                ? websiteConfig.intro.initialButtonText
                : websiteConfig.intro.firstConfirmText}
            </span>
            <Heart className="h-4 w-4 fill-white transition-transform group-hover:scale-125" />
          </button>
        )}

        {stage === 'second_confirm' && (
          <div className="flex w-full flex-col items-center gap-4 animate-fade-in">
            <p className="text-center font-medium text-[#ffe1c7] text-sm sm:text-base drop-shadow-lg">
              {websiteConfig.intro.secondConfirmQuestion}
            </p>

            <div className="relative flex w-full items-center justify-center gap-4">
              <button
                type="button"
                onMouseEnter={dodgeYesButton}
                onTouchStart={dodgeYesButton}
                onClick={dodgeYesButton}
                style={{
                  transform: yesButtonPos
                    ? `translate(${yesButtonPos.x}px, ${yesButtonPos.y}px)`
                    : 'none',
                  transition: 'transform 0.18s cubic-bezier(0.2, 0.9, 0.3, 1)'
                }}
                className="min-h-[44px] min-w-[90px] rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-[#704858] shadow-md border border-[#F8C8DC] hover:bg-slate-50 active:scale-95 transition-colors cursor-pointer select-none"
              >
                {websiteConfig.intro.buttonYesText}
              </button>

              <button
                type="button"
                onClick={handleNoClick}
                className="min-h-[44px] min-w-[90px] rounded-full bg-gradient-to-r from-[#F4AFC4] to-[#E05780] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#F4AFC4]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{websiteConfig.intro.buttonNoText}</span>
                <Heart className="h-3.5 w-3.5 fill-white text-white" />
              </button>
            </div>
          </div>
        )}

        {(stage === 'opening_flap' || stage === 'flower_blooming' || stage === 'letter_rising') && (
          <div className="flex items-center gap-2 text-sm font-medium text-[#704858] animate-pulse">
            <Sparkles className="h-4 w-4 text-[#E05780]" />
            <span>
              {stage === 'opening_flap' && 'Đang mở phong thư...'}
              {stage === 'flower_blooming' && 'Đóa hoa tình yêu đang nở rộ... 🌸'}
              {stage === 'letter_rising' && 'Bức thư trao gửi đang hé lộ... ✨'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
