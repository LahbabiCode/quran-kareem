

import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-clock-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" [class]="customClass()" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockIconComponent {
  customClass = input<string>('w-8 h-8');
}
