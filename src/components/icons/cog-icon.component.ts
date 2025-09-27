
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-cog-icon',
  standalone: true,
  template: `
    <svg [class]="customClass()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-1.008 1.11-1.226a1.125 1.125 0 011.082 0c.55.218 1.02.684 1.11 1.226l.064.385a11.23 11.23 0 005.158 3.522l.319.167c.563.295 1.01.81 1.157 1.407a1.125 1.125 0 01-.22 1.189l-.261.261a11.206 11.206 0 000 7.422l.261.261a1.125 1.125 0 01.22 1.189c-.147.597-.594 1.112-1.157 1.407l-.319.167a11.23 11.23 0 00-5.158 3.522l-.064.385c-.09.542-.56 1.008-1.11 1.226a1.125 1.125 0 01-1.082 0c-.55-.218-1.02-.684-1.11-1.226l-.064-.385a11.23 11.23 0 00-5.158-3.522l-.319-.167c-.563-.295-1.01-.81-1.157-1.407a1.125 1.125 0 01.22-1.189l.261-.261a11.206 11.206 0 000-7.422l-.261-.261a1.125 1.125 0 01-.22-1.189c.147-.597.594-1.112 1.157-1.407l.319-.167a11.23 11.23 0 005.158-3.522l.064-.385z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CogIconComponent {
  customClass = input<string>('w-6 h-6');
}
