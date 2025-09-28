import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="luxury-footer">
      <div class="footer-container">
        <div class="footer-grid">
          
          <!-- معلومات المنصة -->
          <div class="footer-column">
            <div class="platform-header">
              <div class="platform-icon">🕋</div>
              <div class="platform-text">
                <h3 class="platform-name">{{ t('platform.name')() }}</h3>
                <p class="platform-tagline">{{ t('platform.tagline')() }}</p>
              </div>
            </div>
            <p class="platform-description">{{ t('footer.description')() }}</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">114</div>
                <div class="stat-label">{{ t('footer.surahs')() }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">6236</div>
                <div class="stat-label">{{ t('footer.verses')() }}</div>
              </div>
            </div>
          </div>

          <!-- الروابط السريعة -->
          <div class="footer-column">
            <h3 class="footer-heading">{{ t('footer.quickLinks')() }}</h3>
            
            <div class="footer-links">
              <a routerLink="/surahs" class="footer-link">
                <span class="link-icon">📖</span>
                <span>{{ t('nav.surahs')() }}</span>
              </a>
              <a routerLink="/reciters" class="footer-link">
                <span class="link-icon">🎤</span>
                <span>{{ t('nav.reciters')() }}</span>
              </a>
              <a routerLink="/prayer-times" class="footer-link">
                <span class="link-icon">⏰</span>
                <span>{{ t('nav.prayerTimes')() }}</span>
              </a>
              <a routerLink="/qibla" class="footer-link">
                <span class="link-icon">🧭</span>
                <span>{{ t('nav.qibla')() }}</span>
              </a>
              <a routerLink="/radio" class="footer-link">
                <span class="link-icon">📻</span>
                <span>{{ t('nav.radio')() }}</span>
              </a>
              <a routerLink="/bookmarks" class="footer-link">
                <span class="link-icon">⭐</span>
                <span>{{ t('nav.bookmarks')() }}</span>
              </a>
            </div>
          </div>

          <!-- الخدمات الإسلامية -->
          <div class="footer-column">
            <h3 class="footer-heading">{{ t('footer.islamicServices')() }}</h3>
            
            <div class="footer-links">
              <a routerLink="/tasbih" class="footer-link">
                <span class="link-icon">✨</span>
                <span>{{ t('more.tasbih')() }}</span>
              </a>
              <a routerLink="/adhkar" class="footer-link">
                <span class="link-icon">🤲</span>
                <span>{{ t('more.adhkar')() }}</span>
              </a>
              <a routerLink="/asma-ul-husna" class="footer-link">
                <span class="link-icon">🌟</span>
                <span>{{ t('more.asmaUlHusna')() }}</span>
              </a>
              <a routerLink="/about" class="footer-link">
                <span class="link-icon">ℹ️</span>
                <span>{{ t('nav.about')() }}</span>
              </a>
            </div>

            <div class="language-section">
              <p class="section-title">{{ t('footer.language')() }}</p>
              <div class="language-buttons">
                <button 
                  (click)="languageService.setLanguage('ar')"
                  [class]="'language-btn ' + (currentLanguage() === 'ar' ? 'active' : '')">
                  العربية
                </button>
                <button 
                  (click)="languageService.setLanguage('en')"
                  [class]="'language-btn ' + (currentLanguage() === 'en' ? 'active' : '')">
                  English
                </button>
              </div>
            </div>
          </div>

          <!-- التواصل والدعم -->
          <div class="footer-column">
            <h3 class="footer-heading">{{ t('footer.connect')() }}</h3>
            
            <div class="section">
              <p class="section-title">{{ t('footer.followUs')() }}</p>
              <div class="social-links">
                <a href="https://github.com/LahbabiCode" target="_blank" class="social-link">
                  <span class="social-icon">🔗</span>
                </a>
                <a href="mailto:contact@lahbabicode.dev" class="social-link">
                  <span class="social-icon">✉️</span>
                </a>
                <a href="#" class="social-link">
                  <span class="social-icon">🐦</span>
                </a>
              </div>
            </div>

            <div class="section">
              <p class="section-title">{{ t('footer.getApp')() }}</p>
              <div class="download-buttons">
                <button class="download-btn">
                  <div class="download-icon">🍎</div>
                  <div class="download-text">
                    <div class="download-label">{{ t('footer.downloadOn')() }}</div>
                    <div class="download-platform">App Store</div>
                  </div>
                </button>
                <button class="download-btn">
                  <div class="download-icon">🤖</div>
                  <div class="download-text">
                    <div class="download-label">{{ t('footer.getItOn')() }}</div>
                    <div class="download-platform">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div class="section support-section">
              <p class="section-title">{{ t('footer.support')() }}</p>
              <div class="support-links">
                <a href="#" class="support-link">{{ t('footer.helpCenter')() }}</a>
                <a href="#" class="support-link">{{ t('footer.reportIssue')() }}</a>
                <a href="#" class="support-link">{{ t('footer.feedback')() }}</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- الشريط السفلي -->
      <div class="footer-bottom">
        <div class="footer-container">
          <div class="bottom-content">
            <div class="copyright">
              <p>{{ t('footer.copyright')() }} {{ currentYear }} {{ t('platform.name')() }}. {{ t('footer.allRightsReserved')() }}</p>
              <p>{{ t('footer.madeWith')() }} ❤️ {{ t('footer.forUmmah')() }}</p>
            </div>
            
            <div class="legal-links">
              <a href="#" class="legal-link">{{ t('footer.privacy')() }}</a>
              <a href="#" class="legal-link">{{ t('footer.terms')() }}</a>
              <a href="#" class="legal-link">{{ t('footer.cookies')() }}</a>
              <a href="#" class="legal-link">{{ t('footer.sitemap')() }}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .luxury-footer {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: white;
      margin-top: auto;
      position: relative;
      overflow: hidden;
    }

    .luxury-footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      position: relative;
      z-index: 1;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 3rem;
      padding: 3rem 0;
    }

    .footer-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .platform-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .platform-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 0.75rem;
      border-radius: 0.75rem;
      font-size: 1.5rem;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .platform-name {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .platform-tagline {
      font-size: 0.875rem;
      color: #cbd5e1;
      margin: 0;
    }

    .platform-description {
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }

    .stat-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.75rem;
      padding: 1rem;
      text-align: center;
      backdrop-filter: blur(10px);
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #10b981;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .footer-heading {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      position: relative;
      padding-bottom: 0.5rem;
    }

    .footer-heading::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 2rem;
      height: 2px;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: 1px;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #cbd5e1;
      text-decoration: none;
      transition: all 0.2s ease;
      padding: 0.5rem 0;
    }

    .footer-link:hover {
      color: white;
      transform: translateX(0.25rem);
    }

    .link-icon {
      font-size: 1rem;
      opacity: 0.8;
    }

    .footer-link:hover .link-icon {
      opacity: 1;
    }

    .language-section {
      padding-top: 1rem;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
    }

    .section-title {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0 0 0.75rem 0;
    }

    .language-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .language-btn {
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      border: none;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(30, 41, 59, 0.6);
      color: #cbd5e1;
    }

    .language-btn:hover {
      background: rgba(71, 85, 105, 0.8);
    }

    .language-btn.active {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    .section {
      margin-bottom: 1.5rem;
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background: rgba(30, 41, 59, 0.6);
      border-radius: 0.75rem;
      color: #cbd5e1;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .social-link:hover {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      transform: translateY(-2px);
    }

    .social-icon {
      font-size: 1.25rem;
    }

    .download-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .download-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 0.75rem;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .download-btn:hover {
      background: rgba(71, 85, 105, 0.8);
      transform: translateY(-1px);
    }

    .download-icon {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 0.5rem;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .download-text {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .download-label {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .download-platform {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .support-section {
      border-top: 1px solid rgba(148, 163, 184, 0.2);
      padding-top: 1rem;
    }

    .support-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .support-link {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.875rem;
      transition: color 0.2s ease;
    }

    .support-link:hover {
      color: white;
    }

    .footer-bottom {
      border-top: 1px solid rgba(148, 163, 184, 0.2);
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(10px);
    }

    .bottom-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 0;
      text-align: center;
    }

    @media (min-width: 768px) {
      .bottom-content {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }

    .copyright {
      font-size: 0.875rem;
      color: #94a3b8;
    }

    .copyright p {
      margin: 0 0 0.25rem 0;
    }

    .legal-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .legal-link {
      font-size: 0.75rem;
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .legal-link:hover {
      color: white;
    }

    :host-context([dir="rtl"]) .footer-link:hover {
      transform: translateX(-0.25rem);
    }

    :host-context([dir="rtl"]) .footer-heading::after {
      left: auto;
      right: 0;
    }

    @media (max-width: 640px) {
      .footer-container {
        padding: 0 0.75rem;
      }

      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem 0;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .language-buttons {
        flex-direction: column;
      }

      .download-buttons {
        gap: 0.75rem;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  currentLanguage = computed(() => this.languageService.currentLanguage());

  constructor(public languageService: LanguageService) {}

  t(key: string) {
    return this.languageService.translate(key);
  }
}