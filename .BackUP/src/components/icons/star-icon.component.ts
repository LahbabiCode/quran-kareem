
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-star-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M 11.48 3.499 a .562 .562 0 0 1 1.04 0 l 2.125 5.111 a .563 .563 0 0 0 .475 .345 l 5.518 .442 c .499 .04 .701 .663 .321 .988 l -4.204 3.602 a .563 .563 0 0 0 -.182 .557 l 1.285 5.385 a .562 .562 0 0 1 -.84 .61 l -4.725 -2.885 a .563 .563 0 0 0 -.586 0 L 6.982 20.54 a .562 .562 0 0 1 -.84 -.61 l 1.285 -5.386 a .562 .562 0 0 0 -.182 -.557 l -4.204 -3.602 a .563 .563 0 0 1 .321 -.988 l 5.518 -.442 a .563 .563 0 0 0 .475 -.345 L 11.48 3.5 z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarIconComponent {}
