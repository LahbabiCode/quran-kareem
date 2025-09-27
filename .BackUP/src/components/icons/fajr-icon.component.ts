
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-fajr-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
      <path d="M 3 21 h 18"/>
      <path d="M 4 16 A 8 8 0 0 1 12 8 a 8 8 0 0 1 8 8 h -2 a 6 6 0 0 0 -6 -6 a 6 6 0 0 0 -6 6 H 4 z"/>
      <path d="M 12 2 v 6"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FajrIconComponent {}
