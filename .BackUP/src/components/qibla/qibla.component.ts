

import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { Coordinates } from '../../models/quran.models';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { QiblaArrowComponent } from '../icons/qibla-arrow.component';
import { FigureEightIconComponent } from '../icons/figure-eight-icon.component';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-qibla',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, QiblaArrowComponent, FigureEightIconComponent],
  templateUrl: './qibla.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QiblaComponent implements OnInit, OnDestroy {
  languageService = inject(LanguageService);
  private metaService = inject(MetaService);
  t = this.languageService.translate.bind(this.languageService);

  private readonly KAABA_COORDS: Coordinates = { latitude: 21.4225, longitude: 39.8262 };
  private readonly LOCATION_CACHE_KEY = 'qibla_user_location';
  private readonly CALIBRATION_SESSION_KEY = 'qibla_calibrated';

  userLocation = signal<Coordinates | null>(null);
  heading = signal<number>(0);
  statusMessage = signal('');
  locationError = signal<string | null>(null);
  isCalibrated = signal(false);
  private lastHeadings = signal<number[]>([]);

  // --- Computed Properties ---

  qiblaDirection = computed(() => {
    const location = this.userLocation();
    if (!location) return 0;
    return this.calculateBearing(location, this.KAABA_COORDS);
  });

  distance = computed(() => {
    const location = this.userLocation();
    if (!location) return 0;
    return this.calculateDistance(location, this.KAABA_COORDS);
  });

  showRecalibrationPrompt = computed(() => {
    const headings = this.lastHeadings();
    if (headings.length < 20) { // Wait for enough samples
      return false;
    }
  
    // Calculate circular dispersion. R is between 0 and 1.
    // 1 means all angles are the same (perfectly stable).
    // 0 means they are uniformly distributed (completely unstable).
    const radHeadings = headings.map(h => this.toRadians(h));
    const s = radHeadings.reduce((sum, h) => sum + Math.sin(h), 0) / radHeadings.length;
    const c = radHeadings.reduce((sum, h) => sum + Math.cos(h), 0) / radHeadings.length;
    const r = Math.sqrt(s**2 + c**2);
  
    // Threshold: If R is less than 0.95 (dispersion > ~18 degrees), prompt for recalibration.
    const UNSTABLE_THRESHOLD_R = 0.95;
    return r < UNSTABLE_THRESHOLD_R;
  });

  // --- Event Handlers & Lifecycle ---

  private orientationHandler = (event: DeviceOrientationEvent) => {
    let alpha = event.alpha;
    if (typeof (event as any).webkitCompassHeading !== 'undefined') {
      alpha = (event as any).webkitCompassHeading; // iOS
    }
    if (alpha !== null) {
      const currentHeading = 360 - alpha;
      this.heading.set(currentHeading);
      
      this.lastHeadings.update(headings => {
        const newHeadings = [...headings, currentHeading];
        // Keep the last 20 readings for stability analysis
        if (newHeadings.length > 20) {
          newHeadings.shift();
        }
        return newHeadings;
      });
    }
  };

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('Qibla Direction')(),
        description: this.t('Find the direction to the Kaaba')() + ' from your current location.',
      });
    });
  }

  ngOnInit() {
    this.checkCalibrationStatus();
    this.loadCachedLocation();
    this.requestPermissionsAndSensors();
  }

  ngOnDestroy() {
    window.removeEventListener('deviceorientation', this.orientationHandler);
  }

  // --- Public Methods ---

  recalibrate() {
    this.isCalibrated.set(false);
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(this.CALIBRATION_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to remove calibration status from sessionStorage', e);
    }
  }

  markAsCalibrated() {
    this.isCalibrated.set(true);
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(this.CALIBRATION_SESSION_KEY, 'true');
      }
    } catch (e) {
      console.error('Failed to set calibration status in sessionStorage', e);
    }
  }

  async requestPermissionsAndSensors() {
    // Compass permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', this.orientationHandler, true);
        } else {
          this.statusMessage.set(this.t('Compass not supported.')());
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        this.statusMessage.set(this.t('Compass not supported.')());
      }
    } else {
      // For other browsers
      window.addEventListener('deviceorientation', this.orientationHandler, true);
    }
    this.getLocation();
  }

  getLocation() {
    this.statusMessage.set(this.t('Acquiring location...')());
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
          this.statusMessage.set(this.t('Location acquired.')());
        },
        (error) => {
          console.error(error);
          this.locationError.set(this.t('Could not get location. Please enable location services.')());
          this.statusMessage.set('');
        }
      );
    } else {
      this.locationError.set(this.t('Could not get location. Please enable location services.')());
      this.statusMessage.set('');
    }
  }

  // --- Private Helpers ---

  private checkCalibrationStatus() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        const calibrated = sessionStorage.getItem(this.CALIBRATION_SESSION_KEY);
        if (calibrated === 'true') {
          this.isCalibrated.set(true);
        }
      }
    } catch (e) {
      console.error('Failed to read calibration status from sessionStorage', e);
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

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  private calculateBearing(start: Coordinates, end: Coordinates): number {
    const startLat = this.toRadians(start.latitude);
    const startLon = this.toRadians(start.longitude);
    const endLat = this.toRadians(end.latitude);
    const endLon = this.toRadians(end.longitude);

    const deltaLon = endLon - startLon;

    const y = Math.sin(deltaLon) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(deltaLon);
    
    let bearing = this.toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360;
  }
  
  private calculateDistance(start: Coordinates, end: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(end.latitude - start.latitude);
    const dLon = this.toRadians(end.longitude - start.longitude);
    const lat1 = this.toRadians(start.latitude);
    const lat2 = this.toRadians(end.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}