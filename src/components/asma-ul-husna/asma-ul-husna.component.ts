import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

interface AsmaUlHusnaItem {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  description: string;
}

@Component({
  selector: 'app-asma-ul-husna',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asma-ul-husna.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsmaUlHusnaComponent {
  languageService = inject(LanguageService);
  t = this.languageService.translate.bind(this.languageService);
  lang = this.languageService.language;

  searchTerm = signal('');
  selectedName = signal<AsmaUlHusnaItem | null>(null);

  // أسماء الله الحسنى
  asmaUlHusna = signal<AsmaUlHusnaItem[]>([
    {
      id: 1,
      arabic: 'الرَّحْمَنُ',
      transliteration: 'Ar-Rahman',
      meaning: 'The Most Compassionate',
      description: 'The One who has plenty of mercy for the believers and the blasphemers in this world and especially for the believers in the hereafter.'
    },
    {
      id: 2,
      arabic: 'الرَّحِيمُ',
      transliteration: 'Ar-Raheem',
      meaning: 'The Most Merciful',
      description: 'The One who has plenty of mercy for the believers.'
    },
    {
      id: 3,
      arabic: 'الْمَلِكُ',
      transliteration: 'Al-Malik',
      meaning: 'The King',
      description: 'The One with the complete Dominion, the One Whose Dominion is clear from imperfection.'
    },
    {
      id: 4,
      arabic: 'الْقُدُّوسُ',
      transliteration: 'Al-Quddus',
      meaning: 'The Holy',
      description: 'The One who is pure from any imperfection and clear from children and adversaries.'
    },
    {
      id: 5,
      arabic: 'السَّلاَمُ',
      transliteration: 'As-Salaam',
      meaning: 'The Source of Peace',
      description: 'The One who is free from every imperfection.'
    },
    {
      id: 6,
      arabic: 'الْمُؤْمِنُ',
      transliteration: 'Al-Mu\'min',
      meaning: 'The Faithful',
      description: 'The One who witnessed for Himself that no one is God but Him. And He witnessed for His believers that they are truthful in their belief that no one is God but Him.'
    },
    {
      id: 7,
      arabic: 'الْمُهَيْمِنُ',
      transliteration: 'Al-Muhaymin',
      meaning: 'The Guardian',
      description: 'The One who witnesses the saying and deeds of His creatures.'
    },
    {
      id: 8,
      arabic: 'الْعَزِيزُ',
      transliteration: 'Al-Aziz',
      meaning: 'The Mighty',
      description: 'The Strong, The Defeater who is not defeated.'
    },
    {
      id: 9,
      arabic: 'الْجَبَّارُ',
      transliteration: 'Al-Jabbar',
      meaning: 'The Compeller',
      description: 'The One that nothing happens in His Dominion except that which He willed.'
    },
    {
      id: 10,
      arabic: 'الْمُتَكَبِّرُ',
      transliteration: 'Al-Mutakabbir',
      meaning: 'The Majestic',
      description: 'The One who is clear from the attributes of the creatures and from resembling them.'
    },
    {
      id: 11,
      arabic: 'الْخَالِقُ',
      transliteration: 'Al-Khaliq',
      meaning: 'The Creator',
      description: 'The One who brings everything from non-existence to existence.'
    },
    {
      id: 12,
      arabic: 'الْبَارِئُ',
      transliteration: 'Al-Bari',
      meaning: 'The Evolver',
      description: 'The maker of the soul, The One who has the Power to turn the entities.'
    },
    {
      id: 13,
      arabic: 'الْمُصَوِّرُ',
      transliteration: 'Al-Musawwir',
      meaning: 'The Fashioner',
      description: 'The One who forms His creatures in different pictures.'
    },
    {
      id: 14,
      arabic: 'الْغَفَّارُ',
      transliteration: 'Al-Ghaffar',
      meaning: 'The Repeatedly Forgiving',
      description: 'The One who forgives the sins of His slaves time and time again.'
    },
    {
      id: 15,
      arabic: 'الْقَهَّارُ',
      transliteration: 'Al-Qahhar',
      meaning: 'The Subduer',
      description: 'The Dominant, The One who has the perfect Power and is not unable over anything.'
    },
    // يمكن إضافة باقي الأسماء الـ 84 المتبقية...
    {
      id: 99,
      arabic: 'الصَّبُورُ',
      transliteration: 'As-Sabur',
      meaning: 'The Patient',
      description: 'The One who does not quickly punish the sinners.'
    }
  ]);

  // تصفية الأسماء حسب البحث
  filteredNames = computed(() => {
    const search = this.searchTerm().toLowerCase();
    if (!search) return this.asmaUlHusna();
    
    return this.asmaUlHusna().filter(name => 
      name.arabic.includes(search) ||
      name.transliteration.toLowerCase().includes(search) ||
      name.meaning.toLowerCase().includes(search)
    );
  });

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
  }

  selectName(name: AsmaUlHusnaItem) {
    this.selectedName.set(name);
  }

  closeModal() {
    this.selectedName.set(null);
  }

  playAudio(name: AsmaUlHusnaItem) {
    // يمكن إضافة تشغيل صوتي للاسم هنا
    try {
      const utterance = new SpeechSynthesisUtterance(name.arabic);
      utterance.lang = 'ar';
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.log('Speech synthesis not available');
    }
  }
}