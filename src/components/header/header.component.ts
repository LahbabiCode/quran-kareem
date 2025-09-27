

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
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

  // إدارة قائمة المزيد
  private _isMoreMenuOpen = signal(false);
  isMoreMenuOpen = this._isMoreMenuOpen.asReadonly();

  toggleMoreMenu() {
    this._isMoreMenuOpen.set(!this._isMoreMenuOpen());
  }

  closeMoreMenu() {
    this._isMoreMenuOpen.set(false);
  }

  toggleLanguage() {
    this.languageService.setLanguage(this.lang() === 'ar' ? 'en' : 'ar');
  }
}