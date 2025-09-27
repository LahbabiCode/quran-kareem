

import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-pause-icon',
  standalone: true,
  template: `
    <svg [style.height.rem]="sizeRem()" [style.width.rem]="sizeRem()" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M 10 18 a 8 8 0 1 0 0 -16 a 8 8 0 0 0 0 16 z M 8 7 a 1 1 0 0 0 -1 1 v 4 a 1 1 0 0 0 1 1 h 1 a 1 1 0 0 0 1 -1 V 8 a 1 1 0 0 0 -1 -1 H 8 z m 3 0 a 1 1 0 0 0 -1 1 v 4 a 1 1 0 0 0 1 1 h 1 a 1 1 0 0 0 1 -1 V 8 a 1 1 0 0 0 -1 -1 h -1 z" clip-rule="evenodd"></path>
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PauseIconComponent {
    size = input<number>(5);
    // Fix: Use a computed property to calculate rem value for styling to make it compatible with Tailwind JIT.
    sizeRem = computed(() => this.size() * 0.25);
}