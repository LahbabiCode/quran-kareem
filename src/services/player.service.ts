import { Injectable, signal, computed } from '@angular/core';
import { AudioTrack } from '../models/quran.models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  // Private state
  private playlist = signal<AudioTrack[]>([]);
  private currentIndex = signal<number>(-1);
  private audio: HTMLAudioElement | null = null;
  
  // Public state signals
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);

  currentTrack = computed(() => {
    const tracks = this.playlist();
    const index = this.currentIndex();
    if (index >= 0 && index < tracks.length) {
      return tracks[index];
    }
    return null;
  });

  canGoNext = computed(() => this.currentIndex() < this.playlist().length - 1);
  canGoPrevious = computed(() => this.currentIndex() > 0);
  
  // FIX: Add a public computed property to allow checking for a loaded playlist from outside the service.
  hasPlaylist = computed(() => this.playlist().length > 0);

  // --- Event Handlers ---
  private onEndedHandler = (event: Event) => {
    if (event.target === this.audio) {
      if (this.canGoNext()) {
        this.next();
      } else {
        this.isPlaying.set(false);
        this.currentIndex.set(-1); // Reset index
      }
    }
  };

  private onTimeUpdateHandler = (event: Event) => {
    if (event.target === this.audio) {
      this.currentTime.set(this.audio?.currentTime || 0);
    }
  };
  private onDurationChangeHandler = (event: Event) => {
    if (event.target === this.audio) {
      this.duration.set(this.audio?.duration || 0);
    }
  };
  private onErrorHandler = (event: Event) => {
    if (event.target === this.audio) {
      console.error('Audio playback error occurred.');
      this.stop(); // Stop and reset on error
    }
  };
  
  // --- Public API ---

  play(track: AudioTrack) {
    this.loadPlaylist([track], 0);
  }

  loadPlaylist(tracks: AudioTrack[], startIndex = 0) {
    this.stop();
    this.playlist.set(tracks);
    this.currentIndex.set(startIndex);
    this.playCurrentTrack();
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying.set(false);
    }
  }

  togglePlayPause() {
    if (this.isPlaying()) {
      this.pause();
    } else if(this.currentTrack() !== null) {
      this.resume();
    }
  }

  seek(time: number) {
    if (this.audio && isFinite(time)) {
      this.audio.currentTime = time;
    }
  }

  stop() {
    this._cleanupAudioElement();
    this._resetState();
  }

  next() {
    if (this.canGoNext()) {
      this.currentIndex.update(i => i + 1);
      this.playCurrentTrack();
    }
  }

  previous() {
    if (this.canGoPrevious()) {
      this.currentIndex.update(i => i - 1);
      this.playCurrentTrack();
    }
  }

  // --- Private Helpers ---

  private async resume() {
    if (this.audio) {
       try {
        await this.audio.play();
        this.isPlaying.set(true);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error resuming audio:", error);
          this.stop(); // Reset on failure
        }
      }
    } else if (this.currentTrack()) {
      // If audio element is null but there's a track, it means we are at the end of a playlist.
      // Restart the playlist from the current (last) track.
      this.playCurrentTrack();
    }
  }

  private async playCurrentTrack() {
    this._cleanupAudioElement();
    const track = this.currentTrack();
    
    if (!track) {
      this._resetState();
      return;
    }

    const newAudio = new Audio(track.url);
    this.audio = newAudio;
    this._attachEventListeners(newAudio);

    try {
      await newAudio.play();
      if (this.audio === newAudio) {
        this.isPlaying.set(true);
      } else {
        newAudio.pause();
        this._removeEventListeners(newAudio);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error playing audio:", error);
        if (this.audio === newAudio) {
          this.stop();
        }
      }
    }
  }


  private _attachEventListeners(audio: HTMLAudioElement) {
    audio.addEventListener('ended', this.onEndedHandler as EventListener);
    audio.addEventListener('timeupdate', this.onTimeUpdateHandler as EventListener);
    audio.addEventListener('durationchange', this.onDurationChangeHandler as EventListener);
    audio.addEventListener('error', this.onErrorHandler as EventListener);
  }

  private _removeEventListeners(audio: HTMLAudioElement) {
    audio.removeEventListener('ended', this.onEndedHandler as EventListener);
    audio.removeEventListener('timeupdate', this.onTimeUpdateHandler as EventListener);
    audio.removeEventListener('durationchange', this.onDurationChangeHandler as EventListener);
    audio.removeEventListener('error', this.onErrorHandler as EventListener);
  }

  private _cleanupAudioElement() {
    if (this.audio) {
      this.audio.pause();
      this._removeEventListeners(this.audio);
      this.audio = null;
    }
  }

  private _resetState() {
    this.playlist.set([]);
    this.currentIndex.set(-1);
    this.isPlaying.set(false);
    this.currentTime.set(0);
    this.duration.set(0);
  }
}
