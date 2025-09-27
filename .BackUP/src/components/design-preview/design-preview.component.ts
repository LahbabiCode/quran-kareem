import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-design-preview',
  imports: [CommonModule],
  template: `
    <div class="container-main">
      <!-- Header -->
      <header class="header">
        <div class="brand">
          <div class="logo">ق</div>
          <div>
            <div class="brand-title">Quran Kareem</div>
            <div class="brand-subtitle">تلاوة، استماع، وقت الصلاة</div>
          </div>
        </div>
        <nav class="nav">
          <a href="#" class="nav-link">الرئيسية</a>
          <a href="#" class="nav-link">السور</a>
          <a href="#" class="nav-link">المقرئون</a>
          <a href="#" class="nav-link">مواقيت الصلاة</a>
        </nav>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <div>
            <h1 class="hero-title">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h1>
            <p class="hero-description">استمع الآن — تصميم إسلامي هادئ وسهل الاستخدام، يدعم RTL والوصول.</p>
          </div>
          <div class="hero-side">
            <div class="current-info">السورة الجارية: <strong>الفاتحة</strong></div>
            <div class="current-reciter">المقروء الآن: الشيخ محمد</div>
          </div>
        </div>
      </section>

      <!-- Surah Cards -->
      <section class="cards-section">
        <div class="cards-grid">
          <article class="card">
            <h3 class="card-title">الفاتحة</h3>
            <div class="card-meta">
              <span>7 آيات</span>
              <button class="listen-btn">الاستماع</button>
            </div>
          </article>

          <article class="card">
            <h3 class="card-title">البقرة</h3>
            <div class="card-meta">
              <span>286 آية</span>
              <button class="listen-btn">الاستماع</button>
            </div>
          </article>

          <article class="card">
            <h3 class="card-title">آل عمران</h3>
            <div class="card-meta">
              <span>200 آية</span>
              <button class="listen-btn">الاستماع</button>
            </div>
          </article>

          <article class="card">
            <h3 class="card-title">النساء</h3>
            <div class="card-meta">
              <span>176 آية</span>
              <button class="listen-btn">الاستماع</button>
            </div>
          </article>
        </div>
      </section>

      <!-- Player (Fixed Bottom) -->
      <div class="player">
        <div class="player-content">
          <button class="play-btn">▶️ تشغيل</button>
          <div class="track-info">
            <div class="track-title">الفاتحة — الشيخ محمد</div>
            <div class="track-time">00:01 / 03:12</div>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
          <div class="quality-info">جودة: 128kbps</div>
        </div>
      </div>

      <!-- Bottom spacing for fixed player -->
      <div class="bottom-spacing"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      direction: rtl;
      font-family: 'Noto Naskh Arabic', 'Tajawal', serif;
      background: linear-gradient(180deg, #F6F4EE, #FFF 60%);
      min-height: 100vh;
      color: #0F1722;
    }

    .container-main {
      max-width: 1000px;
      margin: 24px auto;
      padding: 16px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      background: #0B6B3A;
      color: white;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 700;
      box-shadow: 0 6px 18px rgba(11,107,58,0.08);
      font-family: 'Inter', sans-serif;
    }

    .brand-title {
      font-weight: 700;
      font-size: 16px;
      font-family: 'Inter', sans-serif;
    }

    .brand-subtitle {
      font-size: 13px;
      color: #9CA3AF;
    }

    .nav {
      display: flex;
      gap: 12px;
    }

    .nav-link {
      margin-left: 12px;
      color: #0F1722;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: #0B6B3A;
    }

    .hero {
      margin-top: 18px;
      background: linear-gradient(90deg, rgba(11,107,58,0.95), rgba(9,62,43,0.95));
      color: white;
      padding: 22px;
      border-radius: 16px;
    }

    .hero-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .hero-title {
      margin: 0;
      font-size: 24px;
      font-family: 'Noto Naskh Arabic', serif;
    }

    .hero-description {
      margin: 4px 0 0;
      color: rgba(255,255,255,0.9);
    }

    .hero-side {
      min-width: 240px;
      text-align: right;
    }

    .current-info {
      background: rgba(255,255,255,0.06);
      padding: 10px;
      border-radius: 10px;
    }

    .current-reciter {
      margin-top: 8px;
      font-size: 13px;
      color: rgba(255,255,255,0.8);
    }

    .cards-section {
      margin-top: 18px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 6px 18px rgba(11,107,58,0.08);
      cursor: pointer;
      transition: box-shadow 0.2s;
    }

    .card:hover {
      box-shadow: 0 8px 25px rgba(11,107,58,0.12);
    }

    .card-title {
      margin: 0 0 8px;
      font-size: 18px;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #9CA3AF;
    }

    .listen-btn {
      background: none;
      border: none;
      color: #0B6B3A;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.2s;
    }

    .listen-btn:hover {
      color: #095c33;
    }

    .player {
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: 16px;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(6px);
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 14px;
      padding: 12px;
      box-shadow: 0 8px 30px rgba(11,107,58,0.12);
    }

    .player-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .play-btn {
      background: #0B6B3A;
      color: white;
      border: none;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .play-btn:hover {
      background: #095c33;
    }

    .track-info {
      flex: 1;
    }

    .track-title {
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .track-time {
      font-size: 12px;
      color: #9CA3AF;
      margin-bottom: 8px;
    }

    .progress-bar {
      height: 6px;
      background: #eee;
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      width: 32%;
      background: linear-gradient(90deg, #C9A04A, #0B6B3A);
      border-radius: 6px;
    }

    .quality-info {
      font-size: 13px;
      color: #9CA3AF;
      text-align: center;
      min-width: 80px;
    }

    .bottom-spacing {
      height: 100px;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .nav {
        display: none;
      }
      
      .hero-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .player {
        left: 8px;
        right: 8px;
      }
    }
  `]
})
export class DesignPreviewComponent {
  constructor() {}
}