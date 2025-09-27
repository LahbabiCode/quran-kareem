
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sound-wave-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <style>
        .wave-bar { animation: wave 1.2s ease-in-out infinite; transform-origin: bottom; }
        .wave-bar:nth-child(2) { animation-delay: -1.0s; }
        .wave-bar:nth-child(3) { animation-delay: -0.8s; }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      </style>
      <g>
        <path class="wave-bar" d="M6 10 L6 14"></path>
        <path class="wave-bar" d="M12 7 L12 17"></path>
        <path class="wave-bar" d="M18 10 L18 14"></path>
      </g>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundWaveIconComponent {}