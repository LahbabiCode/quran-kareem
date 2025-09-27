---

## 🌍 النشر على Netlify | Netlify Deployment

### 📦 **إعداد النشر التلقائي | Automatic Deployment**

1. **ربط المشروع بـ Netlify:**
   - قم بتسجيل الدخول إلى [Netlify](https://netlify.com)
   - اربط حساب GitHub الخاص بك
   - اختر مستودع `quran-kareem`

2. **إعدادات البناء:**
   ```
   Build command: npm run build
   Publish directory: dist/quran-kareem-v6
   ```

3. **متغيرات البيئة:**
   ```
   GEMINI_API_KEY = your_gemini_api_key
   NODE_VERSION = 18
   ```

4. **النشر اليدوي:**
   ```bash
   # بناء المشروع
   npm run build
   
   # رفع مجلد dist إلى Netlify
   npx netlify deploy --prod --dir=dist/quran-kareem-v6
   ```

### 🔧 **ملفات الإعداد | Configuration Files**
- `netlify.toml` - إعدادات Netlify
- `angular.json` - إعدادات Angular
- `package.json` - سكريبت البناء

---

## 📊 الإحصائيات | Statistics

<div align="center">

| 📈 المؤشر | 📊 القيمة |
|------------|-----------|
| **السور** | 114 سورة كاملة |
| **القراء** | +100 قارئ مشهور |
| **الإذاعات** | +50 محطة إذاعية |
| **اللغات** | عربي + إنجليزي |
| **الخدمات** | 10+ خدمة إسلامية |
| **المنصات** | جميع الأجهزة |

</div>

---

## 🔄 حالة المشروع | Project Status

### ✅ **مكتمل | Completed**
- ✅ قراءة واستماع القرآن الكريم
- ✅ مكتبة القراء والتلاوات
- ✅ الإذاعة المباشرة
- ✅ بوصلة القبلة وأوقات الصلاة
- ✅ المسبحة الرقمية التفاعلية
- ✅ أذكار الصباح والمساء والنوم
- ✅ أسماء الله الحسنى مع الشرح
- ✅ الذكاء الاصطناعي لشرح الآيات
- ✅ نظام المفضلة والإشارات المرجعية
- ✅ دعم متعدد اللغات (عربي/إنجليزي)

### 🚧 **قيد التطوير | In Development**
- 🔄 حاسبة الزكاة الشاملة
- 🔄 خطة ختم القرآن المخصصة
- 🔄 التقويم الهجري مع المناسبات
- 🔄 مكتبة الأحاديث الشريفة
- 🔄 نظام الإنجازات والتحفيز
- 🔄 وضع القراءة الليلي المحسن

### 🎯 **مخطط مستقبلي | Future Plans**
- 📱 تطبيق الموبايل (iOS/Android)
- 🔊 التحكم الصوتي والمساعد الذكي
- 👥 النسخة المجتمعية والمشاركة
- 📚 دروس وشروحات تفاعلية
- 🌍 دعم لغات إضافية (فرنسي، أردو، إنجليزي)
- 💡 ميزات الذكاء الاصطناعي المتقدمة

---

## 🤝 المساهمة | Contributing

نرحب بالمساهمات من جميع المطورين! إليك كيفية المساهمة:

### 📝 **أنواع المساهمات | Types of Contributions**
- 🐛 **إصلاح الأخطاء** - Bug fixes
- ✨ **ميزات جديدة** - New features  
- 📚 **تحسين التوثيق** - Documentation
- 🌍 **الترجمات** - Translations
- 🎨 **تحسينات التصميم** - UI/UX improvements

### 🔀 **خطوات المساهمة | Contribution Steps**

1. **Fork المشروع**
   ```bash
   git clone https://github.com/YourUsername/quran-kareem.git
   ```

2. **إنشاء فرع جديد**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **تطوير التحسينات**
   ```bash
   # اكتب الكود الخاص بك
   git add .
   git commit -m "Add: amazing feature description"
   ```

4. **رفع التحسينات**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **إنشاء Pull Request**

### 📋 **قواعد المساهمة | Contribution Guidelines**

- **اتبع معايير الكود:** استخدم ESLint و Prettier
- **اكتب تعليقات واضحة:** باللغة العربية أو الإنجليزية
- **اختبر تغييراتك:** تأكد من عمل كل شيء
- **احترم الإرشادات:** اتبع نمط الكود الموجود

### 🌟 **المساهمون | Contributors**

شكر خاص لجميع المساهمين في هذا المشروع:

<div align="center">
  <a href="https://github.com/LahbabiCode">
    <img src="https://github.com/LahbabiCode.png" width="60" height="60" alt="LahbabiCode" style="border-radius: 50%;">
  </a>
  <br>
  <sub><b>LahbabiCode</b></sub><br>
  <sub>المؤسس والمطور الرئيسي</sub>
</div>

---

## 🙏 شكر وتقدير | Acknowledgments

### 📚 **مصادر البيانات | Data Sources**
- **[Quran.com](https://quran.com)** - نصوص القرآن والترجمات
- **[EveryAyah.com](https://everyayah.com)** - التسجيلات الصوتية
- **[MP3Quran.net](https://mp3quran.net)** - التلاوات والإذاعة
- **[AlAdhan.org](https://aladhan.com)** - أوقات الصلاة
- **[Google Gemini AI](https://ai.google.dev)** - الذكاء الاصطناعي

### 🛠️ **أدوات التطوير | Development Tools**
- **[Angular](https://angular.io)** - إطار العمل
- **[Tailwind CSS](https://tailwindcss.com)** - مكتبة التصميم
- **[Vite](https://vitejs.dev)** - أداة البناء
- **[Netlify](https://netlify.com)** - منصة الاستضافة

---

## 📄 الترخيص | License

هذا المشروع مرخص تحت [رخصة MIT](LICENSE) - انظر ملف الترخيص لمزيد من التفاصيل.

```
MIT License

Copyright (c) 2025 LahbabiCode

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 📞 التواصل | Contact

<div align="center">

### 🌟 إذا أعجبك المشروع، لا تنس ⭐ النجمة!

**للاستفسارات والدعم:**

[![GitHub](https://img.shields.io/badge/GitHub-LahbabiCode-black?style=for-the-badge&logo=github)](https://github.com/LahbabiCode)
[![Email](https://img.shields.io/badge/Email-Contact-blue?style=for-the-badge&logo=gmail)](mailto:contact@lahbabicode.dev)
[![Website](https://img.shields.io/badge/Website-Portfolio-green?style=for-the-badge&logo=google-chrome)](https://lahbabicode.dev)

</div>

---

<div align="center">
  <h3>🕌 بارك الله فيكم | May Allah Bless You 🤲</h3>
  <p><em>صُنع بـ ❤️ للأمة الإسلامية | Made with ❤️ for the Muslim Ummah</em></p>
  
  <br>
  
  **"وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ"**
  
  <sub>الإسراء: 82</sub>
</div>
