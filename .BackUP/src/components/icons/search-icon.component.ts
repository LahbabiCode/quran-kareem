
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-search-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M 21 21 l -6 -6 m 2 -5 a 7 7 0 1 1 -14 0 a 7 7 0 0 1 14 0 z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchIconComponent {}
