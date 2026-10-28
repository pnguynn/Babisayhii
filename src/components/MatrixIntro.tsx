
import { useEffect, useState } from 'react';
import './MatrixIntro.css';
import { audioController } from '../utils/audioPlayer';

type MatrixIntroProps = {
  onContinue: () => void;
};

const columns = Array.from({ length: 54 }, (_, index) => ({
  id: index,
  left: `${(index / 54) * 100}%`,
  delay: `${-((index * 7) % 90) / 10}s`,
  duration: `${4 + ((index * 13) % 55) / 10}s`,
  size: `${10 + ((index * 3) % 8)}px`,
  opacity: 0.35 + ((index * 11) % 60) / 100,
}));

// Hai chuỗi dùng cho hiệu ứng mưa Matrix.
const matrixMessages = ['PHUONGTHUY29102003', 'BABISAYHI'];

// Mỗi cột lặp lại một chuỗi theo đúng thứ tự để mưa Matrix chạy liên tục.
const matrixColumns = columns.map((column) => {
  const message = matrixMessages[column.id % matrixMessages.length];
  return {
    ...column,
    characters: message.split(''),
  };
});

export default function MatrixIntro({ onContinue }: MatrixIntroProps) {
  const [phase, setPhase] = useState(0);

  // Hiện nội dung lần lượt; không tự chuyển sang trang tiếp theo.
  useEffect(() => {
    const delays = [1800, 1300, 1200];

    if (phase >= 3) return;

    const timer = window.setTimeout(() => {
      setPhase((current) => current + 1);
    }, delays[phase]);

    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <main className="matrix-intro-screen">
      <div className="matrix-vignette" />

      <div className="matrix-rain" aria-hidden="true">
        {matrixColumns.map((column) => (
          <div
            className="matrix-rain-column"
            key={column.id}
            style={{
              left: column.left,
              animationDelay: column.delay,
              animationDuration: column.duration,
              fontSize: column.size,
              opacity: column.opacity,
            }}
          >
            {Array.from({ length: 22 }, (_, i) => (
              <span key={i}>
                {column.characters[i % column.characters.length]}
                {i < 21 ? '\n' : ''}
              </span>
            ))}
          </div>
        ))}
      </div>

      <section className="matrix-title-stage" aria-live="polite">
        <p className={`matrix-overline ${phase >= 1 ? 'is-visible' : ''}`}>
          A LITTLE SURPRISE FOR YOU
        </p>

        <h1 className={`matrix-name ${phase >= 1 ? 'is-visible' : ''}`}>
          Phương Thùy
        </h1>

        <p className={`matrix-date ${phase >= 2 ? 'is-visible' : ''}`}>
          29.10.03
        </p>

        <div className={`matrix-birthday ${phase >= 3 ? 'is-visible' : ''}`}>
          <span>HAPPY</span>
          <strong>23+</strong>
        </div>

        <p className={`matrix-subtitle ${phase >= 3 ? 'is-visible' : ''}`}>
          This little world was made for you ♡
        </p>

        <button
          className={`matrix-enter-button ${phase >= 3 ? 'is-visible' : ''}`}
          onClick={() => {
            void audioController.play();
            onContinue();
          }}
          type="button"
        >
          VÀO KỶ NIỆM <span aria-hidden="true">→</span>
        </button>
      </section>

      <p className="matrix-footer">MADE WITH LOVE · BABISAYHI</p>
    </main>
  );
}
