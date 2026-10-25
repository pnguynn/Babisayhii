/**
 * @file websiteConfig.ts
 * @description File cấu hình trung tâm cho toàn bộ website quà tặng 20/10.
 * Tất cả ảnh, video, nhạc đều được gom vào thư mục /public/ với tên gọi cực ngắn gọn, dễ tìm và dễ thay thế:
 *
 * 📁 public/audio/
 *    └── music.mp3
 * 📁 public/images/
 *    ├── avatar.jpg
 *    ├── final.jpg
 *    └── p1.jpg ... p21.jpg
 * 📁 public/videos/
 *    └── v1.mp4 ... v9.mp4
 */

const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  priority?: number;
}

export interface WebsiteConfig {
  letter: {
    greeting: string;
    body: string[];
    signature: {
      closing: string;
      sender: string;
    };
  };

  mediaItems: MediaItem[];

  audio: {
    songTitle: string;
    musicUrl: string;
    defaultVolume: number;
    loop: boolean;
  };

  finalScene: {
    walkingCharacterImage: string;
    walkingGreetingText: string;
    finalImageUrl: string;
  };

  intro: {
    title: string;
    initialButtonText: string;
    firstConfirmText: string;
    secondConfirmQuestion: string;
    buttonYesText: string;
    buttonNoText: string;
    noTeaseMessage: string;
    readDoneButtonText: string;
  };

  animation: {
    petalCount: number;
    petalSpeed: number;
    bloomingFlowersCount: number;
    maxConcurrentFloatingMedia: number;
    typewriterSpeedMs: number;
  };

  colors: {
    pastelPink: string;
    powderPink: string;
    creamBackground: string;
    ivoryPaper: string;
    deepRoseText: string;
  };
}

