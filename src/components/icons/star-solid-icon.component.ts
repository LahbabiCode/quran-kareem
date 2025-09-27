
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-star-solid-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" [class]="customClass()">
      <path fill-rule="evenodd" d="M 10.788 3.21 c .448 -1.077 1.976 -1.077 2.424 0 l 2.082 5.007 l 5.404 .433 c 1.164 .093 1.636 1.545 .749 2.305 l -4.117 3.527 l 1.257 5.273 c .271 1.136 -.964 2.033 -1.96 1.425 L 12 18.354 l -4.627 2.826 c -.996 .608 -2.231 -.29 -1.96 -1.425 l 1.257 -5.273 l -4.117 -3.527 c -.887 -.76 -.415 -2.212 .749 -2.305 l 5.404 -.433 l 2.082 -5.007 z" clip-rule="evenodd" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarSolidIconComponent {
  customClass = input<string>('w-6 h-6');
}
