
import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { QuranApiService } from '../../services/quran-api.service';
import { LanguageService } from '../../services/language.service';
import { LoadingSpinnerComponent } from '../icons/loading-spinner.component';
import { PlayerService } from '../../services/player.service';
import { AudioTrack, Radio } from '../../models/quran.models';
import { PlayIconComponent } from '../icons/play-icon.component';
import { PauseIconComponent } from '../icons/pause-icon.component';
import { SoundWaveIconComponent } from '../icons/sound-wave-icon.component';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, PlayIconComponent, PauseIconComponent, SoundWaveIconComponent],
  templateUrl: './radio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent {
  quranApiService = inject(QuranApiService);
  languageService = inject(LanguageService);
  playerService = inject(PlayerService);
  private metaService = inject(MetaService);
  t = this.languageService.translate.bind(this.languageService);

  radios = toSignal(this.quranApiService.getRadios());

  currentTrack = this.playerService.currentTrack;
  isPlaying = this.playerService.isPlaying;

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('Radio')(),
        description: this.t('Listen to Holy Quran Radio')() + ' stations from around the world.',
        imageUrl: `https://picsum.photos/seed/quran-radio/1200/630`
      });
    });
  }

  playRadio(radio: Radio) {
    const track: AudioTrack = {
      title: radio.Name,
      subtitle: 'Live Radio',
      url: radio.URL,
    };
    this.playerService.play(track);
  }

  pauseRadio() {
      this.playerService.pause();
  }
}