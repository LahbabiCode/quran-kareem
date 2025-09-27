import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface PageMetadata {
  title: string;
  description: string;
  imageUrl?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  private readonly defaultImageUrl = 'https://picsum.photos/seed/quran-app-og/1200/630';
  private readonly siteName = 'Quran Kareem';

  updateTags(metadata: Partial<PageMetadata>) {
    const title = metadata.title ? `${metadata.title} | ${this.siteName}` : this.siteName;
    this.titleService.setTitle(title);

    const description = metadata.description || 'A comprehensive Quran application to read, listen, and explore the Holy Quran.';
    const imageUrl = metadata.imageUrl || this.defaultImageUrl;
    const type = metadata.type || 'website';
    const url = this.document.location.href;

    this.metaService.updateTag({ name: 'description', content: description });

    // Open Graph tags
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });
    
    // Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
  }
}
