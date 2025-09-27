
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-isha-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
        <path d="M 12 3 a 9 9 0 0 0 -9 9 a 9 9 0 1 1 11.45 -8.55 A 1 1 0 0 0 12 3 z"/>
        <path d="M 16 5 l 1 1"/>
        <path d="M 19 8 l 1 1"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IshaIconComponent {}
