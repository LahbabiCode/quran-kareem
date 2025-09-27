import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../services/language.service';
import { QuranApiService } from '../../services/quran-api.service';
import { Coordinates, PrayerTimes, PrayerTimeEntry } from '../../models/quran.models';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { RefreshIconComponent } from '../icons/refresh-icon.component';
import { FajrIconComponent } from '../icons/fajr-icon.component';
import { SunriseIconComponent } from '../icons/sunrise-icon.component';
import { DhuhrIconComponent } from '../icons/dhuhr-icon.component';
import { AsrIconComponent } from '../icons/asr-icon.component';
import { MaghribIconComponent } from '../icons/maghrib-icon.component';
import { IshaIconComponent } from '../icons/isha-icon.component';
// Use modern 'rxjs' imports for consistency and to prevent type inference issues.
import { switchMap, filter } from 'rxjs';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-prayer-times',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, RefreshIconComponent, FajrIconComponent, SunriseIconComponent, DhuhrIconComponent, AsrIconComponent, MaghribIconComponent, IshaIconComponent],
  templateUrl: './prayer-times.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrayerTimesComponent implements OnInit {
  languageService = inject(LanguageService);
  private quranApiService = inject(QuranApiService);
  private metaService = inject(MetaService);
  t = this.languageService.translate.bind(this.languageService);

  private readonly LOCATION_CACHE_KEY = 'prayer_times_user_location';

  userLocation = signal<Coordinates | null>(null);
  locationError = signal<string | null>(null);
  isLoadingLocation = signal(true);

  prayerTimesData = toSignal(
    toObservable(this.userLocation).pipe(
      // The type guard correctly filters out null/incomplete values.
      // FIX: Explicitly type the 'location' parameter to resolve type inference issues.
      filter((location: Coordinates | null): location is Coordinates => 
        location !== null &&
        typeof location.latitude === 'number' &&
        typeof location.longitude === 'number'
      ),
      // Add explicit type annotation to fix type inference issue and prevent crash.
      switchMap((location: Coordinates) => this.quranApiService.getPrayerTimes(location.latitude, location.longitude))
    ), { initialValue: null }
  );

  nextPrayer = computed(() => {
    // FIX: Cast `this.prayerTimesData()` to the correct type to resolve `unknown` error.
    const times = (this.prayerTimesData() as PrayerTimes | null)?.times;
    if (!times) return null;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const prayer of times) {
      // Add a defensive check to ensure prayer.time exists before splitting it.
      if (prayer.name === 'Sunrise' || !prayer.time) continue;
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = hours * 60 + minutes;
      if (prayerTime > currentTime) {
        return prayer;
      }
    }
    // If all prayers are done for the day, the next prayer is Fajr of the next day
    return times.find(p => p.name === 'Fajr') || null;
  });

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('Prayer Times')(),
        description: this.t('Daily prayer times for your location')(),
      });
    });
  }

  ngOnInit() {
    this.loadCachedLocation();
    this.getLocation(false); // Get fresh location silently
  }

  refresh() {
    this.getLocation(true); // Get fresh location with loading indicators
  }

  getLocation(showLoading: boolean) {
    if (showLoading) {
      this.isLoadingLocation.set(true);
    }
    this.locationError.set(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.userLocation.set(coords);
          this.cacheLocation(coords);
          this.isLoadingLocation.set(false);
        },
        (error) => {
          console.error(error);
          this.locationError.set(this.t('Could not get location. Please enable location services.')());
          this.isLoadingLocation.set(false);
        }
      );
    } else {
      this.locationError.set(this.t('Could not get location. Please enable location services.')());
      this.isLoadingLocation.set(false);
    }
  }

  private loadCachedLocation() {
    try {
      if (typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem(this.LOCATION_CACHE_KEY);
        if (cached) {
          const location = JSON.parse(cached);
          if (location && typeof location.latitude === 'number' && typeof location.longitude === 'number') {
            this.userLocation.set(location);
            this.isLoadingLocation.set(false);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load cached location', e);
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.LOCATION_CACHE_KEY);
      }
    }
  }

  private cacheLocation(coords: Coordinates) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.LOCATION_CACHE_KEY, JSON.stringify(coords));
      }
    } catch (e) {
      console.error('Failed to cache location', e);
    }
  }
}