export interface User {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  avatar: string | null;
  bio?: string;
  role: 'user' | 'moderator' | 'admin';
  createdAt: Date;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginData {
  login: string; // email ou username
  password: string;
}

export interface UpdateProfileData {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
