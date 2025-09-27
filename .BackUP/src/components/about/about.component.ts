import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  languageService = inject(LanguageService);
  private metaService = inject(MetaService);
  t = this.languageService.translate.bind(this.languageService);

  featureKeys = [
    'feature_0',
    'feature_1',
    'feature_2',
    'feature_3',
    'feature_4',
    'feature_5',
    'feature_6',
    'feature_7',
    'feature_8',
  ];

  dataSources = [
    {
      name: 'Quran.com API (v4)',
      url: 'https://quran.com/docs/api/v4',
      descriptionKey: 'quran_com_desc'
    },
    {
      name: 'MP3Quran.net API',
      url: 'https://www.mp3quran.net/api/',
      descriptionKey: 'mp3quran_desc'
    },
    {
      name: 'EveryAyah.com',
      url: 'https://everyayah.com/',
      descriptionKey: 'everyayah_desc'
    },
    {
      name: 'Aladhan.com API',
      url: 'https://aladhan.com/prayer-times-api',
      descriptionKey: 'aladhan_desc'
    },
    {
      name: 'Google Gemini API',
      url: 'https://ai.google.dev/',
      descriptionKey: 'gemini_desc'
    }
  ];

  constructor() {
    effect(() => {
      this.metaService.updateTags({
        title: this.t('About')(),
        description: this.t('about_page_subtitle')(),
        imageUrl: `https://picsum.photos/seed/quran-about/1200/630`
      });
    });
  }
}