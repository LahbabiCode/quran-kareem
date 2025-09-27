
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-forward-icon',
  standalone: true,
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 4v12l9-6-9-6zm10 0v12h2V4h-2z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForwardIconComponent {}