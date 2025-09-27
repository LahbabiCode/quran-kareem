import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, Observable, of } from 'rxjs';
import { Reciter, Surah, Radio, Ayah, TafsirBook, Tafsir, PrayerTimes, PrayerTimeEntry, RawRadio, Mp3QuranReciter, Translation, Word } from '../models/quran.models';
import { RECITERS_DATA } from '../data/reciters.data';
import { RADIOS_DATA } from '../data/radios.data';

interface ApiChapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: 'makkah' | 'madinah';
  translated_name: {
    name: string;
  };
}

interface ApiTafsirBook {
    id: number;
    name: string;
    author_name: string;
    language_name: string;
    translated_name: {
        name: string;
        language_name: string;
    };
    quality?: string;
}

// FIX: Define a type for the prayer times API response to ensure type safety.
interface AladhanApiResponse {
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class QuranApiService {
  private http = inject(HttpClient);
  private mp3QuranApiBase = 'https://www.mp3quran.net/api/v3';
  private quranTextApiBase = 'https://api.quran.com/api/v4';
  private prayerTimesApiBase = 'https://api.aladhan.com/v1';

  private getAndCache<T>(cacheKey: string, fetchFn: () => Observable<T>): Observable<T> {
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    try {
        if (typeof localStorage !== 'undefined') {
            const cachedItem = localStorage.getItem(cacheKey);
            if (cachedItem) {
                const { timestamp, data } = JSON.parse(cachedItem);
                if (Date.now() - timestamp < CACHE_DURATION_MS) {
                    return of(data as T);
                }
            }
        }
    } catch (e) {
        console.error(`Error reading from localStorage for key ${cacheKey}`, e);
         if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(cacheKey);
        }
    }

    return fetchFn().pipe(
        tap(data => {
            try {
                if (typeof localStorage !== 'undefined') {
                    const itemToCache = { timestamp: Date.now(), data };
                    localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
                }
            } catch (e) {
                console.error(`Error writing to localStorage for key ${cacheKey}`, e);
            }
        })
    );
  }

  getReciters(language: 'ar' | 'en' = 'ar'): Observable<Reciter[]> {
    const reciters: Reciter[] = RECITERS_DATA.map(raw => ({
      id: raw.id,
      name: raw.name[language],
      rewaya: raw.rewaya[language],
      server: raw.server,
      quality: raw.quality,
    }));
    return of(reciters);
  }

  getMp3QuranReciters(language: 'ar' | 'en' = 'ar'): Observable<Mp3QuranReciter[]> {
    const cacheKey = `mp3quran_reciters_${language}`;
    // FIX: Add explicit return type to fetchFn to resolve type inference issue.
    const fetchFn = (): Observable<Mp3QuranReciter[]> => this.http.get<{ reciters: Mp3QuranReciter[] }>(`${this.mp3QuranApiBase}/reciters?language=${language}`)
      .pipe(
        // FIX: Explicitly type the response to avoid 'unknown' type issues downstream.
        // FIX: Ensure `moshaf` is always an array to prevent runtime errors.
        map((response: { reciters: Mp3QuranReciter[] }) => (response?.reciters || []).map(reciter => ({
            ...reciter,
            moshaf: Array.isArray(reciter.moshaf) ? reciter.moshaf : []
        }))),
        catchError(() => of([] as Mp3QuranReciter[]))
      );
    // FIX: Explicitly provide the generic type to ensure correct type inference for the cached observable.
    return this.getAndCache<Mp3QuranReciter[]>(cacheKey, fetchFn);
  }
  
  getMp3QuranReciterById(id: number, language: 'ar' | 'en' = 'ar'): Observable<Mp3QuranReciter | undefined> {
    return this.getMp3QuranReciters(language).pipe(
      // FIX: Explicitly type `reciters` to resolve `unknown` type issue and allow usage of `.find()`.
      map((reciters: Mp3QuranReciter[]) => reciters.find(reciter => reciter.id === id))
    );
  }

  getSurahs(language: 'ar' | 'en' = 'ar'): Observable<Surah[]> {
    const cacheKey = `surahs_${language}`;
    // FIX: Add explicit return type to fetchFn to resolve type inference issue.
    const fetchFn = (): Observable<Surah[]> => this.http.get<{ chapters: ApiChapter[] }>(`${this.quranTextApiBase}/chapters?language=${language}`)
      .pipe(
        // FIX: Explicitly type the response to avoid 'unknown' type issues downstream.
        // FIX: Add optional chaining to prevent crash if `translated_name` is missing.
        map((response: { chapters: ApiChapter[] }) => (response?.chapters || []).map(chapter => ({
          id: chapter.id,
          name: language === 'ar' ? chapter.name_arabic : chapter.name_simple,
          arabicName: chapter.name_arabic,
          englishName: chapter.name_simple,
          englishNameTranslation: chapter.translated_name?.name || chapter.name_simple,
          numberOfAyahs: chapter.verses_count,
          revelationType: chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
        } as Surah))),
        catchError(() => of([] as Surah[]))
      );
    // FIX: Explicitly provide the generic type to ensure correct type inference for the cached observable.
    return this.getAndCache<Surah[]>(cacheKey, fetchFn);
  }

