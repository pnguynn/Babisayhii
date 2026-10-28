
/**
 * @file audioPlayer.ts
 * @description Quản lý nhạc nền cho website sinh nhật.
 * Chỉ phát file nhạc MP3 do người dùng cung cấp.
 * Không tạo nhạc dự phòng bằng Web Audio API.
 */

import { websiteConfig } from '../config/websiteConfig';

class RomanticAudioController {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying = false;
  private isMuted = false;
  private subscribers: Set<(playing: boolean) => void> = new Set();

  constructor() {
    // Không tự phát khi tải trang vì trình duyệt có thể chặn autoplay.
    // Nhạc sẽ bắt đầu khi người dùng bấm nút phát hoặc nút vào kỷ niệm.
  }

  public subscribe(callback: (playing: boolean) => void): () => void {
    this.subscribers.add(callback);
    callback(this.isPlaying);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach((callback) => callback(this.isPlaying));
  }

  private createAudio(): HTMLAudioElement {
    const audio = new Audio(websiteConfig.audio.musicUrl);

    audio.loop = websiteConfig.audio.loop;
    audio.volume = this.isMuted
      ? 0
      : websiteConfig.audio.defaultVolume;
    audio.preload = 'auto';

    audio.addEventListener('ended', () => {
      if (!audio.loop) {
        this.isPlaying = false;
        this.notify();
      }
    });

    audio.addEventListener('error', () => {
      this.isPlaying = false;
      this.notify();

      console.error(
        'Không tải được file nhạc MP3:',
        websiteConfig.audio.musicUrl,
        audio.error
      );
    });

    return audio;
  }

  /**
   * Phát đúng file MP3 được cấu hình trong websiteConfig.
   * Nếu file lỗi hoặc trình duyệt chặn phát nhạc, không phát nhạc khác.
   */
  public async play(): Promise<void> {
    if (this.isPlaying) return;

    if (!this.audioElement) {
      this.audioElement = this.createAudio();
    }

    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notify();
    } catch (error) {
      this.isPlaying = false;
      this.notify();

      console.error(
        'Không thể phát file nhạc MP3. Hãy kiểm tra đường dẫn hoặc quyền phát nhạc của trình duyệt.',
        error
      );
    }
  }

  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }

    this.isPlaying = false;
    this.notify();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      void this.play();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public fadeOut(durationMs: number = 1500): void {
    if (!this.audioElement || !this.isPlaying) return;

    const audio = this.audioElement;
    const startingVolume = audio.volume;
    const steps = 20;
    const intervalMs = durationMs / steps;
    let currentStep = 0;

    const timer = window.setInterval(() => {
      currentStep++;

      if (currentStep >= steps) {
        window.clearInterval(timer);
        audio.volume = 0;
        this.pause();

        // Khôi phục âm lượng cho lần phát tiếp theo.
        audio.volume = this.isMuted
          ? 0
          : websiteConfig.audio.defaultVolume;

        return;
      }

      audio.volume = Math.max(
        0,
        startingVolume * (1 - currentStep / steps)
      );
    }, intervalMs);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;

    if (this.audioElement) {
      this.audioElement.volume = muted
        ? 0
        : websiteConfig.audio.defaultVolume;
    }
  }

  public cleanup(): void {
    this.pause();

    if (this.audioElement) {
      this.audioElement.removeAttribute('src');
      this.audioElement.load();
      this.audioElement = null;
    }
  }
}

export const audioController = new RomanticAudioController();
