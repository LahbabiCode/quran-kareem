
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-play-circle-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M 21 12 a 9 9 0 1 1 -18 0 a 9 9 0 0 1 18 0 z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M 15.91 11.672 a .375 .375 0 0 1 0 .656 l -5.603 3.113 a .375 .375 0 0 1 -.557 -.328 V 8.887 c 0 -.286 .307 -.466 .557 -.327 l 5.603 3.112 z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayCircleIconComponent {}
