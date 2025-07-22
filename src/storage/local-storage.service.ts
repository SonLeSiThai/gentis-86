import { TokenStorage } from './token-storage.interface';

export class LocalStorageService implements TokenStorage {
  setAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  removeAccessToken(): void {
    localStorage.removeItem('access_token');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  removeRefreshToken(): void {
    localStorage.removeItem('refresh_token');
  }
}
