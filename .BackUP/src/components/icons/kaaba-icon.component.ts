

import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-kaaba-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [class]="customClass()" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75l-9-5.25m9 5.25v9.75" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KaabaIconComponent {
  customClass = input<string>('w-8 h-8');
}
