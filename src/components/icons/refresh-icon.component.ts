
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-refresh-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M 4 4 v 5 h 5 M 20 20 v -5 h -5 M 4 4 a 14.46 14.46 0 0 1 13.89 13.89 M 20 20 a 14.46 14.46 0 0 1 -13.89 -13.89" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefreshIconComponent {}
