
import { useState } from 'react';
import './PolaroidCard.css';

type PolaroidCardProps = {
  image: string;
  date?: string;
  message: string;
  alt?: string;
};

export default function PolaroidCard({
  image,
  date = '2026.10.25 ✨',
  message,
  alt = 'Ảnh kỷ niệm',
}: PolaroidCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`polaroid-card ${flipped ? 'is-flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
      aria-label="Lật thẻ ảnh kỷ niệm"
    >
      <span className="card-inner">
        <span className="card-front">
          <img src={image} alt={alt} />
          <span className="polaroid-date">{date}</span>
        </span>

        <span className="card-back">
          <span>{message}</span>
        </span>
      </span>
    </button>
  );
}
