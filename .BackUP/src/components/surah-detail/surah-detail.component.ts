

import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
// FIX: Import ParamMap for type safety with route parameters.
import { ActivatedRoute, ParamMap } from '@angular/router';
import { QuranApiService } from '../../services/quran-api.service';
import { LanguageService } from '../../services/language.service';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { map, switchMap, filter, catchError, finalize, tap } from 'rxjs';
import { of, combineLatest } from 'rxjs';
import { PlayerService } from '../../services/player.service';
import { AudioTrack, Reciter, Surah, Tafsir, TafsirBook, Ayah, Mp3QuranReciter, Translation, Word } from '../../models/quran.models';
import { PlayIconComponent } from '../icons/play-icon.component';
import { PauseIconComponent } from '../icons/pause-icon.component';
import { BookOpenIconComponent } from '../icons/book-open-icon.component';
import { SparkleIconComponent } from '../icons/sparkle-icon.component';
import { ModalComponent } from '../ui/modal.component';
import { GeminiService } from '../../services/gemini.service';
import { FavoritesService } from '../../services/favorites.service';
import { StarIconComponent } from '../icons/star-icon.component';
import { StarSolidIconComponent } from '../icons/star-solid-icon.component';
import { BookmarkService } from '../../services/bookmark.service';
import { BookmarkIconComponent } from '../icons/bookmark-icon.component';
import { BookmarkSolidIconComponent } from '../icons/bookmark-solid-icon.component';
import { SoundWaveIconComponent } from '../icons/sound-wave-icon.component';
import { ChevronDownIconComponent } from '../icons/chevron-down-icon.component';
import { ChevronUpIconComponent } from '../icons/chevron-up-icon.component';
import { ShareIconComponent } from '../icons/share-icon.component';
import { MetaService } from '../../services/meta.service';
import { SettingsService } from '../../services/settings.service';
import { CogIconComponent } from '../icons/cog-icon.component';


