/**
 * Token storage via sessionStorage (MVP).
 *
 * TECH DEBT: migrate to httpOnly cookie + refresh token before production scale.
 * sessionStorage reduces XSS persistence vs localStorage (cleared on tab close)
 * but remains readable by any script on the page.
 */

const TOKEN_KEY = "mei_finance_token";
const USER_KEY = "mei_finance_user";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
};

export const authStorage = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  getUser(): StoredUser | null {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as StoredUser) : null;
    } catch {
      return null;
    }
  },

  setUser(user: StoredUser): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    sessionStorage.removeItem(USER_KEY);
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
  },
};
