

import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { PlayIconComponent } from '../icons/play-icon.component';
import { PauseIconComponent } from '../icons/pause-icon.component';
import { ForwardIconComponent } from '../icons/forward-icon.component';
import { BackwardIconComponent } from '../icons/backward-icon.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, PlayIconComponent, PauseIconComponent, ForwardIconComponent, BackwardIconComponent],
  templateUrl: './player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  playerService = inject(PlayerService);
  currentTrack = this.playerService.currentTrack;
  isPlaying = this.playerService.isPlaying;
  currentTime = this.playerService.currentTime;
  duration = this.playerService.duration;

  canGoNext = this.playerService.canGoNext;
  canGoPrevious = this.playerService.canGoPrevious;

  trackInfoVisible = signal(true);

  constructor() {
    effect((onCleanup) => {
      this.currentTrack(); // Depend on currentTrack to re-run
      
      // Don't run on the very first evaluation where the track is null.
      // FIX: Use the new public `hasPlaylist` computed signal from PlayerService to check if a playlist is active.
      if (!this.playerService.hasPlaylist()) return;

      this.trackInfoVisible.set(false);
      const timeoutId = setTimeout(() => {
        this.trackInfoVisible.set(true);
      }, 150); // Delay for fade-out, then new info renders and fades in.

      onCleanup(() => clearTimeout(timeoutId));
    }, {allowSignalWrites: true});
  }

  progress = computed(() => {
    const dur = this.duration();
    const time = this.currentTime();
    if (dur === 0 || !isFinite(dur)) {
      return 0;
    }
    return (time / dur) * 100;
  });

  togglePlayPause() {
    this.playerService.togglePlayPause();
  }

  next() {
    this.playerService.next();
  }

  previous() {
    this.playerService.previous();
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00';
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onScrub(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = progressBar.offsetWidth;
    const percentage = x / width;
    const newTime = this.duration() * percentage;
    this.playerService.seek(newTime);
  }
}
