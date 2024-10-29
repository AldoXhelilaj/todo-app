import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Method to check if the current platform is a browser
  getIsBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Method to safely access window.location
  getLocationOrigin(): string | null {
    if (this.getIsBrowser()) {
      return window.location.origin; // Safe to access window
    }
    return null; // Return null or a default value for SSR
  }
}