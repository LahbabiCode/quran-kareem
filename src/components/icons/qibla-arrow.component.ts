
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-qibla-arrow',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-full h-full">
      <path d="M 50 0 L 65 50 L 50 40 L 35 50 Z" fill="currentColor" />
      <path d="M 50 100 L 65 50 L 50 60 L 35 50 Z" fill="currentColor" class="opacity-50" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QiblaArrowComponent {}
