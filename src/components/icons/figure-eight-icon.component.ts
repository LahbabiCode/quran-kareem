
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-figure-eight-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" class="w-24 h-auto">
      <style>
        .path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: draw 4s ease-in-out infinite;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      </style>
      <path d="M 30 30 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0" fill="none" stroke="#e0e0e0" stroke-width="4"/>
      <path class="path" d="M 30 30 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0" fill="none" stroke="#0d9488" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FigureEightIconComponent {}
