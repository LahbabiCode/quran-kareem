import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

interface TasbihItem {
  id: string;
  text: string;
  textEn: string;
  count: number;
}

@Component({
  selector: 'app-tasbih',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasbih.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasbihComponent {
  languageService = inject(LanguageService);
  t = this.languageService.translate.bind(this.languageService);
  lang = this.languageService.language;

  // قائمة التسبيحات المختلفة
  tasbihat = signal<TasbihItem[]>([
    { id: 'subhanallah', text: 'سبحان الله', textEn: 'SubhanAllah', count: 0 },
    { id: 'alhamdulillah', text: 'الحمد لله', textEn: 'Alhamdulillah', count: 0 },
    { id: 'allahu-akbar', text: 'الله أكبر', textEn: 'Allahu Akbar', count: 0 },
    { id: 'la-hawla', text: 'لا حول ولا قوة إلا بالله', textEn: 'La hawla wa la quwwata illa billah', count: 0 },
    { id: 'astaghfirullah', text: 'أستغفر الله', textEn: 'Astaghfirullah', count: 0 },
    { id: 'la-ilaha', text: 'لا إله إلا الله', textEn: 'La ilaha illa Allah', count: 0 }
  ]);

  selectedTasbih = signal<TasbihItem>(this.tasbihat()[0]);
  totalCount = signal(0);
  currentRound = signal(1);

  // حساب العدد الحالي للتسبيحة المختارة
  currentCount = computed(() => this.selectedTasbih().count);

  // زيادة العداد
  increment() {
    const tasbihat = this.tasbihat();
    const selected = this.selectedTasbih();
    
    // زيادة عداد التسبيحة المختارة
    const updatedTasbihat = tasbihat.map(item => 
      item.id === selected.id 
        ? { ...item, count: item.count + 1 }
        : item
    );
    
    this.tasbihat.set(updatedTasbihat);
    
    // تحديث التسبيحة المختارة
    const updatedSelected = updatedTasbihat.find(item => item.id === selected.id)!;
    this.selectedTasbih.set(updatedSelected);
    
    // زيادة العداد الإجمالي
    this.totalCount.set(this.totalCount() + 1);
    
    // تحديث الجولة كل 33 تسبيحة
    if (updatedSelected.count > 0 && updatedSelected.count % 33 === 0) {
      this.currentRound.set(this.currentRound() + 1);
    }

    // إضافة تأثير الاهتزاز إذا كان متاحًا
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // إضافة تأثير صوتي بسيط
    this.playClickSound();
  }

  // تغيير التسبيحة المختارة
  selectTasbih(tasbih: TasbihItem) {
    this.selectedTasbih.set(tasbih);
  }

  // إعادة تعيين العداد
  reset() {
    const resetTasbihat = this.tasbihat().map(item => ({ ...item, count: 0 }));
    this.tasbihat.set(resetTasbihat);
    this.selectedTasbih.set(resetTasbihat[0]);
    this.totalCount.set(0);
    this.currentRound.set(1);
  }

  // إعادة تعيين التسبيحة المختارة فقط
  resetCurrent() {
    const tasbihat = this.tasbihat();
    const selected = this.selectedTasbih();
    
    const totalToSubtract = selected.count;
    
    const updatedTasbihat = tasbihat.map(item => 
      item.id === selected.id 
        ? { ...item, count: 0 }
        : item
    );
    
    this.tasbihat.set(updatedTasbihat);
    this.selectedTasbih.set({ ...selected, count: 0 });
    this.totalCount.set(Math.max(0, this.totalCount() - totalToSubtract));
    
    // إعادة حساب الجولة
    const newRound = Math.floor(this.totalCount() / 33) + 1;
    this.currentRound.set(newRound);
  }

  // تشغيل صوت النقر
  private playClickSound() {
    try {
      // إنشاء تردد صوتي بسيط
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // التجاهل إذا لم يكن الصوت متاحًا
    }
  }
}