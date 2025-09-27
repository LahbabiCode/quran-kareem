export interface Language {
  id: number;
  name: string;
  native: string;
  code: string;
  dir: 'ltr' | 'rtl';
}

// This interface models the static data source for reciters, which includes multilingual names.
export interface RawReciter {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  rewaya: {
    ar: string;
    en: string;
  };
  server: string;
  quality: string;
}

// This is the simplified Reciter model used throughout the app.
export interface Reciter {
  id: string;
  name: string;
  rewaya: string;
  server: string; // Standardized to lowercase for consistency.
  quality: string;
}

export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface WordTranslation {
  text: string;
  language_name: string;
}

export interface Word {
  id: number;
  position: number;
  text: string;
  translation: WordTranslation;
  transliteration: WordTranslation;
  audio_url: string | null;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
  transliteration?: string;
  words?: Word[];
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}


export interface Radio {
  Name: string;
  URL: string;
}

export interface RawRadio {
  name: {
    ar: string;
    en: string;
  };
  url: string;
}

export interface AudioTrack {
  title: string;
  subtitle: string;
  url: string;
  // Add metadata for robust playback tracking
  surahId?: number;
  ayahNumberInSurah?: number;
}

export interface TafsirBook {
  id: number;
  name: string;
  arabicName?: string;
  author_name: string;
  language_name: string;
  quality?: string;
}

export interface Tafsir {
  verse_key: string;
  text: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerTimeEntry {
  name: string;
  time: string;
  icon: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
}

export interface PrayerTimes {
  date: string;
  times: PrayerTimeEntry[];
}

// --- New Interfaces for Full Surah Reciters ---

export interface Moshaf {
  id: number;
  name: string;
  server: string;
  surah_total: number;
  surah_list: string;
}

export interface Mp3QuranReciter {
  id: number;
  name: string;
  rewaya: string;
  count: string;
  moshaf: Moshaf[];
  // Augment with server for easier access
  server?: string; 
}

export interface Translation {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
}