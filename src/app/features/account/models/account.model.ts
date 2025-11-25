export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    newReleases: boolean;
    recommendations: boolean;
  };
  privacy: {
    showProfile: boolean;
    showWatchlist: boolean;
    showFavorites: boolean;
  };
}

export interface UserStats {
  moviesWatched: number;
  seriesWatched: number;
  totalWatchTime: number;
  favoritesCount: number;
  watchlistCount: number;
  reviewsCount: number;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  mediaType: 'movie' | 'series';
  mediaId: number;
  title: string;
  posterPath?: string;
  rating?: number;
  addedAt: Date;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaType: 'movie' | 'series';
  mediaId: number;
  title: string;
  posterPath?: string;
  priority: 'low' | 'medium' | 'high';
  addedAt: Date;
  notes?: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  mediaType?: 'movie' | 'series';
  mediaId?: number;
  mediaTitle?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  senderAvatar?: string;
  receiverId?: string;
  roomId?: string;
  content: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
  createdAt: Date;
}

export interface ChatRoom {
  id: string;
  name?: string;
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
}