  getSurahDetail(id: number, translationId: number): Observable<Partial<Ayah>[]> {
    const cacheKey = `surah_detail_v4_${id}_${translationId}`;
    
    // Always include transliteration (17). If a valid translationId is provided (>0), include it.
    const translations = [17];
    if (translationId > 0) {
        translations.push(translationId);
    }
    const translationsParam = translations.join(',');
    const url = `${this.quranTextApiBase}/verses/by_chapter/${id}?language=en&words=true&fields=text_uthmani,verse_number&translations=${translationsParam}`;

    const fetchFn = (): Observable<Partial<Ayah>[]> => this.http.get<{ verses: any[] }>(url).pipe(
        map((response: { verses: any[] }) => (response?.verses || []).map(v => {
            const apiTranslations = Array.isArray(v.translations) ? v.translations : [];
            let translationText: string | undefined = undefined;
            if (translationId > 0) {
                const translationObj = apiTranslations.find((t: any) => t.resource_id === translationId);
                if (translationObj?.text) {
                    translationText = translationObj.text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
                }
            }
            const transliteration = apiTranslations.find((t: any) => t.resource_id === 17)?.text;

            return {
              number: v.id,
              text: v.text_uthmani,
              numberInSurah: v.verse_number,
              translation: translationText,
              transliteration: transliteration,
              words: (v.words || []).map((w: any) => ({
                id: w.id,
                position: w.position,
                text: w.text,
                translation: w.translation,
                transliteration: w.transliteration,
                audio_url: w.audio_url,
              } as Word)),
            } as Partial<Ayah>
        })),
        catchError(() => of([] as Partial<Ayah>[]))
    );
    return this.getAndCache<Partial<Ayah>[]>(cacheKey, fetchFn);
  }

  getRadios(language: 'ar' | 'en' = 'ar'): Observable<Radio[]> {
    const radios: Radio[] = RADIOS_DATA.map((raw: RawRadio) => ({
      Name: raw.name[language],
      URL: raw.url,
    }));
    return of(radios);
  }

  getTranslations(language: 'ar' | 'en' = 'en'): Observable<Translation[]> {
    const cacheKey = `translations_${language}`;
    const fetchFn = (): Observable<Translation[]> => this.http.get<{ translations: Translation[] }>(`${this.quranTextApiBase}/resources/translations?language=${language}`)
      .pipe(
        map(response => response?.translations || []),
        catchError(() => of([] as Translation[]))
      );
    return this.getAndCache<Translation[]>(cacheKey, fetchFn);
  }

  getTafsirList(language: 'ar' | 'en' = 'ar'): Observable<TafsirBook[]> {
    const cacheKey = `tafsir_list_${language}`;
    // FIX: Add explicit return type to fetchFn to resolve type inference issue.
    const fetchFn = (): Observable<TafsirBook[]> => this.http.get<{ tafsirs: ApiTafsirBook[] }>(`${this.quranTextApiBase}/resources/tafsirs?language=${language}`)
      .pipe(
        // FIX: Explicitly type the response to avoid 'unknown' type issues downstream.
        // FIX: Add optional chaining to prevent crash if `translated_name` is missing.
        map((response: { tafsirs: ApiTafsirBook[] }) => (response?.tafsirs || []).map(t => ({
          id: t.id,
          name: t.translated_name?.name || t.name,
          arabicName: t.name,
          author_name: t.author_name,
          language_name: t.language_name,
          quality: t.quality,
        }))),
        catchError(() => of([] as TafsirBook[]))
      );
    // FIX: Explicitly provide the generic type to ensure correct type inference for the cached observable.
    return this.getAndCache<TafsirBook[]>(cacheKey, fetchFn);
  }

  getTafsirForSurah(tafsirId: number, surahId: number): Observable<Tafsir[]> {
    const cacheKey = `tafsir_${tafsirId}_surah_${surahId}`;
    // FIX: Add explicit return type to fetchFn to resolve type inference issue.
    const fetchFn = (): Observable<Tafsir[]> => this.http.get<{ tafsirs: Tafsir[] }>(`${this.quranTextApiBase}/quran/tafsirs/${tafsirId}?chapter_number=${surahId}`)
      .pipe(
        // FIX: Explicitly type the response to avoid 'unknown' type issues downstream.
        map((response: { tafsirs: Tafsir[] }) => response?.tafsirs || []),
        catchError(() => of([] as Tafsir[]))
      );
    // FIX: Explicitly provide the generic type to ensure correct type inference for the cached observable.
    return this.getAndCache<Tafsir[]>(cacheKey, fetchFn);
  }

  getPrayerTimes(latitude: number, longitude: number): Observable<PrayerTimes> {
    const date = new Date();
    const cacheKey = `prayer_times_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    // FIX: Add explicit return type to fetchFn to resolve type inference issue.
    // FIX: Use the specific interface for the API response instead of 'any' for type safety.
    const fetchFn = (): Observable<PrayerTimes> => this.http.get<AladhanApiResponse>(`${this.prayerTimesApiBase}/timings?latitude=${latitude}&longitude=${longitude}`)
      .pipe(
        // FIX: Explicitly type the response to avoid 'unknown' type issues in the map operator.
        map((response: AladhanApiResponse) => {
          const data = response?.data;
          if (!data?.timings || !data?.date?.readable) {
            return { date: '', times: [] as PrayerTimeEntry[] };
          }
          const timings = data.timings;
          const prayerTimes: PrayerTimeEntry[] = [
            { name: 'Fajr', time: timings.Fajr, icon: 'fajr' },
            { name: 'Sunrise', time: timings.Sunrise, icon: 'sunrise' },
            { name: 'Dhuhr', time: timings.Dhuhr, icon: 'dhuhr' },
            { name: 'Asr', time: timings.Asr, icon: 'asr' },
            { name: 'Maghrib', time: timings.Maghrib, icon: 'maghrib' },
            { name: 'Isha', time: timings.Isha, icon: 'isha' },
          ];
          return {
            date: data.date.readable,
            times: prayerTimes,
          };
        }),
        catchError(() => of({ date: '', times: [] } as PrayerTimes))
      );
    // FIX: Explicitly provide the generic type to ensure correct type inference for the cached observable.
    return this.getAndCache<PrayerTimes>(cacheKey, fetchFn);
  }
}