@Component({
  selector: 'app-surah-detail',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, PlayIconComponent, PauseIconComponent, BookOpenIconComponent, SparkleIconComponent, ModalComponent, StarIconComponent, StarSolidIconComponent, BookmarkIconComponent, BookmarkSolidIconComponent, SoundWaveIconComponent, ChevronDownIconComponent, ChevronUpIconComponent, ShareIconComponent, CogIconComponent],
  templateUrl: './surah-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurahDetailComponent {
  private route = inject(ActivatedRoute);
  private quranApiService = inject(QuranApiService);
  private geminiService = inject(GeminiService);
  private favoritesService = inject(FavoritesService);
  private bookmarkService = inject(BookmarkService);
  private metaService = inject(MetaService);
  private settingsService = inject(SettingsService);
  languageService = inject(LanguageService);
  playerService = inject(PlayerService);
  t = this.languageService.translate.bind(this.languageService);

  // --- Core State Signals ---
  // FIX: Explicitly type route parameters to avoid 'unknown' type issues.
  surahId = toSignal(this.route.paramMap.pipe(map((params: ParamMap) => Number(params.get('id')))));
  playbackMode = signal<'ayah' | 'surah'>('surah');
  translationView = signal<'arabic' | 'english'>('english');
  isSettingsModalOpen = signal(false);

  // --- Word by Word Feature ---
  isWordByWordEnabled = signal(false);
  activeWord = signal<{ ayahNum: number; wordPos: number } | null>(null);

  // --- Translation Settings ---
  selectedTranslationId = this.settingsService.selectedTranslationId;
  availableTranslations = toSignal(
    this.quranApiService.getTranslations(this.languageService.language()),
    { initialValue: [] as Translation[] }
  );

  // --- Data Fetching Signals ---
  surahInfo = toSignal(
      combineLatest({
        lang: toObservable(this.languageService.language),
        // FIX: Explicitly type route parameters to avoid 'unknown' type issues.
        surahId: this.route.paramMap.pipe(map((params: ParamMap) => Number(params.get('id'))))
      }).pipe(
        filter(({ surahId }) => !isNaN(surahId) && surahId > 0),
        switchMap(({ lang, surahId }) => 
          this.quranApiService.getSurahs(lang).pipe(
            // FIX: Explicitly type `surahs` to resolve `unknown` type from the observable stream.
            map((surahs: Surah[]) => surahs.find(s => s.id === surahId))
          )
        )
      )
  );

  ayahs = toSignal(
    combineLatest({
      surahId: this.route.paramMap.pipe(map((params: ParamMap) => Number(params.get('id')))),
      translationId: toObservable(this.selectedTranslationId)
    }).pipe(
      filter(({ surahId }) => !isNaN(surahId) && surahId > 0),
      switchMap(({ surahId, translationId }) => this.quranApiService.getSurahDetail(surahId, translationId))
    ), { initialValue: [] }
  );
  
  // --- Reciter Signals ---
  private perAyahReciters = toSignal(
    toObservable(this.languageService.language).pipe(
      // FIX: Explicitly type the 'lang' parameter to resolve type inference issues.
      switchMap((lang: 'ar' | 'en') => this.quranApiService.getReciters(lang))
    ),
    { initialValue: [] }
  );

  private fullSurahReciters = toSignal(
      toObservable(this.languageService.language).pipe(
          // FIX: Explicitly type the 'lang' parameter to resolve type inference issues.
          switchMap((lang: 'ar' | 'en') => this.quranApiService.getMp3QuranReciters(lang))
      ), { initialValue: [] }
  );

  recitersForSurahMode = computed(() => {
    const reciters = this.fullSurahReciters() as Mp3QuranReciter[];
    const surahId = this.surahId();
    // FIX: Add a defensive Array.isArray check to prevent crashes if the signal is not yet an array.
    if (!Array.isArray(reciters) || !surahId) {
      return [];
    }
    
    return reciters.map(reciter => {
        const moshaf = reciter.moshaf.find(m => m.surah_list.split(',').includes(String(surahId)));
        // Add a defensive check to ensure the moshaf and its server URL are valid before using them. This prevents audio playback errors from bad API data.
        if (moshaf && typeof moshaf.server === 'string' && moshaf.server.length > 0) {
            return { ...reciter, server: moshaf.server };
        }
        return null;
    }).filter((r): r is Mp3QuranReciter & { server: string } => r !== null);
  });

  // --- Tafsir Signals ---
  tafsirList = toSignal(
    toObservable(this.languageService.language).pipe(
      // FIX: Explicitly type the 'lang' parameter to resolve type inference issues.
      switchMap((lang: 'ar' | 'en') => this.quranApiService.getTafsirList(lang))
    ), { initialValue: [] as TafsirBook[] }
  );
  selectedTafsirId = signal<number | null>(null);
  isTafsirLoading = signal(false);

  selectedTafsir = computed(() => {
    const tafsirId = this.selectedTafsirId();
    if (!tafsirId) return null;
    const tafsirs = this.tafsirList() as TafsirBook[];
    if (!Array.isArray(tafsirs)) return null;
    return tafsirs.find(t => t.id === tafsirId) ?? null;
  });

  surahTafsirs = toSignal(
    combineLatest({
      tafsirId: toObservable(this.selectedTafsirId),
      surahId: toObservable(this.surahId)
    }).pipe(
      // FIX: Explicitly type the combined observable value to resolve type inference issues.
      filter((value: { tafsirId: number | null, surahId: number | undefined }): value is { tafsirId: number; surahId: number } => value.tafsirId !== null && value.surahId !== undefined && value.surahId > 0),
      tap(() => this.isTafsirLoading.set(true)),
      switchMap(({ tafsirId, surahId }) => {
          return this.quranApiService.getTafsirForSurah(tafsirId, surahId).pipe(
              finalize(() => this.isTafsirLoading.set(false)),
              catchError(() => of([] as Tafsir[]))
          );
      })
    ), { initialValue: [] as Tafsir[] }
  );

  tafsirMap = computed(() => {
    const map = new Map<number, string>();
    const tafsirs = this.surahTafsirs() as Tafsir[];
    // FIX: Add a defensive Array.isArray check to prevent crashes if the signal is not yet an array.
    if (!Array.isArray(tafsirs)) {
      return map;
    }
    tafsirs.forEach(tafsir => {
      if (tafsir.verse_key) {
        const ayahNumber = Number(tafsir.verse_key.split(':')[1]);
        map.set(ayahNumber, tafsir.text);
      }
    });
    return map;
  });

  visibleTafsirs = signal<Set<number>>(new Set());

  // --- AI Feature State ---
  isAiModalOpen = signal(false);
  aiExplanation = signal('');
  isAiLoading = signal(false);
  aiError = signal<string | null>(null);
  formattedAiExplanation = computed(() => this.aiExplanation().replace(/\n/g, '<br>'));

  // --- Share/Copy state ---
  copiedAyahKey = signal<string | null>(null);
  copyErrorAyahKey = signal<string | null>(null);

  // --- Player State ---
  currentTrack = this.playerService.currentTrack;
  isPlaying = this.playerService.isPlaying;
  
  // Computed signal for efficient tracking of the currently playing Ayah.
  playingAyahNumberInSurah = computed(() => {
    const track = this.currentTrack();
    if (this.isPlaying() && this.playbackMode() === 'ayah' && track?.surahId === this.surahId()) {
      return track.ayahNumberInSurah ?? null;
    }
    return null;
  });

  // Selected Reciters for each mode
  selectedPerAyahReciter = signal<Reciter | null>(null);
  selectedFullSurahReciter = signal<Mp3QuranReciter & { server: string } | null>(null);

  // --- Auto-selection state ---
  private lastAutoSelectedSurahId = signal<number | undefined>(undefined);

  constructor() {
    effect(() => {
      const currentSurahId = this.surahId();
      const reciters = this.recitersForSurahMode();
      
      // Auto-select the first reciter for the "Full Surah" mode when the page loads or surah changes.
      // FIX: Use a type guard to properly narrow 'currentSurahId' from 'unknown' to 'number', which resolves the error when calling .set() on the next line.
      if (typeof currentSurahId === 'number' && reciters.length > 0 && this.lastAutoSelectedSurahId() !== currentSurahId) {
        this.selectedFullSurahReciter.set(reciters[0]);
        this.lastAutoSelectedSurahId.set(currentSurahId);
      }
    });

    // Effect for auto-scrolling to the currently playing Ayah
    effect(() => {
      const track = this.currentTrack();
      if (this.isPlaying() && track?.surahId === this.surahId() && track?.ayahNumberInSurah) {
        const elementId = `ayah-${track.surahId}-${track.ayahNumberInSurah}`;
        // Use a small timeout to ensure the DOM is updated before trying to scroll
        setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Only scroll if the element is not currently visible in the viewport
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }, 100);
      }
    });

    // Effect for meta tags
    effect(() => {
      const surah = this.surahInfo();
      const lang = this.languageService.language(); // depend on language

      if (surah) {
        const description = lang === 'ar'
          ? `اقرأ واستمع إلى ${surah.name} (${surah.arabicName})، السورة رقم ${surah.id} في القرآن الكريم. تحتوي على ${surah.numberOfAyahs} آية.`
          : `Read and listen to Surah ${surah.englishName} (${surah.name}), chapter ${surah.id} of the Holy Quran. It has ${surah.numberOfAyahs} ayahs.`;
        
        this.metaService.updateTags({
          title: surah.name,
          description: description,
          imageUrl: `https://picsum.photos/seed/surah-${surah.id}/1200/630`,
          type: 'article'
        });
      }
    });
  }

  // --- Methods ---

  setPlaybackMode(mode: 'ayah' | 'surah') {
    this.playbackMode.set(mode);
  }

  setTranslationView(view: 'arabic' | 'english') {
    this.translationView.set(view);
  }

  toggleActiveWord(ayahNum: number, wordPos: number) {
    const current = this.activeWord();
    if (current?.ayahNum === ayahNum && current?.wordPos === wordPos) {
        this.activeWord.set(null);
    } else {
        this.activeWord.set({ ayahNum, wordPos });
    }
  }

  selectReciter(reciterId: string) {
    if (this.playbackMode() === 'ayah') {
      // FIX: Cast `this.perAyahReciters()` to `Reciter[]` to resolve 'unknown' type and allow `.find()`.
      const reciter = (this.perAyahReciters() as Reciter[]).find(r => r.id === reciterId) || null;
      this.selectedPerAyahReciter.set(reciter);
    } else {
      const reciter = this.recitersForSurahMode().find(r => r.id.toString() === reciterId) || null;
      this.selectedFullSurahReciter.set(reciter);
    }
  }

  selectTranslation(event: Event) {
    const translationId = parseInt((event.target as HTMLSelectElement).value, 10);
    if (!isNaN(translationId)) {
      this.settingsService.setTranslation(translationId);
    }
  }

  playSurah() {
    // FIX: Cast surahInfo to resolve 'unknown' type for property access.
    const surah = this.surahInfo() as Surah | undefined;
    if (!surah) return;

    if (this.playbackMode() === 'ayah') {
      const reciter = this.selectedPerAyahReciter();
      // FIX: Cast ayahs to resolve 'unknown' type and allow property access and iteration.
      const currentAyahs = this.ayahs() as Partial<Ayah>[];
      if (!reciter || !currentAyahs || currentAyahs.length === 0) return;
      
      const tracks: AudioTrack[] = currentAyahs.map(ayah => this.createAyahTrack(ayah.numberInSurah!, reciter));
      this.playerService.loadPlaylist(tracks, 0);

    } else {
      const reciter = this.selectedFullSurahReciter();
      if (!reciter) return;
      
      // FIX: Cast surahId to 'number' to resolve 'unknown' type.
      const surahIdFormatted = (this.surahId() as number).toString().padStart(3, '0');
      const track: AudioTrack = {
        title: surah.name,
        subtitle: reciter.name,
        url: `${reciter.server}/${surahIdFormatted}.mp3`
      };
      this.playerService.play(track);
    }
  }
  
  playAyah(ayahNumberInSurah: number) {
    const reciter = this.selectedPerAyahReciter();
    // FIX: Cast ayahs to resolve 'unknown' type and allow property access and iteration.
    const currentAyahs = this.ayahs() as Partial<Ayah>[];
    if (!reciter || !currentAyahs || currentAyahs.length === 0) return;

    const tracks: AudioTrack[] = currentAyahs.map(ayah => this.createAyahTrack(ayah.numberInSurah!, reciter));
    const startIndex = currentAyahs.findIndex(a => a.numberInSurah === ayahNumberInSurah);

    if (startIndex !== -1) {
      this.playerService.loadPlaylist(tracks, startIndex);
    }
  }

  private createAyahTrack(ayahNumber: number, reciter: Reciter): AudioTrack {
    // FIX: Cast surahId to 'number' to resolve 'unknown' type.
    const surahId = this.surahId() as number;
    // FIX: Cast surahInfo to resolve 'unknown' type for property access.
    const surah = this.surahInfo() as Surah | undefined;
    const surahIdFormatted = surahId.toString().padStart(3, '0');
    const ayahIdFormatted = ayahNumber.toString().padStart(3, '0');
    return {
        title: `Surah ${surah?.englishName || surahId}, Ayah ${ayahNumber}`,
        subtitle: reciter.name,
        url: `https://everyayah.com/data/${reciter.server}/${surahIdFormatted}${ayahIdFormatted}.mp3`,
        surahId: surahId,
        ayahNumberInSurah: ayahNumber
    };
  }

  // --- Tafsir & AI Methods ---
  selectTafsir(tafsirId: string) {
    const id = Number(tafsirId);
    this.selectedTafsirId.set(isNaN(id) || !id ? null : id);
    this.visibleTafsirs.set(new Set());
  }

  toggleTafsirVisibility(ayahNumber: number) {
    this.visibleTafsirs.update(currentSet => {
        const newSet = new Set(currentSet);
        if (newSet.has(ayahNumber)) {
            newSet.delete(ayahNumber);
        } else {
            newSet.add(ayahNumber);
        }
        return newSet;
    });
  }

  isTafsirVisible(ayahNumber: number): boolean {
    return this.visibleTafsirs().has(ayahNumber);
  }

  jumpToAyah(ayahNumberStr: string) {
    // FIX: Cast surahInfo to resolve 'unknown' type for property access.
    const surah = this.surahInfo() as Surah | undefined;

    if (!surah) return;
    const ayahNumber = parseInt(ayahNumberStr, 10);

    if (isNaN(ayahNumber) || ayahNumber < 1 || ayahNumber > surah.numberOfAyahs) {
      console.warn('Invalid ayah number entered.');
      return;
    }

    const elementId = `ayah-${surah.id}-${ayahNumber}`;
    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  askAI(ayah: Partial<Ayah>) {
    // FIX: Cast surahInfo to resolve 'unknown' type. The subsequent check handles the 'undefined' case.
    const surah = this.surahInfo() as Surah | undefined;
    if (!surah || !ayah) return;

    this.isAiModalOpen.set(true);
    this.isAiLoading.set(true);
    this.aiError.set(null);
    this.aiExplanation.set('');

    this.geminiService.getExplanationForAyah(surah, ayah)
      .pipe(
        finalize(() => this.isAiLoading.set(false))
      )
      .subscribe({
        next: (explanation) => this.aiExplanation.set(explanation),
        error: (error) => {
          console.error('Error getting AI explanation:', error);
          this.aiError.set(this.t('Could not get explanation.')());
        }
      });
  }

  async shareAyah(ayah: Partial<Ayah>) {
    const surah = this.surahInfo();
    if (!surah || !ayah.numberInSurah) return;
  
    const title = `${this.t('An Ayah from the Quran')()}: ${surah.name} ${surah.id}:${ayah.numberInSurah}`;
    const text = `"${ayah.text}"\n\n${ayah.translation || ''}\n\n- Surah ${surah.englishName} (${surah.id}:${ayah.numberInSurah})`;
    
    // FIX: Reconstruct a clean URL to avoid "Invalid URL" errors in sandboxed environments.
    const url = `${window.location.origin}${window.location.pathname}#/surah/${surah.id}`;
    
    const shareData = {
      title: title,
      text: text,
      url: url,
    };
  
    // Use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard for desktop
      const ayahKey = `${surah.id}:${ayah.numberInSurah}`;
      try {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        this.copiedAyahKey.set(ayahKey);
        this.copyErrorAyahKey.set(null);
        setTimeout(() => {
          // Only clear if it's still the same one, preventing race conditions
          if (this.copiedAyahKey() === ayahKey) {
            this.copiedAyahKey.set(null);
          }
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text to clipboard:', err);
        this.copyErrorAyahKey.set(ayahKey);
        this.copiedAyahKey.set(null);
        setTimeout(() => {
          if (this.copyErrorAyahKey() === ayahKey) {
            this.copyErrorAyahKey.set(null);
          }
        }, 2000);
      }
    }
  }

  // --- Helper & Favorite/Bookmark Methods ---
  getRevelationType(revelationType?: 'Meccan' | 'Medinan'): string {
    if (!revelationType) return '';
    const type = revelationType.toLowerCase();
    return this.languageService.language() === 'ar'
        ? (type === 'meccan' ? this.t('Meccan')() : this.t('Medinan')())
        : revelationType;
  }

  isCurrentSurahFavorite() {
    const id = this.surahId();
    // FIX: Cast id to 'number' to resolve 'unknown' type mismatch.
    return id ? this.favoritesService.isSurahFavorite(id as number) : computed(() => false);
  }

  toggleCurrentSurahFavorite() {
    const id = this.surahId();
    // FIX: Cast id to 'number' to resolve 'unknown' type mismatch.
    if (id) this.favoritesService.toggleSurahFavorite(id as number);
  }

  isAyahFavorite(ayahNumberInSurah: number) {
    const surahId = this.surahId();
    // FIX: Cast surahId to 'number' to resolve 'unknown' type mismatch.
    return surahId ? this.favoritesService.isAyahFavorite(surahId as number, ayahNumberInSurah) : computed(() => false);
  }

  toggleAyahFavorite(ayahNumberInSurah: number) {
    const surahId = this.surahId();
    // FIX: Cast surahId to 'number' to resolve 'unknown' type mismatch.
    if (surahId) this.favoritesService.toggleAyahFavorite(surahId as number, ayahNumberInSurah);
  }

  isAyahBookmarked(ayahNumberInSurah: number) {
    const surahId = this.surahId();
    // FIX: Cast surahId to 'number' to resolve 'unknown' type mismatch.
    return surahId ? this.bookmarkService.isAyahBookmarked(surahId as number, ayahNumberInSurah) : computed(() => false);
  }

  toggleAyahBookmark(ayahNumberInSurah: number) {
    const surahId = this.surahId();
    // FIX: Cast surahId to 'number' to resolve 'unknown' type mismatch.
    if (surahId) this.bookmarkService.toggleAyahBookmark(surahId as number, ayahNumberInSurah);
  }
}
