import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private readonly AYAH_BOOKMARKS_KEY = 'quranApp_ayahBookmarks_v2';

  bookmarkedAyahs = signal<Map<string, number>>(new Map());

  constructor() {
    this.loadBookmarksFromStorage();
    // Persist to localStorage whenever bookmarks change
    effect(() => {
      localStorage.setItem(this.AYAH_BOOKMARKS_KEY, JSON.stringify(Array.from(this.bookmarkedAyahs().entries())));
    });
  }

  private loadBookmarksFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedAyahs = localStorage.getItem(this.AYAH_BOOKMARKS_KEY);
        if (storedAyahs) {
          const parsedData = JSON.parse(storedAyahs);
          // Validate that the parsed data is an array of [key, timestamp] pairs to prevent loading corrupted/legacy data
          if (
            Array.isArray(parsedData) &&
            parsedData.every(
              (item) => Array.isArray(item) && item.length === 2 && typeof item[0] === 'string' && typeof item[1] === 'number'
            )
          ) {
            this.bookmarkedAyahs.set(new Map(parsedData));
          } else {
            console.warn('Invalid bookmark data format found in localStorage. Clearing bookmarks.');
            localStorage.removeItem(this.AYAH_BOOKMARKS_KEY);
            this.bookmarkedAyahs.set(new Map()); // Reset to empty map
          }
        }
      }
    } catch (e) {
      console.error('Error parsing bookmarks from localStorage', e);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.AYAH_BOOKMARKS_KEY);
      }
      this.bookmarkedAyahs.set(new Map()); // Reset to empty map on error
    }
  }

  toggleAyahBookmark(surahId: number, ayahNumberInSurah: number) {
    const key = `${surahId}:${ayahNumberInSurah}`;
    this.bookmarkedAyahs.update(currentMap => {
      const newMap = new Map(currentMap);
      if (newMap.has(key)) {
        newMap.delete(key);
      } else {
        // Store the current timestamp when bookmarking an ayah
        newMap.set(key, Date.now());
      }
      return newMap;
    });
  }

  isAyahBookmarked(surahId: number, ayahNumberInSurah: number) {
    const key = `${surahId}:${ayahNumberInSurah}`;
    return computed(() => this.bookmarkedAyahs().has(key));
  }
}