export const websiteConfig: WebsiteConfig = {
  // =========================================================================
  // 1. LÁ THƯ TÌNH CẢM Happy birthday Babisayhii (3 PHẦN ĐỘC LẬP)
  // =========================================================================
  letter: {
    greeting: "Gửi đến cục dànggg của anhh,",
    body: [
      "Hello cục dàng nhaa — Hôm nay là 1 ngày vui của em nên anh muốn gửi đến em đôi lời",
      "Đầu tiên là anh muốn chúc mừng sinh nhật cục dànggg của anh nè, chúc em ngày càng xinh đẹp hơn, học giỏi hơn, thành công trên con đường mà em đã chọn và mãi mãi hạnh phúc nhaaa❤️.",
      "Và điều tiếp theo là đây là món quà trên bề mặt tinh thần vì mình đang yêu xa nên anh chỉ tặng bánh sinh nhật và bức thư này của anh thôi à, hy vọng là em sẽ thích và đỡ tủi thân trong ngày trọng đại này nha, vì hôm nay là ngày mà công chúa của anh ra đời á.",
      "Điều cuối cùng là anh sẽ cố gắng để chúng ta bên cạnh nhau sớm nhất có thể, để đươc quan tâm và chăm sóc em. Thời gian này không có anh ở bên cạnh nên tất cả mọi thứ em đều phải làm một mình. Vợ iuu của anh là giỏi nhất luôn❤️. Chúc cục dànggg của anh có một ngày sinh nhật thật là hạnh phúc và trọn vẹn nha. Mong là chúng ta sẽ gặp lại nhau sớm.",
      "À còn nữa, vì đây là món quà tinh thần anh chỉ làm tay cho em thôi, còn quà sinh nhật của em anh sẽ ship qua sau nhennn."
    ],
    signature: {
      closing: "Mãi thương em,",
      sender: "Anh sẽ luôn yêu thương em những gì mà anh có và sẽ luôn dành cho em những điều dịu dàng nhất🌻"
    }
  },

  // =========================================================================
  // 2. DANH SÁCH 21 ẢNH & 9 VIDEO XEN KẼ NGẪU NHIÊN TRONG THƯ MỤC /public/
  // =========================================================================
  mediaItems: [
    { id: 'photo-1', type: 'image', url: asset('images/p1.jpg') },
    { id: 'photo-2', type: 'image', url: asset('images/p2.jpg') },
    { id: 'video-1', type: 'video', url: asset('videos/v1.mp4'), thumbnail: asset('images/p1.jpg') },

    { id: 'photo-3', type: 'image', url: asset('images/p3.jpg') },
    { id: 'photo-4', type: 'image', url: asset('images/p4.jpg') },
    { id: 'video-2', type: 'video', url: asset('videos/v2.mp4'), thumbnail: asset('images/p2.jpg') },

    { id: 'photo-5', type: 'image', url: asset('images/p5.jpg') },
    { id: 'photo-6', type: 'image', url: asset('images/p6.jpg') },
    { id: 'video-3', type: 'video', url: asset('videos/v3.mp4'), thumbnail: asset('images/p3.jpg') },

    { id: 'photo-7', type: 'image', url: asset('images/p7.jpg') },
    { id: 'photo-8', type: 'image', url: asset('images/p8.jpg') },
    { id: 'video-4', type: 'video', url: asset('videos/v4.mp4'), thumbnail: asset('images/p4.jpg') },

    { id: 'photo-9', type: 'image', url: asset('images/p9.jpg') },
    { id: 'photo-10', type: 'image', url: asset('images/p10.jpg') },
    { id: 'video-5', type: 'video', url: asset('videos/v5.mp4'), thumbnail: asset('images/p5.jpg') },

    { id: 'photo-11', type: 'image', url: asset('images/p11.jpg') },
    { id: 'photo-12', type: 'image', url: asset('images/p12.jpg') },
    { id: 'video-6', type: 'video', url: asset('videos/v6.mp4'), thumbnail: asset('images/p6.jpg') },

    { id: 'photo-13', type: 'image', url: asset('images/p13.jpg') },
    { id: 'photo-14', type: 'image', url: asset('images/p14.jpg') },
    { id: 'video-7', type: 'video', url: asset('videos/v7.mp4'), thumbnail: asset('images/p7.jpg') },

    { id: 'photo-15', type: 'image', url: asset('images/p15.jpg') },
    { id: 'photo-16', type: 'image', url: asset('images/p16.jpg') },
    { id: 'video-8', type: 'video', url: asset('videos/v8.mp4'), thumbnail: asset('images/p8.jpg') },

    { id: 'photo-17', type: 'image', url: asset('images/p17.jpg') },
    { id: 'photo-18', type: 'image', url: asset('images/p18.jpg') },
    { id: 'video-9', type: 'video', url: asset('videos/v9.mp4'), thumbnail: asset('images/p9.jpg') },

    { id: 'photo-19', type: 'image', url: asset('images/p19.jpg') },
    { id: 'photo-20', type: 'image', url: asset('images/p20.jpg') },
    { id: 'photo-21', type: 'image', url: asset('images/p21.jpg') }
  ],

  // =========================================================================
  // 3. NHẠC NỀN (NƠI NÀY CÓ ANH)
  // =========================================================================
  audio: {
    songTitle: 'Em',
    musicUrl: asset('audio/music.mp3'),
    defaultVolume: 0.65,
    loop: true
  },

  // =========================================================================
  // 4. ẢNH BƯỚC ĐI & ẢNH CUỐI CÙNG
  // =========================================================================
  finalScene: {
    walkingCharacterImage: asset('images/avatar.jpg'),
    walkingGreetingText: 'Thươngggg💐',
    finalImageUrl: asset('images/final.jpg')
  },

  // =========================================================================
  // 5. NỘI DUNG MÀN HÌNH MỞ ĐẦU
  // =========================================================================
  intro: {
    title: 'Gửi Em Một Món Quà Nhỏ',
    initialButtonText: 'Bấm để đọc',
    firstConfirmText: 'Em có chắc muốn đọc không?',
    secondConfirmQuestion: 'Em suy nghĩ kĩ chưa?',
    buttonYesText: 'Rồi',
    buttonNoText: 'Chưa',
    noTeaseMessage: 'Thôi đừng dối lòng, đọc lời yêu thương anh gửi gắm nha.',
    readDoneButtonText: 'Em đã đọc xong rồi'
  },

  // =========================================================================
  // 6. THÔNG SỐ HIỆU ỨNG
  // =========================================================================
  animation: {
    petalCount: 22,
    petalSpeed: 0.55,
    bloomingFlowersCount: 6,
    maxConcurrentFloatingMedia: 30,
    typewriterSpeedMs: 35
  },

  colors: {
    pastelPink: '#F8C8DC',
    powderPink: '#F4AFC4',
    creamBackground: '#FFF6F0',
    ivoryPaper: '#FFFCFA',
    deepRoseText: '#704858'
  }
};
