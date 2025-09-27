import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { combineLatest, forkJoin, of } from 'rxjs';

import { BookmarkService } from '../../services/bookmark.service';
import { QuranApiService } from '../../services/quran-api.service';
import { LanguageService } from '../../services/language.service';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { BookmarkSolidIconComponent } from '../icons/bookmark-solid-icon.component';
import { Ayah, Surah } from '../../models/quran.models';
import { SearchIconComponent } from '../icons/search-icon.component';
import { BookmarkIconComponent } from '../icons/bookmark-icon.component';
import { MetaService } from '../../services/meta.service';
import { SettingsService } from '../../services/settings.service';

type AyahSortOrder = 'number' | 'date';
type DetailedBookmarkedAyah = Partial<Ayah> & { surahId: number; surahName: string; added: number };

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, BookmarkSolidIconComponent, SearchIconComponent, BookmarkIconComponent],
  templateUrl: './bookmarks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksComponent {
  private bookmarkService = inject(BookmarkService);
  private quranApiService = inject(QuranApiService);
  private metaService = inject(MetaService);
  private settingsService = inject(SettingsService);
  languageService = inject(LanguageService);
  t = this.languageService.translate.bind(this.languageService);

  // --- Search and Sorting State ---
  searchTerm = signal('');
  ayahSortOrder = signal<AyahSortOrder>('number');

  // --- Data Fetching & Processing ---
  private allSurahs = toSignal(
    toObservable(this.languageService.language).pipe(
      switchMap((lang: 'ar' | 'en') => this.quranApiService.getSurahs(lang))
    ),
    { initialValue: [] as Surah[] }
  );
  
  detailedBookmarkedAyahs = toSignal(
    combineLatest({
      bookmarkedAyahMap: toObservable(this.bookmarkService.bookmarkedAyahs),
      allSurahs: toObservable(this.allSurahs),
      translationId: toObservable(this.settingsService.selectedTranslationId)
    }).pipe(
      switchMap(({ bookmarkedAyahMap, allSurahs, translationId }) => {
        if (bookmarkedAyahMap.size === 0 || allSurahs.length === 0) {
          return of([]);
        }

        const surahMap = new Map<number, Surah>(allSurahs.map(s => [s.id, s]));
        
        const ayahsBySurah = new Map<number, Set<number>>();
        bookmarkedAyahMap.forEach((_, key) => {
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
          map((surahDetailsArray: Partial<Ayah>[][]) => {
            const bookmarkedAyahDetails: DetailedBookmarkedAyah[] = [];
            
            surahDetailsArray.forEach((ayahs, index) => {
              const surahId = surahIds[index];
              const surahInfo = surahMap.get(surahId);
              if (!surahInfo) return;

              const bookmarkedAyahNumbers = ayahsBySurah.get(surahId)!;
              
              ayahs.forEach(ayah => {
                if (ayah.numberInSurah && bookmarkedAyahNumbers.has(ayah.numberInSurah)) {
                  const key = `${surahId}:${ayah.numberInSurah}`;
                  bookmarkedAyahDetails.push({
                    ...ayah,
                    surahId: surahId,
                    surahName: surahInfo.name,
                    added: bookmarkedAyahMap.get(key) || 0,
                  });
                }
              });
            });
            return bookmarkedAyahDetails;
          })
        );
      })
    ), 
    { initialValue: [] as DetailedBookmarkedAyah[] }
  );

  private filteredBookmarkedAyahs = computed(() => {
    // FIX: Explicitly cast the signal's value to its expected array type to prevent runtime errors when calling .filter().
    const ayahs = this.detailedBookmarkedAyahs() as DetailedBookmarkedAyah[];
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

  sortedBookmarkedAyahs = computed(() => {
    const filtered = this.filteredBookmarkedAyahs();
    const order = this.ayahSortOrder();
    const sorted = [...filtered];

    if (order === 'date') {
      // Sort by timestamp descending (newest first)
      sorted.sort((a, b) => b.added - a.added);
    } else {
      // Default: 'number'. Sort first by Surah ID, then by Ayah number within the Surah.
      sorted.sort((a, b) => {
        const surahCompare = a.surahId - b.surahId;
        if (surahCompare !== 0) {
          return surahCompare;
        }
        return a.numberInSurah! - b.numberInSurah!;
      });
    }
    return sorted;
  });

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('My Bookmarks')(),
        description: 'Return to your bookmarked Ayahs in the Holy Quran.',
      });
    });
  }

  // --- Event Handlers ---

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
  }

  setAyahSortOrder(event: Event) {
    const order = (event.target as HTMLSelectElement).value;
    this.ayahSortOrder.set(order as AyahSortOrder);
  }
  
  unbookmarkAyah(surahId: number, ayahNumber: number) {
    this.bookmarkService.toggleAyahBookmark(surahId, ayahNumber);
  }
}
