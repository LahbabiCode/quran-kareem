
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sunrise-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
        <path d="M 12 10 V 2"/>
        <path d="M 5.2 8.2 l 1.4 1.4"/>
        <path d="M 2 18 h 20"/>
        <path d="M 18.8 8.2 l -1.4 1.4"/>
        <path d="M 20 14 H 4"/>
        <path d="M 12 18 a 4 4 0 0 0 -4 -4 h 8 a 4 4 0 0 0 -4 4 z"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SunriseIconComponent {}
