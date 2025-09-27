

import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-radio-tower-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [class]="customClass()" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.344 3.94c.346-.526.95-1.425.95-1.425l.236.468M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 12v6m0 0l-3-3m3 3l3-3" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-4.142-3.358-7.5-7.5-7.5S4.5 7.858 4.5 12" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12c0-2.485-2.015-4.5-4.5-4.5S7.5 9.515 7.5 12" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioTowerIconComponent {
  customClass = input<string>('w-8 h-8');
}
