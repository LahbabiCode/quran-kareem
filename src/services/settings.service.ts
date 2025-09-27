import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly TRANSLATION_KEY = 'quranApp_translationId_v1';
  
  // Default to "The Clear Quran" (English)
  selectedTranslationId = signal<number>(131); 

  constructor() {
    this.loadSettingsFromStorage();
    effect(() => {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.TRANSLATION_KEY, this.selectedTranslationId().toString());
        }
      } catch (e) {
        console.error('Error saving settings to localStorage', e);
      }
    });
  }

  private loadSettingsFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedId = localStorage.getItem(this.TRANSLATION_KEY);
        if (storedId) {
          const id = parseInt(storedId, 10);
          if (!isNaN(id)) {
            this.selectedTranslationId.set(id);
          }
        }
      }
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
  }

  setTranslation(translationId: number) {
    this.selectedTranslationId.set(translationId);
  }
}
