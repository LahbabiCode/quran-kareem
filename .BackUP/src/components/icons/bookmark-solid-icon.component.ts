
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-bookmark-solid-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" [class]="customClass()">
      <path fill-rule="evenodd" d="M 6.32 2.577 a 49.255 49.255 0 0 1 11.36 0 c 1.497 .174 2.57 1.46 2.57 2.93 V 21 a .75 .75 0 0 1 -1.085 .67 L 12 18.082 l -6.165 3.583 A .75 .75 0 0 1 4.75 21 V 5.507 c 0 -1.47 1.073 -2.756 2.57 -2.93 z" clip-rule="evenodd" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkSolidIconComponent {
  customClass = input<string>('w-5 h-5');
}
