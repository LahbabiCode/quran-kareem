
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-sparkle-icon',
  standalone: true,
  template: `
    <svg [class]="customClass()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M 9.813 15.904 L 9 18.75 l -0.813 -2.846 a 4.5 4.5 0 0 0 -3.09 -3.09 L 2.25 12 l 2.846 -0.813 a 4.5 4.5 0 0 0 3.09 -3.09 L 9 5.25 l .813 2.846 a 4.5 4.5 0 0 0 3.09 3.09 L 15.75 12 l -2.846 .813 a 4.5 4.5 0 0 0 -3.09 3.09 z M 18.259 8.715 L 18 9.75 l -0.259 -1.035 a 3.375 3.375 0 0 0 -2.455 -2.456 L 14.25 6 l 1.036 -0.259 a 3.375 3.375 0 0 0 2.455 -2.456 L 18 2.25 l .259 1.035 a 3.375 3.375 0 0 0 2.456 2.456 L 21.75 6 l -1.035 .259 a 3.375 3.375 0 0 0 -2.456 2.456 z M 16.898 20.572 L 16.5 21.75 l -0.398 -1.178 a 3.375 3.375 0 0 0 -2.455 -2.456 L 12.75 18 l 1.178 -0.398 a 3.375 3.375 0 0 0 2.455 -2.456 L 16.5 14.25 l .398 1.178 a 3.375 3.375 0 0 0 2.456 2.456 L 20.25 18 l -1.178 .398 a 3.375 3.375 0 0 0 -2.456 2.456 z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparkleIconComponent {
  customClass = input<string>('w-5 h-5');
}
