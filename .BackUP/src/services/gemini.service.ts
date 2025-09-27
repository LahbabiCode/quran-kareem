

import { Injectable, inject } from '@angular/core';
// FIX: Import GenerateContentResponse for proper typing of Gemini API responses.
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { from, Observable, map } from 'rxjs';
import { LanguageService } from './language.service';
import { Surah, Ayah } from '../models/quran.models';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private languageService = inject(LanguageService);
  private ai: GoogleGenAI;

  constructor() {
    // IMPORTANT: In a real application, the API key should be handled securely
    // and not exposed in the client-side code. This is for demonstration purposes.
    // The `process.env.API_KEY` is a placeholder that would be replaced by a
    // secure mechanism in a production environment.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY environment variable not set.');
      // You could throw an error here or handle it gracefully
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey! });
  }

  getExplanationForAyah(surah: Surah, ayah: Partial<Ayah>): Observable<string> {
    const lang = this.languageService.language();
    const languageName = lang === 'ar' ? 'Arabic' : 'English';
    
    const prompt = `You are a knowledgeable and respectful Islamic scholar. Explain the meaning and context of the following verse from the Quran in a clear and easy-to-understand way.
    Provide the explanation in ${languageName}.
    
    The verse is from Surah ${surah.englishName} (${surah.arabicName}), Ayah number ${ayah.numberInSurah}.
    
    Verse text:
    "${ayah.text}"
    
    Please provide a concise but comprehensive explanation.`;

    const response$ = from(
        this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })
    );
    
    return response$.pipe(
      // FIX: Explicitly type the response to avoid 'unknown' type issues and access '.text' safely.
      map((response: GenerateContentResponse) => response.text ?? '')
    );
  }
}