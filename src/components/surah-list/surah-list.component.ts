import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QuranApiService } from '../../services/quran-api.service';
import { LanguageService } from '../../services/language.service';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { Surah } from '../../models/quran.models';
import { switchMap } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { StarIconComponent } from '../icons/star-icon.component';
import { StarSolidIconComponent } from '../icons/star-solid-icon.component';
import { MetaService } from '../../services/meta.service';


@Component({
  selector: 'app-surah-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, StarIconComponent, StarSolidIconComponent],
  templateUrl: './surah-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurahListComponent {
  private quranApiService = inject(QuranApiService);
  private favoritesService = inject(FavoritesService);
  languageService = inject(LanguageService);
  private metaService = inject(MetaService);
  t = this.languageService.translate.bind(this.languageService);

  surahs = toSignal(
      toObservable(this.languageService.language).pipe(
          // FIX: Explicitly type the 'lang' parameter to resolve type inference issues.
          switchMap((lang: 'ar' | 'en') => this.quranApiService.getSurahs(lang))
      ), { initialValue: [] }
  );

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('All Surahs')(),
        description: this.t('Explore all 114 chapters')() + ' of the Holy Quran.',
        imageUrl: `https://picsum.photos/seed/all-surahs/1200/630`
      });
    });
  }

  getRevelationType(surah: Surah): string {
    if (!surah.revelationType) {
      return '';
    }
    const type = surah.revelationType.toLowerCase();
    if (this.languageService.language() === 'ar') {
        return type === 'meccan' ? this.t('Meccan')() : this.t('Medinan')();
    }
    return surah.revelationType;
  }
  
  isFavorite(surahId: number) {
    return this.favoritesService.isSurahFavorite(surahId);
  }

  toggleFavorite(surahId: number) {
    this.favoritesService.toggleSurahFavorite(surahId);
  }
}