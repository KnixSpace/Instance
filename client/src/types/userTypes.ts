export interface User {
  userId: string;
  googleId: string;
  username: string;
  avatar: string;
}

export interface UserState {
  data: User | null;
  isLoggedIn: boolean;
}
