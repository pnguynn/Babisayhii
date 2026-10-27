
import './PhotoMemoryIntro.css';

type PhotoMemoryIntroProps = {
  onOpenLetter: () => void;
};

const photos = [
  'p22.jpg',
  'p23.jpg',
  'p25.jpg',
  'p26.jpg',
  'p27.jpg',
  'p28.jpg',
];

export default function PhotoMemoryIntro({
  onOpenLetter,
}: PhotoMemoryIntroProps) {
  return (
    <main className="memory-intro">
      <div className="memory-glow" />

      <div className="fairy-string string-one">
        {photos.slice(0, 3).map((photo, index) => (
          <div className={`memory-photo photo-${index + 1}`} key={photo}>
            <span className="wooden-clip" />
            <img
              src={`${import.meta.env.BASE_URL}images/${photo}`}
              alt={`Kỷ niệm ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="fairy-string string-two">
        {photos.slice(3, 6).map((photo, index) => (
          <div className={`memory-photo photo-${index + 4}`} key={photo}>
            <span className="wooden-clip" />
            <img
              src={`${import.meta.env.BASE_URL}images/${photo}`}
              alt={`Kỷ niệm ${index + 4}`}
            />
          </div>
        ))}
      </div>

      <div className="memory-content">
        <div className="little-heart">♡ ✦ ♡</div>

        <h1>
          Gửi em,
          <br />
          người anh thương <span>♡</span>
        </h1>

        <div className="pink-underline" />

        <p>Anh có một điều muốn gửi đến em...</p>

        <button className="open-letter-button" onClick={onOpenLetter}>
          ✉ Bấm vào đây để đọc lá thư 💌
        </button>
      </div>

      <div className="memory-footer">Made with love ♡</div>
    </main>
  );
}
