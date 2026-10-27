
import { useState } from 'react';
import confetti from 'canvas-confetti';
import './BirthdayWish.css';

export default function BirthdayWish() {
  const [wished, setWished] = useState(false);

  function makeWish() {
    if (wished) return;

    setWished(true);

    confetti({
      particleCount: 160,
      spread: 100,
      startVelocity: 40,
      origin: { y: 0.65 },
      colors: ['#ff7ca8', '#ffd166', '#ffffff', '#cda4ff', '#ffacc7'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.55 },
        colors: ['#ff7ca8', '#ffd166', '#ffffff', '#cda4ff'],
      });
    }, 450);
  }

  return (
    <section className="birthday-wish">
      <h2 className="birthday-title">
        Happy Birthday, Em 💗
      </h2>

      <p className="birthday-subtitle">
        Hôm nay là ngày đặc biệt của em
      </p>

      <button
        type="button"
        className={`birthday-cake ${wished ? 'cake-wished' : ''}`}
        onClick={makeWish}
        aria-label="Bấm vào bánh sinh nhật để ước"
      >
        <span className="cake-candles">
          <span className="candle">
            <span className="flame" />
          </span>
          <span className="candle">
            <span className="flame" />
          </span>
          <span className="candle">
            <span className="flame" />
          </span>
        </span>

        <span className="cake-top">
          <span className="cake-heart">♥</span>
        </span>

        <span className="cake-body">
          Happy Birthday
        </span>

        <span className="cake-plate" />
      </button>

      <p className="wish-message">
        {wished
          ? 'Chúc điều ước của em thành sự thật! 💖'
          : 'Ước điều gì đi nào! Chúc mừng sinh nhật bé ✨'}
      </p>

      <button
        type="button"
        className="wish-button"
        onClick={makeWish}
        disabled={wished}
      >
        {wished ? 'Yêu em thật nhiều 💗' : 'Nhấn vào đây để ước nhé! 💕'}
      </button>
    </section>
  );
}
