import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

interface RecoveryRequest {
  code: string;
  email: string;
  expiresAt: number;
  token: string;
}

const RECOVERY_KEY = 'movune:recuperacao-senha';
const RECOVERY_DURATION = 15 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class PasswordRecoveryService {
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  create(emailValue: string): RecoveryRequest {
    const request: RecoveryRequest = {
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      email: emailValue.trim().toLowerCase(),
      expiresAt: Date.now() + RECOVERY_DURATION,
      token: this.createToken(),
    };

    if (this.isBrowser && globalThis.localStorage) {
      globalThis.localStorage.setItem(RECOVERY_KEY, JSON.stringify(request));
    }

    return request;
  }

  validate(token: string, code: string): RecoveryRequest | null {
    const request = this.read();

    if (!request || request.expiresAt < Date.now()) {
      this.clear();
      return null;
    }

    return request.token === token && request.code === code ? request : null;
  }

  clear(): void {
    if (this.isBrowser && globalThis.localStorage) {
      globalThis.localStorage.removeItem(RECOVERY_KEY);
    }
  }

  private read(): RecoveryRequest | null {
    if (!this.isBrowser) {
      return null;
    }

    const value = globalThis.localStorage?.getItem(RECOVERY_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as RecoveryRequest;
    } catch {
      return null;
    }
  }

  private createToken(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
