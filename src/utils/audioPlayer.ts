/**
 * @file audioPlayer.ts
 * @description Quản lý âm thanh phát nhạc nền cho ứng dụng.
 * Hỗ trợ HTML5 Audio với cơ chế dự phòng Web Audio API Synthesis tự động,
 * đảm bảo nếu link nhạc ngoài bị lỗi hoặc offline thì website vẫn có giai điệu piano/hộp nhạc lãng mạn.
 */

import { websiteConfig } from '../config/websiteConfig';

class RomanticAudioController {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private audioContext: AudioContext | null = null;
  private synthIntervalId: number | null = null;
  private isUsingSynthFallback: boolean = false;
  private subscribers: Set<(playing: boolean) => void> = new Set();

 constructor() {
  // Thử tự phát nhạc khi website được mở
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      this.play();
    });
  }
}

  public subscribe(callback: (playing: boolean) => void): () => void {
    this.subscribers.add(callback);
    callback(this.isPlaying);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify() {
    this.subscribers.forEach((cb) => cb(this.isPlaying));
  }

  /**
   * Khởi chạy nhạc từ cử chỉ click/touch của người dùng
   */
  public async play(): Promise<void> {
    if (this.isPlaying) return;

    try {
      if (!this.audioElement) {
        this.audioElement = new Audio(websiteConfig.audio.musicUrl);
        this.audioElement.loop = websiteConfig.audio.loop;
        this.audioElement.volume = websiteConfig.audio.defaultVolume;
        if (websiteConfig.audio.musicUrl.startsWith('http')) {
          this.audioElement.crossOrigin = 'anonymous';
        }

        this.audioElement.addEventListener('error', () => {
          console.warn('Lỗi tải file nhạc chính, chuyển sang bộ tổng hợp giai điệu Web Audio lãng mạn.');
          this.startSynthFallback();
        });
      }

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.isPlaying = true;
        this.notify();
      }
    } catch {
      console.warn('Autoplay hoặc lỗi mạng với file mp3, chuyển sang Web Audio Synth lãng mạn.');
      this.startSynthFallback();
    }
  }

  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.synthIntervalId) {
      window.clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.isUsingSynthFallback) {
        this.startSynthFallback();
      } else {
        this.play();
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Giảm dần âm lượng (dùng khi vào màn hình đen / kết thúc)
   */
  public fadeOut(durationMs: number = 1500): void {
    if (this.audioElement && this.isPlaying) {
      const step = 0.05;
      const interval = durationMs / (this.audioElement.volume / step || 1);
      const timer = setInterval(() => {
        if (!this.audioElement) {
          clearInterval(timer);
          return;
        }
        if (this.audioElement.volume > step) {
          this.audioElement.volume = Math.max(0, this.audioElement.volume - step);
        } else {
          this.audioElement.volume = 0;
          this.pause();
          clearInterval(timer);
        }
      }, interval);
    }
  }

  /**
   * Bộ tạo âm thanh piano / music box lãng mạn bằng Web Audio API
   * Dự phòng khi thiết bị offline hoặc link nhạc bên ngoài bị chặn
   */
  private startSynthFallback(): void {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioContext) {
        this.audioContext = new AudioCtxClass();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.isUsingSynthFallback = true;
      this.isPlaying = true;
      this.notify();

      // Hợp âm rải lãng mạn (F major, C major, D minor, Bb major)
      const notes = [
        349.23, 440.0, 523.25, 659.25, // F4, A4, C5, E5
        261.63, 329.63, 392.0, 523.25, // C4, E4, G4, C5
        293.66, 349.23, 440.0, 587.33, // D4, F4, A4, D5
        233.08, 293.66, 349.23, 466.16  // Bb3, D4, F4, Bb4
      ];

      let noteIndex = 0;
      if (this.synthIntervalId) window.clearInterval(this.synthIntervalId);

      const playNextNote = () => {
        if (!this.audioContext || !this.isPlaying) return;

        const freq = notes[noteIndex % notes.length];
        noteIndex++;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Âm sắc ấm áp như đàn celesta/piano
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, this.audioContext.currentTime);

        const now = this.audioContext.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(now);
        osc.stop(now + 1.25);
      };

      playNextNote();
      this.synthIntervalId = window.setInterval(playNextNote, 600);
    } catch (err) {
      console.warn('Không thể khởi tạo Web Audio synth:', err);
    }
  }

  public cleanup(): void {
    this.pause();
    if (this.audioElement) {
      this.audioElement.src = '';
      this.audioElement = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const audioController = new RomanticAudioController();
