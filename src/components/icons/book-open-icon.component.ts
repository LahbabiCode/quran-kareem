
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-book-open-icon',
  standalone: true,
  template: `
    <svg [class]="customClass()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M 12 6.042 A 8.967 8.967 0 0 0 6 3.75 c -1.052 0 -2.062 .18 -3 .512 v 14.25 A 8.987 8.987 0 0 1 6 18 c 2.305 0 4.408 .867 6 2.292 m 0 -14.25 a 8.966 8.966 0 0 1 6 -2.292 c 1.052 0 2.062 .18 3 .512 v 14.25 A 8.987 8.987 0 0 0 18 18 a 8.967 8.967 0 0 0 -6 2.292 m 0 -14.25 v 14.25" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookOpenIconComponent {
  customClass = input<string>('w-5 h-5');
}
