

import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { QuranApiService } from '../../services/quran-api.service';
import { LanguageService } from '../../services/language.service';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { Mp3QuranReciter } from '../../models/quran.models';
import { switchMap } from 'rxjs';
import { SearchIconComponent } from '../icons/search-icon.component';
import { MetaService } from '../../services/meta.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reciter-list',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, SearchIconComponent, RouterLink],
  templateUrl: './reciter-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReciterListComponent {
  quranApiService = inject(QuranApiService);
  languageService = inject(LanguageService);
  private metaService = inject(MetaService);
  t = this.languageService.translate.bind(this.languageService);

  searchTerm = signal('');

  reciters = toSignal(
    toObservable(this.languageService.language).pipe(
      switchMap((lang: 'ar' | 'en') => this.quranApiService.getMp3QuranReciters(lang))
    ),
    { initialValue: [] as Mp3QuranReciter[] }
  );

  filteredReciters = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    // FIX: Explicitly cast `reciters()` to `Mp3QuranReciter[]` to ensure type safety.
    let recs = this.reciters() as Mp3QuranReciter[];

    if (!Array.isArray(recs)) return [];

    if (!term) {
      return recs;
    }

    return recs.filter(reciter =>
      reciter.name?.toLowerCase().includes(term) ||
      reciter.rewaya?.toLowerCase().includes(term)
    );
  });

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('All Reciters')(),
        description: this.t('Choose from renowned reciters')() + ' and listen to their Quran recitations.',
        imageUrl: `https://picsum.photos/seed/all-reciters/1200/630`
      });
    });
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
  }
}