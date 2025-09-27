
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-dhuhr-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
        <circle cx="12" cy="12" r="5"/>
        <path d="M 12 1 v 2"/>
        <path d="M 12 21 v 2"/>
        <path d="M 4.22 4.22 l 1.42 1.42"/>
        <path d="M 18.36 18.36 l 1.42 1.42"/>
        <path d="M 1 12 h 2"/>
        <path d="M 21 12 h 2"/>
        <path d="M 4.22 19.78 l 1.42 -1.42"/>
        <path d="M 18.36 5.64 l 1.42 -1.42"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhuhrIconComponent {}
