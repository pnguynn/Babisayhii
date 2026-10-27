/**
 * @file EndingVortexScene.tsx
 * @description Cảnh kết thúc hoạt hình đặc biệt:
 * 1. Màn hình chuyển sang màu trắng tinh khôi, các hiệu ứng trước đó biến mất.
 * 2. Nhân vật từ ảnh tùy chỉnh (cầm bó hoa và lời chúc) bước đi từ trái sang phải, hoa nở theo bước chân.
 * 3. Đến mép phải, nhân vật quay lại, chạy nhanh về giữa màn hình (zoom to lên).
 * 4. Bùng sáng lấp lánh để hiện ra bức ảnh kỷ niệm cuối.
 * 5. Bức ảnh cuối xuất hiện với hiệu ứng ZOOM TO DẦN LÊN (hoàn toàn sạch sẽ, không text/caption).
 * 6. Khi ảnh zoom xong, HIỆU ỨNG MÔI HÔN TỚI (từ nhỏ bay vút zoom to dần lên) dính chặt trên màn hình như vết son môi ngọt ngào 💋.
 * 7. Background hoa rơi lãng mạn tiếp tục bay trong gió.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { websiteConfig } from '../../config/websiteConfig';
import { FlowerPetalsCanvas } from '../Flowers/FlowerPetalsCanvas';

interface EndingVortexSceneProps {
  onRestart: () => void;
}

type Stage =
  | 'walking_right'    // Đi từ trái sang phải, cầm bó hoa & lời chúc, hoa nở theo chân
  | 'pausing_at_right' // Dừng lại ở mép phải, quay đầu lại
  | 'running_to_center'// Chạy về tâm màn hình và phóng to
  | 'burst'            // Bùng nổ hạt sáng thần tiên
  | 'photo_revealed';  // Hiện ảnh kỷ niệm với background hoa rơi

type KissState = 'waiting' | 'flying' | 'stamped';

interface FootstepFlower {
  id: number;
  x: number;
  y: number;
  type: 'sunflower' | 'rose' | 'hydrangea' | 'pink_bloom';
  size: number;
  rotation: number;
}

export const EndingVortexScene: React.FC<EndingVortexSceneProps> = ({ onRestart }) => {
  const [stage, setStage] = useState<Stage>('walking_right');
  const [characterPos, setCharacterPos] = useState<{ x: number; y: number; scale: number; facing: 1 | -1 }>({
    x: -120,
    y: 0,
    scale: 1,
    facing: 1
  });
  const [flowers, setFlowers] = useState<FootstepFlower[]>([]);
  
  // Trạng thái zoom của ảnh cuối & hiệu ứng môi hôn
  const [isPhotoZoomed, setIsPhotoZoomed] = useState<boolean>(false);
  const [kissState, setKissState] = useState<KissState>('waiting');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const groundY = height * 0.70;

    // GIAI ĐOẠN 1: Đi từ bên trái sang bên phải
    const targetRightX = width - (window.innerWidth < 640 ? 120 : 160);
    const walkDuration = 4400;
    const startTime = performance.now();
    let flowerCounter = 0;
    let lastFlowerX = -120;

    let animId: number;

    const animateWalk = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / walkDuration, 1);

      const currentX = -120 + progress * (targetRightX - (-120));
      const bobY = groundY + Math.sin(progress * 32) * 5;

      setCharacterPos({
        x: currentX,
        y: bobY,
        scale: 1,
        facing: 1
      });

      if (currentX - lastFlowerX > 32 && currentX > 10 && currentX < width - 60) {
        lastFlowerX = currentX;
        flowerCounter++;

        const flowerTypes: ('sunflower' | 'rose' | 'hydrangea' | 'pink_bloom')[] = [
          'sunflower',
          'rose',
          'hydrangea',
          'pink_bloom'
        ];
        const chosenType = flowerTypes[flowerCounter % flowerTypes.length];

        setFlowers((prev) => [
          ...prev,
          {
            id: flowerCounter,
            x: currentX + 45 + (Math.random() - 0.5) * 12,
            y: groundY + 70 + (Math.random() - 0.5) * 8,
            type: chosenType,
            size: 26 + (flowerCounter % 3) * 6,
            rotation: (Math.random() - 0.5) * 35
          }
        ]);
      }

      if (progress < 1) {
        animId = requestAnimationFrame(animateWalk);
      } else {
        setStage('pausing_at_right');

        setTimeout(() => {
          setCharacterPos((prev) => ({ ...prev, facing: -1 }));

          setTimeout(() => {
            setStage('running_to_center');
            const runStartTime = performance.now();
            const runDuration = 1200;
            const startX = targetRightX;
            const startY = groundY;
            const centerX = width / 2 - 50;
            const centerY = height * 0.45;

            const animateRun = (runNow: number) => {
              const runElapsed = runNow - runStartTime;
              const runProg = Math.min(runElapsed / runDuration, 1);

              const easeProg = runProg * runProg;
              const runX = startX + (centerX - startX) * easeProg;
              const runY = startY + (centerY - startY) * easeProg;
              const currentScale = 1 + easeProg * 2.8;

              setCharacterPos({
                x: runX,
                y: runY,
                scale: currentScale,
                facing: -1
              });

              if (runProg < 1) {
                requestAnimationFrame(animateRun);
              } else {
                setStage('burst');

                setTimeout(() => {
                  setStage('photo_revealed');
                }, 400);
              }
            };

            requestAnimationFrame(animateRun);
          }, 600);
        }, 400);
      }
    };

    animId = requestAnimationFrame(animateWalk);

    return () => cancelAnimationFrame(animId);
  }, []);

  // Xử lý chuỗi animation khi ảnh cuối xuất hiện: Zoom ảnh lên -> Môi hôn bay tới dính vào màn hình
  useEffect(() => {
    if (stage !== 'photo_revealed') return;

    // 1. Kích hoạt zoom to ảnh cuối ngay lập tức
    const zoomStartTimer = setTimeout(() => {
      setIsPhotoZoomed(true);
    }, 50);

    // 2. Sau khi ảnh zoom to hoàn tất (~1250ms) -> Môi hôn bắt đầu bay tới
    const kissFlyTimer = setTimeout(() => {
      setKissState('flying');

      // 3. Môi hôn bay tới và dính 'CHỤT' lên màn hình (~550ms sau)
      const kissStampTimer = setTimeout(() => {
        setKissState('stamped');
      }, 550);

      return () => clearTimeout(kissStampTimer);
    }, 1250);

    return () => {
      clearTimeout(zoomStartTimer);
      clearTimeout(kissFlyTimer);
    };
  }, [stage]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white select-none transition-colors duration-700"
    >
      {/* BACKGROUND HOA RƠI Ở ẢNH CUỐI */}
      {stage === 'photo_revealed' && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <FlowerPetalsCanvas />
        </div>
      )}

      {/* VỆT HOA NỞ RỰC RỠ THEO TỪNG BƯỚC CHÂN */}
      {(stage === 'walking_right' ||
        stage === 'pausing_at_right' ||
        stage === 'running_to_center' ||
        stage === 'burst') && (
        <div className="pointer-events-none absolute inset-0 z-10">
          {flowers.map((fl) => (
            <div
              key={fl.id}
              className="absolute transition-all duration-700 ease-out animate-in zoom-in-0"
              style={{
                left: `${fl.x}px`,
                top: `${fl.y}px`,
                transform: `translate(-50%, -100%) rotate(${fl.rotation}deg)`
              }}
            >
              {fl.type === 'sunflower' && (
                <div className="relative flex items-center justify-center">
                  <svg width={fl.size} height={fl.size} viewBox="0 0 40 40">
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((ang) => (
                      <ellipse
                        key={ang}
                        cx="20"
                        cy="9"
                        rx="4"
                        ry="9"
                        fill="#FFD166"
                        transform={`rotate(${ang} 20 20)`}
                      />
                    ))}
                    <circle cx="20" cy="20" r="7" fill="#6B4423" />
                  </svg>
                  <div className="absolute -bottom-1 h-3 w-1 rounded-full bg-emerald-500/80 -z-10" />
                </div>
              )}

              {fl.type === 'rose' && (
                <div className="relative flex items-center justify-center">
                  <svg width={fl.size} height={fl.size} viewBox="0 0 40 40">
                    {[0, 72, 144, 216, 288].map((ang) => (
                      <ellipse
                        key={ang}
                        cx="20"
                        cy="11"
                        rx="6"
                        ry="8"
                        fill="#EF476F"
                        transform={`rotate(${ang} 20 20)`}
                      />
                    ))}
                    {[36, 108, 180, 252, 324].map((ang) => (
                      <ellipse
                        key={ang}
                        cx="20"
                        cy="14"
                        rx="5"
                        ry="6"
                        fill="#F78DA7"
                        transform={`rotate(${ang} 20 20)`}
                      />
                    ))}
                    <circle cx="20" cy="20" r="4" fill="#D90429" />
                  </svg>
                  <div className="absolute -bottom-1 h-3 w-1 rounded-full bg-emerald-500/80 -z-10" />
                </div>
              )}

              {fl.type === 'hydrangea' && (
                <div className="relative flex items-center justify-center">
                  <svg width={fl.size} height={fl.size} viewBox="0 0 40 40">
                    <g transform="translate(14, 14)">
                      {[0, 90, 180, 270].map((a) => (
                        <circle key={a} cx="0" cy="-4" r="3" fill="#DCCEF9" transform={`rotate(${a})`} />
                      ))}
                      <circle cx="0" cy="0" r="1.5" fill="#FFF" />
                    </g>
                    <g transform="translate(26, 15)">
                      {[0, 90, 180, 270].map((a) => (
                        <circle key={a} cx="0" cy="-4" r="3" fill="#BAD7E9" transform={`rotate(${a})`} />
                      ))}
                      <circle cx="0" cy="0" r="1.5" fill="#FFF" />
                    </g>
                    <g transform="translate(20, 26)">
                      {[0, 90, 180, 270].map((a) => (
                        <circle key={a} cx="0" cy="-4" r="3" fill="#F8C8DC" transform={`rotate(${a})`} />
                      ))}
                      <circle cx="0" cy="0" r="1.5" fill="#FFF" />
                    </g>
                  </svg>
                </div>
              )}

              {fl.type === 'pink_bloom' && (
                <div className="relative flex items-center justify-center">
                  <svg width={fl.size} height={fl.size} viewBox="0 0 40 40">
                    {[0, 60, 120, 180, 240, 300].map((ang) => (
                      <circle
                        key={ang}
                        cx="20"
                        cy="11"
                        r="5.5"
                        fill="#F4AFC4"
                        transform={`rotate(${ang} 20 20)`}
                      />
                    ))}
                    <circle cx="20" cy="20" r="5" fill="#FFF2F6" />
                    <circle cx="20" cy="20" r="2.5" fill="#FFD166" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* NHÂN VẬT TÙY CHỈNH TỪ ẢNH BƯỚC ĐI, CẦM BÓ HOA VÀ LỜI CHÚC */}
      {(stage === 'walking_right' ||
        stage === 'pausing_at_right' ||
        stage === 'running_to_center') && (
        <div
          className="pointer-events-none absolute z-30 transition-transform duration-75"
          style={{
            left: `${characterPos.x}px`,
            top: `${characterPos.y}px`,
            transform: `scale(${characterPos.scale}) scaleX(${characterPos.facing})`,
            transformOrigin: 'bottom center'
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* 1. KHUNG TEXT LỜI CHÚC */}
            <div
              className="mb-2 whitespace-nowrap rounded-2xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#E05780] shadow-lg border border-[#F4AFC4] flex items-center gap-1.5 backdrop-blur-xs animate-bounce"
              style={{
                transform: `scaleX(${characterPos.facing})`
              }}
            >
              <span>{websiteConfig.finalScene.walkingGreetingText}</span>
              <Heart className="h-3.5 w-3.5 fill-[#E05780] text-[#E05780]" />
            </div>

            {/* 2. HÌNH ẢNH NHÂN VẬT BẠN ĐƯA VÀO */}
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 drop-shadow-xl">
              <div className="h-full w-full overflow-hidden rounded-full border-3 border-white shadow-md bg-white">
                <img
                  src={websiteConfig.finalScene.walkingCharacterImage}
                  alt="Walking character"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 3. BÓ HOA TƯƠI CẦM TRÊN TAY */}
              <div className="absolute -bottom-2 -right-2 z-20 flex items-center justify-center rounded-full bg-white/90 p-1.5 shadow-md border border-[#F4AFC4] animate-pulse">
                <svg width="34" height="34" viewBox="0 0 40 40" className="drop-shadow">
                  <path d="M 12 28 C 8 20 14 16 18 20" stroke="#4ADE80" strokeWidth="2.5" fill="none" />
                  <path d="M 28 28 C 32 20 26 16 22 20" stroke="#4ADE80" strokeWidth="2.5" fill="none" />
                  <circle cx="16" cy="14" r="6" fill="#EF476F" />
                  <circle cx="16" cy="14" r="3" fill="#F78DA7" />
                  <circle cx="25" cy="14" r="6" fill="#FFD166" />
                  <circle cx="25" cy="14" r="2.5" fill="#6B4423" />
                  <circle cx="20" cy="19" r="6.5" fill="#F4AFC4" />
                  <circle cx="20" cy="19" r="3" fill="#FFEAA7" />
                  <path d="M 14 24 L 20 34 L 26 24 Z" fill="#FDE2EC" stroke="#F4AFC4" strokeWidth="1" />
                  <circle cx="20" cy="27" r="2" fill="#E05780" />
                </svg>
              </div>

              {stage === 'pausing_at_right' && (
                <div className="absolute -top-3 left-0 animate-bounce">
                  <Heart className="h-6 w-6 fill-[#E05780] text-[#E05780]" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BÙNG NỔ HẠT SÁNG THẦN TIÊN */}
      {stage === 'burst' && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <div className="h-96 w-96 rounded-full bg-gradient-to-r from-[#FFDAE6] via-[#FFD166] to-[#F8C8DC] blur-3xl animate-ping" />
          <div className="flex items-center justify-center gap-4 text-[#E05780]">
            <Sparkles className="h-16 w-16 animate-spin" />
          </div>
        </div>
      )}

      {/* BỨC ẢNH KỶ NIỆM SẠCH ĐẸP (KHÔNG CẦN CAP HAY LỜI CHÚC) + ANIMATION MÔI HÔN DÍNH TRÊN MÀN HÌNH */}
      {stage === 'photo_revealed' && (
        <div className="relative z-30 flex min-h-screen w-full flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FFF6F0]/85 via-[#FFEBF2]/90 to-[#FFF0F5]/85">
          {/* Vầng hào quang lung linh phía sau ảnh */}
          <div className="absolute h-96 w-96 rounded-full bg-gradient-to-tr from-[#E05780]/20 via-[#F4AFC4]/30 to-transparent blur-3xl pointer-events-none" />

          {/* KHUNG BỨC ẢNH KỶ NIỆM - ZOOM TO LÊN TỪ NHỎ RA TO */}
          <div
            className="relative max-w-sm sm:max-w-md w-full flex flex-col items-center transition-all duration-1200 ease-out"
            style={{
              transform: isPhotoZoomed ? 'scale(1)' : 'scale(0.18)',
              opacity: isPhotoZoomed ? 1 : 0,
              filter: isPhotoZoomed ? 'blur(0px)' : 'blur(10px)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Ảnh kỷ niệm hiển thị trọn vẹn, không có chữ hay caption che lấp */}
            <div className="relative aspect-9/16 w-full max-h-[85vh] overflow-hidden rounded-3xl border-3 border-[#FFA6C9] shadow-[0_16px_50px_rgba(224,87,128,0.28)] bg-white">
              <img
                src={websiteConfig.finalScene.finalImageUrl}
                alt="Final Celebration Memory"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover select-none"
              />

              {/* HIỆU ỨNG MÔI HÔN BAY TỚI VÀ DÍNH LÊN MÀN HÌNH (KISS ANIMATION) */}
              {kissState !== 'waiting' && (
                <div
                  className="pointer-events-none absolute z-50 flex items-center justify-center transition-all ease-out"
                  style={{
                    top: '25%',
                    right: '16%',
                    transform:
                      kissState === 'flying'
                        ? 'translate(50%, 50%) scale(0.1) rotate(-25deg)'
                        : 'translate(0, 0) scale(1) rotate(-8deg)',
                    opacity: kissState === 'flying' ? 0.3 : 0.95,
                    transitionDuration: kissState === 'flying' ? '0ms' : '550ms',
                    transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Dấu Môi Hôn Son Đỏ Chân Thật */}
                    <div className="relative drop-shadow-[0_4px_14px_rgba(217,4,41,0.65)]">
                      <svg
                        width="116"
                        height="82"
                        viewBox="0 0 120 85"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDuration: '2.8s' }}
                      >
                        <path
                          d="M 12 42 C 22 24, 38 18, 50 26 C 56 30, 64 30, 70 26 C 82 18, 98 24, 108 42 C 92 46, 78 37, 60 38 C 42 37, 28 46, 12 42 Z"
                          fill="url(#kissGrad1)"
                        />
                        <path
                          d="M 15 45 C 30 50, 42 43, 60 44 C 78 43, 90 50, 105 45 C 96 68, 78 78, 60 78 C 42 78, 24 68, 15 45 Z"
                          fill="url(#kissGrad2)"
                        />
                        <ellipse cx="60" cy="42" rx="22" ry="3" fill="#780016" opacity="0.6" />
                        <ellipse cx="48" cy="56" rx="14" ry="4" fill="#FFAEC0" opacity="0.65" />
                        <ellipse cx="72" cy="56" rx="12" ry="3.5" fill="#FFAEC0" opacity="0.55" />
                        <ellipse cx="44" cy="28" rx="8" ry="2.5" fill="#FFAEC0" opacity="0.5" />
                        <ellipse cx="76" cy="28" rx="8" ry="2.5" fill="#FFAEC0" opacity="0.5" />

                        <defs>
                          <linearGradient id="kissGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF4D6D" />
                            <stop offset="40%" stopColor="#E01E37" />
                            <stop offset="100%" stopColor="#C9184A" />
                          </linearGradient>
                          <linearGradient id="kissGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FF758F" />
                            <stop offset="50%" stopColor="#D90429" />
                            <stop offset="100%" stopColor="#A01A33" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Dòng chữ Chụt! 💖 khi dính vào màn hình */}
                    {kissState === 'stamped' && (
                      <div className="absolute -top-6 -right-4 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 shadow-md border border-[#FF758F] text-[11px] font-bold text-[#D90429] animate-bounce">
                        <span>Chụt!</span>
                        <Heart className="h-3 w-3 fill-[#D90429] text-[#D90429]" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Nút xem lại từ đầu */}
            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                onClick={onRestart}
                className="flex min-h-[46px] items-center gap-2 rounded-full bg-gradient-to-r from-[#E05780] to-[#F4AFC4] px-7 py-3 text-sm font-semibold text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Xem lại từ đầu 🌸</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
