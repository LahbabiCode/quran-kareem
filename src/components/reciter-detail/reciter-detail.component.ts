import { Component, ChangeDetectionStrategy, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
// FIX: Import ParamMap for type safety with route parameters.
import { ActivatedRoute, RouterLink, ParamMap } from '@angular/router';
import { map, switchMap, combineLatest } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { QuranApiService } from '../../services/quran-api.service';
import { PlayerService } from '../../services/player.service';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { Mp3QuranReciter, Surah, AudioTrack } from '../../models/quran.models';
import { PlayCircleIconComponent } from '../icons/play-circle-icon.component';
import { PauseIconComponent } from '../icons/pause-icon.component';
import { SoundWaveIconComponent } from '../icons/sound-wave-icon.component';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-reciter-detail',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    PlayCircleIconComponent,
    PauseIconComponent,
    SoundWaveIconComponent,
  ],
  templateUrl: './reciter-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReciterDetailComponent {
  private route = inject(ActivatedRoute);
  private quranApiService = inject(QuranApiService);
  private metaService = inject(MetaService);
  languageService = inject(LanguageService);
  playerService = inject(PlayerService);
  t = this.languageService.translate.bind(this.languageService);

  // FIX: Explicitly type route parameters to avoid 'unknown' type issues.
  private reciterId$ = this.route.paramMap.pipe(map((params: ParamMap) => Number(params.get('id'))));
  private lang$ = toObservable(this.languageService.language);

  private data$ = combineLatest([this.reciterId$, this.lang$]).pipe(
    switchMap(([id, lang]) =>
      combineLatest([
        this.quranApiService.getMp3QuranReciterById(id, lang),
        this.quranApiService.getSurahs(lang),
      ])
    )
  );

  data = toSignal(this.data$, { initialValue: [undefined, []] as [Mp3QuranReciter | undefined, Surah[]] });

  reciter = computed(() => this.data()[0]);
  allSurahs = computed(() => this.data()[1]);

  currentTrack = this.playerService.currentTrack;
  isPlaying = this.playerService.isPlaying;

  constructor() {
    effect(() => {
      const rec = this.reciter();
      const lang = this.languageService.language(); // depend on language
      if (rec) {
        const description = lang === 'ar'
          ? `استمع إلى تلاوات القرآن الكريم بصوت القارئ ${rec.name} برواية ${rec.rewaya}.`
          : `Listen to recitations of the Holy Quran by ${rec.name} (narration: ${rec.rewaya}).`;

        this.metaService.updateTags({
          title: rec.name,
          description: description,
          imageUrl: `https://picsum.photos/seed/reciter-${rec.id}/1200/630`,
        });
      }
    });
  }

  getSurahUrl(reciter: Mp3QuranReciter, surahId: number): string | null {
    const surahIdStr = String(surahId);
    const moshaf = reciter.moshaf.find(m => m.surah_list.split(',').includes(surahIdStr));
    if (!moshaf || typeof moshaf.server !== 'string' || !moshaf.server) {
      return null;
    }
    const surahIdFormatted = surahIdStr.padStart(3, '0');
    return `${moshaf.server}/${surahIdFormatted}.mp3`;
  }

  playSurah(surah: Surah) {
    const reciter = this.reciter();
    if (!reciter) return;

    const url = this.getSurahUrl(reciter, surah.id);
    if (!url) return;
    
    const track: AudioTrack = {
      title: surah.name,
      subtitle: reciter.name,
      url: url,
      surahId: surah.id
    };
    this.playerService.play(track);
  }

  pause() {
    this.playerService.pause();
  }
}