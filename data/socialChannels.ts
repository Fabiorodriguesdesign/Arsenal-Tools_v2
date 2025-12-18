
export interface SocialChannel {
  id: number;
  name: string;
  handle: string;
  avatarUrl: string;
  url: string;
  category: string;
}

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 1,
    name: 'Leonzinho de Judá',
    handle: '@leonzinhodejuda',
    avatarUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/youtube/lenonzinhodejuda.png?raw=true',
    url: 'https://www.youtube.com/@leonzinhodejuda',
    category: 'Kids & Fé'
  },
  {
    id: 2,
    name: 'Fabio Rodrigues Design',
    handle: '@fabiorodriguesdesign',
    avatarUrl: 'https://i.imgur.com/MaoShGg.jpeg',
    url: 'https://www.youtube.com/@fabiorodriguesdesign',
    category: 'Design & UI'
  },
  {
    id: 3,
    name: 'Hawk Games',
    handle: '@Hawkgames2',
    avatarUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/youtube/hawk-games.jpg?raw=true',
    url: 'https://www.youtube.com/@Hawkgames2',
    category: 'Games'
  },
  {
    id: 4,
    name: 'Hooney Quiz',
    handle: '@HooneyQuiz',
    avatarUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/youtube/hooney-quiz.jpg?raw=true',
    url: 'https://www.youtube.com/@HooneyQuiz',
    category: 'Quiz & Diversão'
  },
  {
    id: 5,
    name: 'Fabio Rodrigues MKT',
    handle: '@fabiorodriguesmkt',
    avatarUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/youtube/fabiorodriguesmkt.png?raw=true',
    url: 'https://www.youtube.com/@fabiorodriguesmkt',
    category: 'Marketing Digital'
  },
  {
    id: 6,
    name: 'Hawk Motivação',
    handle: '@hawkmotivacao',
    avatarUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/youtube/hawk-motiva%C3%A7%C3%A3o.jpg?raw=true',
    url: 'https://www.youtube.com/@hawkmotivacao',
    category: 'Motivação'
  },
  {
    id: 7,
    name: 'Reign of Angels',
    handle: '@reignofangels',
    avatarUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/youtube/reign-of-angels.jpg?raw=true',
    url: 'https://www.youtube.com/@reignofangels',
    category: 'Música'
  },
  {
    id: 8,
    name: 'I Love Jesus Forever',
    handle: '@ilovejesusforever',
    avatarUrl: 'https://github.com/Fabiorodriguesdesign/IMG_for_all_apps/blob/main/youtube/i-love-jesus-forever.jpg?raw=true',
    url: 'https://www.youtube.com/@ilovejesusforever',
    category: 'Fé & Espiritualidade'
  }
];
