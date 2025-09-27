import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

import { LanguageService } from '../../services/language.service';
import { QuranApiService } from '../../services/quran-api.service';
import { PlayerService } from '../../services/player.service';
import { MetaService } from '../../services/meta.service';

import { Mp3QuranReciter, Radio, AudioTrack, Surah } from '../../models/quran.models';

import { BookOpenIconComponent } from '../icons/book-open-icon.component';
import { MicrophoneIconComponent } from '../icons/microphone-icon.component';
import { RadioTowerIconComponent } from '../icons/radio-tower-icon.component';
import { KaabaIconComponent } from '../icons/kaaba-icon.component';
import { ClockIconComponent } from '../icons/clock-icon.component';
import { PlayCircleIconComponent } from '../icons/play-circle-icon.component';
import { PauseIconComponent } from '../icons/pause-icon.component';
import { SoundWaveIconComponent } from '../icons/sound-wave-icon.component';
import { SparkleIconComponent } from '../icons/sparkle-icon.component';
import { StarSolidIconComponent } from '../icons/star-solid-icon.component';
import { BookmarkSolidIconComponent } from '../icons/bookmark-solid-icon.component';

interface Slide {
  image: string;
  titleKey: string;
  subtitleKey: string;
  buttonTextKey: string;
  link: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BookOpenIconComponent,
    MicrophoneIconComponent,
    RadioTowerIconComponent,
    KaabaIconComponent,
    ClockIconComponent,
    PlayCircleIconComponent,
    PauseIconComponent,
    SoundWaveIconComponent,
    SparkleIconComponent,
    StarSolidIconComponent,
    BookmarkSolidIconComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  languageService = inject(LanguageService);
  private quranApiService = inject(QuranApiService);
  private playerService = inject(PlayerService);
  private metaService = inject(MetaService);
  t = this.languageService.translate.bind(this.languageService);

  // --- Player State ---
  currentTrack = this.playerService.currentTrack;
  isPlaying = this.playerService.isPlaying;

  // --- Slideshow State ---
  slides = signal<Slide[]>([]);
  activeSlide = signal(0);
  private slideshowInterval: any;

  // --- Data for rows ---
  featuredReciters = toSignal(
    this.quranApiService.getMp3QuranReciters(this.languageService.language()).pipe(
      map(reciters => reciters.slice(0, 8)) // Get up to 8 reciters
    ), { initialValue: [] as Mp3QuranReciter[] }
  );

  radioStations = toSignal(this.quranApiService.getRadios(), { initialValue: [] });
  
  private allSurahs = toSignal(
    toObservable(this.languageService.language).pipe(
      switchMap(lang => this.quranApiService.getSurahs(lang))
    ),
    { initialValue: [] as Surah[] }
  );

  frequentlyReadSurahs = computed(() => {
    const surahs = this.allSurahs();
    if (!surahs.length) return [];
    const featuredIds = [1, 18, 36, 67]; // Al-Fatiha, Al-Kahf, Ya-Sin, Al-Mulk
    return featuredIds
      .map(id => surahs.find(s => s.id === id))
      .filter((s): s is Surah => s !== undefined);
  });

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('Home')(),
        description: `${this.t('Welcome to Quran Kareem')()} - ${this.t('Your daily inspiration from the Holy Quran')()}`,
        imageUrl: 'https://picsum.photos/seed/quran-home/1200/630'
      });
    });
  }

  // --- Lifecycle ---
  ngOnInit() {
    this.setupSlides();
    this.slideshowInterval = setInterval(() => {
      this.nextSlide();
    }, 7000);
  }

  ngOnDestroy() {
    if (this.slideshowInterval) {
      clearInterval(this.slideshowInterval);
    }
  }

  // --- Slideshow Methods ---
  private setupSlides() {
    this.slides.set([
      {
        image: 'https://picsum.photos/1600/900?grayscale&blur=2',
        titleKey: 'Explore the Holy Quran',
        subtitleKey: 'Explore all 114 chapters',
        buttonTextKey: 'Explore Surahs',
        link: '/surahs',
      },
      {
        image: 'https://picsum.photos/1600/900?grayscale',
        titleKey: 'Reciters',
        subtitleKey: 'Listen to various recitations',
        buttonTextKey: 'All Reciters',
        link: '/reciters',
      },
      {
        image: 'https://picsum.photos/id/119/1600/900?grayscale&blur=1',
        titleKey: 'Radio',
        subtitleKey: 'Tune in to live Quran broadcasts',
        buttonTextKey: 'Listen to Live Radio',
        link: '/radio',
      },
    ]);
  }

  nextSlide() {
    this.activeSlide.update(current => (current + 1) % this.slides().length);
  }

  goToSlide(index: number) {
    this.activeSlide.set(index);
  }

  // --- Player Methods ---
  playReciterSample(reciter: Mp3QuranReciter) {
    // Find a moshaf that contains Surah Al-Fatiha (ID 1)
    const moshaf = reciter.moshaf.find(m => m.surah_list.split(',').includes('1'));
    if (!moshaf || typeof moshaf.server !== 'string' || !moshaf.server) {
      console.warn(`Could not find a valid audio source for Al-Fatiha for reciter ${reciter.name}`);
      return;
    }

    const track: AudioTrack = {
      title: 'Surah Al-Fatiha',
      subtitle: reciter.name,
      url: `${moshaf.server}/001.mp3`,
      surahId: 1,
    };
    this.playerService.play(track);
  }

  playRadio(radio: Radio) {
    const track: AudioTrack = {
      title: radio.Name,
      subtitle: 'Live Radio',
      url: radio.URL,
    };
    this.playerService.play(track);
  }

  pause() {
    this.playerService.pause();
  }
}