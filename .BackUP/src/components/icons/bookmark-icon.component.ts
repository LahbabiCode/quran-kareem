

import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-bookmark-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" [class]="customClass()">
      <path stroke-linecap="round" stroke-linejoin="round" d="M 17.593 3.322 c .1 .121 .176 .26 .176 .418 V 21.8 a .75 .75 0 0 1 -1.125 .626 l -5.42 -3.13 a .75 .75 0 0 0 -.746 0 l -5.42 3.13 A .75 .75 0 0 1 3.5 21.8 V 3.74 c 0 -.158 .076 -.297 .176 -.418 C 4.064 3.118 4.5 3 5 3 h 14 c .5 0 .936 .118 1.171 .322 Z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarkIconComponent {
    customClass = input<string>('w-5 h-5');
}
