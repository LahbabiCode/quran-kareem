import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { combineLatest, forkJoin, of } from 'rxjs';

import { FavoritesService } from '../../services/favorites.service';
import { QuranApiService } from '../../services/quran-api.service';
import { LanguageService } from '../../services/language.service';
import { StarSolidIconComponent } from '../icons/star-solid-icon.component';
import { Ayah, Surah } from '../../models/quran.models';
import { SearchIconComponent } from '../icons/search-icon.component';
import { MetaService } from '../../services/meta.service';
import { SettingsService } from '../../services/settings.service';

type SurahSortOrder = 'number' | 'name' | 'date';
type AyahSortOrder = 'number' | 'date';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, StarSolidIconComponent, SearchIconComponent],
  templateUrl: './favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  private quranApiService = inject(QuranApiService);
  private metaService = inject(MetaService);
  private settingsService = inject(SettingsService);
  languageService = inject(LanguageService);
  t = this.languageService.translate.bind(this.languageService);

  // --- Search and Sorting State ---
  searchTerm = signal('');
  surahSortOrder = signal<SurahSortOrder>('number');
  ayahSortOrder = signal<AyahSortOrder>('number');

  // --- Data Fetching & Processing ---
  private allSurahs = toSignal(
    toObservable(this.languageService.language).pipe(
      switchMap((lang: 'ar' | 'en') => this.quranApiService.getSurahs(lang))
    ),
    { initialValue: [] }
  );
  
  private favoriteSurahMap = this.favoritesService.favoriteSurahs;

  favoriteSurahs = computed(() => {
      // FIX: Cast `allSurahs` to `Surah[]` to resolve `unknown` type and allow property access.
      const all = this.allSurahs() as Surah[];
      // FIX: Add a defensive Array.isArray check to prevent crashes if the signal is not yet an array.
      if (!Array.isArray(all)) {
        return [];
      }
      const favMap = this.favoriteSurahMap();
      if (!all.length || !favMap.size) {
        return [];
      }
      return all.filter(surah => favMap.has(surah.id));
  });

  private filteredFavoriteSurahs = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const favSurahs = this.favoriteSurahs();
    if (!term) {
      return favSurahs;
    }
    return favSurahs.filter(surah => 
      surah.name.toLowerCase().includes(term) ||
      surah.englishName.toLowerCase().includes(term) ||
      surah.englishNameTranslation.toLowerCase().includes(term) ||
      surah.arabicName.toLowerCase().includes(term)
    );
  });

  sortedFavoriteSurahs = computed(() => {
    const filtered = this.filteredFavoriteSurahs();
    if (!Array.isArray(filtered)) return [];
    const order = this.surahSortOrder();
    const favMap = this.favoriteSurahMap();
    
    return filtered.slice().sort((a, b) => {
      if (order === 'name') {
        const lang = this.languageService.language() === 'ar' ? 'ar' : 'en-US';
        return a.name.localeCompare(b.name, lang);
      }
      if (order === 'date') {
        return (favMap.get(b.id) ?? 0) - (favMap.get(a.id) ?? 0);
      }
      // Default: 'number'
      return a.id - b.id;
    });
  });

  detailedFavoriteAyahs = toSignal(
    combineLatest([
      toObservable(this.favoritesService.favoriteAyahs),
      toObservable(this.allSurahs),
      toObservable(this.settingsService.selectedTranslationId)
    ]).pipe(
      switchMap(([favAyahMap, allSurahs, translationId]) => {
        if (favAyahMap.size === 0 || allSurahs.length === 0) {
          return of([]);
        }

        const surahMap = new Map<number, Surah>(allSurahs.map(s => [s.id, s]));
        
        const ayahsBySurah = new Map<number, Set<number>>();
        favAyahMap.forEach((_, key) => {
          const [surahId, ayahNum] = key.split(':').map(Number);
          if (!ayahsBySurah.has(surahId)) {
            ayahsBySurah.set(surahId, new Set());
          }
          ayahsBySurah.get(surahId)!.add(ayahNum);
        });

        const surahIds = Array.from(ayahsBySurah.keys());
        if (surahIds.length === 0) {
            return of([]);
        }

        const surahDetailObservables = surahIds.map(id => this.quranApiService.getSurahDetail(id, translationId));
        
        return forkJoin(surahDetailObservables).pipe(
          // FIX: Explicitly type `surahDetailsArray` to resolve `unknown` type from `forkJoin`.
          map((surahDetailsArray: Partial<Ayah>[][]) => {
            const favoriteAyahDetails: (Partial<Ayah> & { surahId: number; surahName: string; added: number })[] = [];
            
            surahDetailsArray.forEach((ayahs, index) => {
              const surahId = surahIds[index];
              const surahInfo = surahMap.get(surahId);
              if (!surahInfo) return;

              const favoriteAyahNumbers = ayahsBySurah.get(surahId)!;
              
              ayahs.forEach(ayah => {
                if (ayah.numberInSurah && favoriteAyahNumbers.has(ayah.numberInSurah)) {
                  const key = `${surahId}:${ayah.numberInSurah}`;
                  favoriteAyahDetails.push({
                    ...ayah,
                    surahId: surahId,
                    surahName: surahInfo.name,
                    added: favAyahMap.get(key) || 0,
                  });
                }
              });
            });
            return favoriteAyahDetails;
          })
        );
      })
    ), 
    { initialValue: [] }
  );

  private filteredFavoriteAyahs = computed(() => {
    // FIX: Explicitly type `ayahs` to resolve `unknown` type and allow usage of `.filter()`.
    const ayahs = this.detailedFavoriteAyahs() as (Partial<Ayah> & { surahId: number; surahName: string; added: number; })[];
    // FIX: Add a defensive Array.isArray check to prevent crashes if the signal is not yet an array.
    if (!Array.isArray(ayahs)) {
        return [];
    }
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) {
      return ayahs;
    }
    return ayahs.filter(ayah =>
      ayah.text?.toLowerCase().includes(term) ||
      ayah.translation?.toLowerCase().includes(term) ||
      ayah.surahName?.toLowerCase().includes(term)
    );
  });

  sortedFavoriteAyahs = computed(() => {
    const filtered = this.filteredFavoriteAyahs();
    if (!Array.isArray(filtered)) return [];
    const order = this.ayahSortOrder();

    if (order === 'date') {
      return filtered.slice().sort((a, b) => b.added - a.added);
    }
    // Default 'number'
    return filtered.slice().sort((a, b) => {
        if (a.surahId !== b.surahId) {
            return a.surahId - b.surahId;
        }
        return a.numberInSurah! - b.numberInSurah!;
    });
  });

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('My Favorites')(),
        description: 'Access your favorite Surahs and Ayahs for quick reading and listening.',
      });
    });
  }

  // --- Event Handlers ---

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
  }

  setSurahSortOrder(event: Event) {
    const order = (event.target as HTMLSelectElement).value;
    this.surahSortOrder.set(order as SurahSortOrder);
  }

  setAyahSortOrder(event: Event) {
    const order = (event.target as HTMLSelectElement).value;
    this.ayahSortOrder.set(order as AyahSortOrder);
  }
  
  unfavoriteSurah(surahId: number) {
    this.favoritesService.toggleSurahFavorite(surahId);
  }

  unfavoriteAyah(surahId: number, ayahNumber: number) {
    this.favoritesService.toggleAyahFavorite(surahId, ayahNumber);
  }
}