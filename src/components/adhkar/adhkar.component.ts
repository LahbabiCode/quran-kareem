import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

interface AdhkarItem {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  maxCount: number;
  completed: boolean;
}

interface AdhkarCategory {
  id: string;
  name: string;
  nameEn: string;
  adhkar: AdhkarItem[];
}

@Component({
  selector: 'app-adhkar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adhkar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdhkarComponent {
  languageService = inject(LanguageService);
  t = this.languageService.translate.bind(this.languageService);
  lang = this.languageService.language;

  // فئات الأذكار المختلفة
  adhkarCategories = signal<AdhkarCategory[]>([
    {
      id: 'morning',
      name: 'أذكار الصباح',
      nameEn: 'Morning Adhkar',
      adhkar: [
        {
          id: 1,
          arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
          transliteration: 'Asbahnā wa asbaha-l-mulku lillāhi wa-l-hamdu lillāhi lā ilāha illā Allāhu wahdahu lā sharīka lahu lahu-l-mulku wa lahu-l-hamdu wa huwa ʿalā kulli shayʾin qadīr',
          translation: 'We have entered the morning and the kingdom belongs to Allah, praise be to Allah. There is no god but Allah alone, with no partner, His is the kingdom and praise, and He has power over everything.',
          count: 0,
          maxCount: 1,
          completed: false
        },
        {
          id: 2,
          arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
          transliteration: 'Allāhumma bika asbahnā wa bika amsaynā wa bika nahyā wa bika namūtu wa ilayka an-nushūr',
          translation: 'O Allah, by You we have entered the morning, by You we entered the evening, by You we live, by You we die, and to You is the resurrection.',
          count: 0,
          maxCount: 1,
          completed: false
        },
        {
          id: 3,
          arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ، اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ',
          transliteration: 'Aʿūdhu billāhi mina ash-shaytāni ar-rajīm, Allāhu lā ilāha illā huwa al-hayyu al-qayyūmu lā taʾkhudhahu sinatun wa lā nawm',
          translation: 'I seek refuge in Allah from Satan the accursed. Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.',
          count: 0,
          maxCount: 1,
          completed: false
        }
      ]
    },
    {
      id: 'evening',
      name: 'أذكار المساء',
      nameEn: 'Evening Adhkar',
      adhkar: [
        {
          id: 4,
          arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
          transliteration: 'Amsaynā wa amsa-l-mulku lillāhi wa-l-hamdu lillāhi lā ilāha illā Allāhu wahdahu lā sharīka lahu lahu-l-mulku wa lahu-l-hamdu wa huwa ʿalā kulli shayʾin qadīr',
          translation: 'We have entered the evening and the kingdom belongs to Allah, praise be to Allah. There is no god but Allah alone, with no partner, His is the kingdom and praise, and He has power over everything.',
          count: 0,
          maxCount: 1,
          completed: false
        },
        {
          id: 5,
          arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
          transliteration: 'Allāhumma bika amsaynā wa bika asbahnā wa bika nahyā wa bika namūtu wa ilayka al-masīr',
          translation: 'O Allah, by You we have entered the evening, by You we entered the morning, by You we live, by You we die, and to You is the final destination.',
          count: 0,
          maxCount: 1,
          completed: false
        }
      ]
    },
    {
      id: 'sleep',
      name: 'أذكار النوم',
      nameEn: 'Sleeping Adhkar',
      adhkar: [
        {
          id: 6,
          arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
          transliteration: 'Bismika Allāhumma amūtu wa ahyā',
          translation: 'In Your name, O Allah, I die and I live.',
          count: 0,
          maxCount: 1,
          completed: false
        },
        {
          id: 7,
          arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
          transliteration: 'Allāhumma qinī ʿadhābaka yawma tabʿathu ʿibādaka',
          translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
          count: 0,
          maxCount: 3,
          completed: false
        }
      ]
    }
  ]);

  selectedCategory = signal<AdhkarCategory>(this.adhkarCategories()[0]);
  
  // حساب التقدم للفئة المختارة
  progress = computed(() => {
    const category = this.selectedCategory();
    const completed = category.adhkar.filter(item => item.completed).length;
    const total = category.adhkar.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  });

  selectCategory(category: AdhkarCategory) {
    this.selectedCategory.set(category);
  }

  incrementCount(dhikr: AdhkarItem) {
    const categories = this.adhkarCategories();
    const selectedCat = this.selectedCategory();
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCat.id) {
        return {
          ...cat,
          adhkar: cat.adhkar.map(item => {
            if (item.id === dhikr.id) {
              const newCount = item.count + 1;
              const isCompleted = newCount >= item.maxCount;
              return { ...item, count: newCount, completed: isCompleted };
            }
            return item;
          })
        };
      }
      return cat;
    });
    
    this.adhkarCategories.set(updatedCategories);
    
    // تحديث الفئة المختارة
    const updatedCategory = updatedCategories.find(cat => cat.id === selectedCat.id)!;
    this.selectedCategory.set(updatedCategory);

    // إضافة تأثير الاهتزاز
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  }

  resetCategory() {
    const categories = this.adhkarCategories();
    const selectedCat = this.selectedCategory();
    
    const updatedCategories = categories.map(cat => {
      if (cat.id === selectedCat.id) {
        return {
          ...cat,
          adhkar: cat.adhkar.map(item => ({ ...item, count: 0, completed: false }))
        };
      }
      return cat;
    });
    
    this.adhkarCategories.set(updatedCategories);
    
    const updatedCategory = updatedCategories.find(cat => cat.id === selectedCat.id)!;
    this.selectedCategory.set(updatedCategory);
  }

  resetAll() {
    const categories = this.adhkarCategories();
    
    const resetCategories = categories.map(cat => ({
      ...cat,
      adhkar: cat.adhkar.map(item => ({ ...item, count: 0, completed: false }))
    }));
    
    this.adhkarCategories.set(resetCategories);
    
    const updatedCategory = resetCategories.find(cat => cat.id === this.selectedCategory().id)!;
    this.selectedCategory.set(updatedCategory);
  }
}