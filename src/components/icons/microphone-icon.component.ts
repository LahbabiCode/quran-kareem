

import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-microphone-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [class]="customClass()" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75a3 3 0 003-3v-1.5a3 3 0 00-6 0v1.5a3 3 0 003 3z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75v2.25M12 3.75v2.25M3 12h18" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicrophoneIconComponent {
  customClass = input<string>('w-8 h-8');
}
