/**
 * @file HandwrittenLetter.tsx
 * @description Hiển thị bức thư tay 3 phần độc lập với font chữ viết tay mềm mại,
 * hiệu ứng hiện chữ tự nhiên, cuộn dọc mượt mà trên điện thoại
 * và phát hiện khi cuộn đến cuối để hiển thị nút "Em đã đọc xong rồi".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { websiteConfig } from '../../config/websiteConfig';

interface HandwrittenLetterProps {
  onReadDone: () => void;
  isEndingInProgress?: boolean;
}

export const HandwrittenLetter: React.FC<HandwrittenLetterProps> = ({
  onReadDone,
  isEndingInProgress = false
}) => {
  // Trạng thái reveal từng đoạn văn để tạo cảm giác viết tay tự nhiên
  const [revealedParagraphCount, setRevealedParagraphCount] = useState<number>(0);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<boolean>(false);
  const [isDoneClicked, setIsDoneClicked] = useState<boolean>(false);

  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const letterContainerRef = useRef<HTMLDivElement | null>(null);

  // Hiệu ứng hiện dần từng đoạn văn bản khi mới mở thư
  useEffect(() => {
    const totalCount = websiteConfig.letter.body.length;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      setRevealedParagraphCount(current);
      if (current >= totalCount) {
        clearInterval(timer);
      }
    }, 600);

    return () => clearInterval(timer);
  }, []);

  // Nhận biết khi người dùng đã cuộn tới cuối thư bằng IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasScrolledToBottom(true);
        }
      },
      {
        root: null,
        threshold: 0.2
      }
    );

    if (bottomSentinelRef.current) {
      observer.observe(bottomSentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDoneClick = () => {
    if (isDoneClicked || isEndingInProgress) return;
    setIsDoneClicked(true);
    onReadDone();
  };

  return (
    <div
      ref={letterContainerRef}
      className="relative z-20 mx-auto w-full max-w-lg px-3 pb-24 pt-4 sm:px-6 transition-all duration-700"
    >
      {/* KHUNG GIẤY VIẾT TAY TRẮNG NGÀ */}
      <article
        className="relative overflow-hidden rounded-3xl bg-[#FFFCFA] p-6 sm:p-8 paper-shadow border border-[#F4AFC4]/40"
        style={{
          backgroundImage:
            'radial-gradient(#F8C8DC 0.75px, transparent 0.75px), radial-gradient(#F8C8DC 0.75px, #FFFCFA 0.75px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      >
        {/* Hoa văn góc lá thư */}
        <div className="absolute top-3 right-4 flex items-center gap-1 text-[11px] font-sans font-medium text-[#E05780]/70 select-none">
          <Sparkles className="h-3 w-3 text-[#E05780]" />
          <span>29 / 11 / 2026</span>
        </div>

        {/* PHẦN 1: LỜI MỞ ĐẦU */}
        <header className="mb-6 pt-2">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#E05780] tracking-wide"
            style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
          >
            {websiteConfig.letter.greeting}
          </h2>
          <div className="mt-2 h-[1px] w-24 bg-gradient-to-r from-[#F4AFC4] to-transparent" />
        </header>

        {/* PHẦN 2: NỘI DUNG THƯ (TỪNG ĐOẠN HIỆN RA MƯỢT MÀ) */}
        <div
          className="space-y-4 text-lg sm:text-xl leading-relaxed text-[#704858]"
          style={{ fontFamily: "'Dancing Script', 'Caveat', cursive", fontFeatureSettings: '"kern"' }}
        >
          {websiteConfig.letter.body.map((paragraph, index) => (
            <p
              key={index}
              className={`transition-all duration-700 ${
                index < revealedParagraphCount
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2'
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* PHẦN 3: CHỮ KÝ */}
        <footer
          className={`mt-8 pt-4 border-t border-[#F8C8DC]/50 text-right transition-opacity duration-1000 ${
            revealedParagraphCount >= websiteConfig.letter.body.length ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
        >
          <p className="text-xl sm:text-2xl font-bold text-[#E05780]">
            {websiteConfig.letter.signature.closing}
          </p>
          <p className="text-base sm:text-lg text-[#704858] mt-1 font-medium whitespace-pre-line">
            {websiteConfig.letter.signature.sender}
          </p>
        </footer>

        {/* Điểm neo để phát hiện đã cuộn đến đáy thư */}
        <div ref={bottomSentinelRef} className="h-4 w-full" />
      </article>

      {/* GIAI ĐOẠN 6: NÚT "EM ĐÃ ĐỌC XONG RỒI" CHỈ HIỆN KHI ĐÃ CUỘN ĐẾN CUỐI */}
      <div
        className={`sticky bottom-6 mt-8 flex justify-center transition-all duration-500 ${
          hasScrolledToBottom && !isEndingInProgress
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <button
          onClick={handleDoneClick}
          disabled={isDoneClicked || isEndingInProgress}
          className="group relative flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-[#E05780] to-[#F4AFC4] px-8 py-3 text-sm font-semibold text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4 text-white" />
          <span>{websiteConfig.intro.readDoneButtonText}</span>
          <Heart className="h-4 w-4 fill-white text-white group-hover:animate-ping" />
        </button>
      </div>
    </div>
  );
};
