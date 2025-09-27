
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-backward-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M16 4v12l-9-6 9-6zM6 4v12H4V4h2z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackwardIconComponent {}