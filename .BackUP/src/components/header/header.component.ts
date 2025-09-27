

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  languageService = inject(LanguageService);
  
  lang = this.languageService.language;
  t = this.languageService.translate.bind(this.languageService);

  toggleLanguage() {
    this.languageService.setLanguage(this.lang() === 'ar' ? 'en' : 'ar');
  }
}