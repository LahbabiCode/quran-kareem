
import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly SURAH_FAVORITES_KEY = 'quranApp_surahFavorites_v2';
  private readonly AYAH_FAVORITES_KEY = 'quranApp_ayahFavorites_v2';

  // Store as Map<id, timestamp>
  favoriteAyahs = signal<Map<string, number>>(new Map());
  favoriteSurahs = signal<Map<number, number>>(new Map());

  constructor() {
    this.loadFavoritesFromStorage();
    // Persist to localStorage whenever favorites change
    effect(() => {
      localStorage.setItem(this.SURAH_FAVORITES_KEY, JSON.stringify(Array.from(this.favoriteSurahs().entries())));
      localStorage.setItem(this.AYAH_FAVORITES_KEY, JSON.stringify(Array.from(this.favoriteAyahs().entries())));
    });
  }

  private loadFavoritesFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedSurahs = localStorage.getItem(this.SURAH_FAVORITES_KEY);
        if (storedSurahs) {
          const parsedSurahs = JSON.parse(storedSurahs);
          if (Array.isArray(parsedSurahs)) {
            this.favoriteSurahs.set(new Map(parsedSurahs));
          }
        }
        const storedAyahs = localStorage.getItem(this.AYAH_FAVORITES_KEY);
        if (storedAyahs) {
          const parsedAyahs = JSON.parse(storedAyahs);
          if (Array.isArray(parsedAyahs)) {
            this.favoriteAyahs.set(new Map(parsedAyahs));
          }
        }
      }
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
       if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.SURAH_FAVORITES_KEY);
        localStorage.removeItem(this.AYAH_FAVORITES_KEY);
      }
    }
  }

  // --- Surah Methods ---
  toggleSurahFavorite(surahId: number) {
    this.favoriteSurahs.update(currentMap => {
      const newMap = new Map(currentMap);
      if (newMap.has(surahId)) {
        newMap.delete(surahId);
      } else {
        newMap.set(surahId, Date.now());
      }
      return newMap;
    });
  }

  isSurahFavorite(surahId: number) {
    return computed(() => this.favoriteSurahs().has(surahId));
  }

  // --- Ayah Methods ---
  toggleAyahFavorite(surahId: number, ayahNumberInSurah: number) {
    const key = `${surahId}:${ayahNumberInSurah}`;
    this.favoriteAyahs.update(currentMap => {
      const newMap = new Map(currentMap);
      if (newMap.has(key)) {
        newMap.delete(key);
      } else {
        newMap.set(key, Date.now());
      }
      return newMap;
    });
  }

  isAyahFavorite(surahId: number, ayahNumberInSurah: number) {
    const key = `${surahId}:${ayahNumberInSurah}`;
    return computed(() => this.favoriteAyahs().has(key));
  }
}
