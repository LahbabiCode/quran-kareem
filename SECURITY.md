# Security Policy / سياسة الأمان

## Supported Versions / الإصدارات المدعومة

We take security seriously and provide security updates for the following versions:

نحن نأخذ الأمان على محمل الجد ونقدم تحديثات الأمان للإصدارات التالية:

| Version | Supported / مدعوم          |
| ------- | ------------------------- |
| 1.0.x   | :white_check_mark: Yes / نعم |
| < 1.0   | :x: No / لا                |

## Reporting a Vulnerability / الإبلاغ عن ثغرة أمنية

### English

If you discover a security vulnerability in Quran Kareem, please report it responsibly:

**Do NOT create a public GitHub issue for security vulnerabilities.**

Instead, please:

1. **Email us privately**: Send details to `security@lahbabicode.dev`
2. **Include the following information**:
   - Description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Suggested fix (if you have one)
   - Your contact information

### Arabic / العربية

إذا اكتشفت ثغرة أمنية في تطبيق القرآن الكريم، يرجى الإبلاغ عنها بطريقة مسؤولة:

**لا تقم بإنشاء مشكلة عامة على GitHub للثغرات الأمنية.**

بدلاً من ذلك، يرجى:

1. **راسلنا بشكل خاص**: أرسل التفاصيل إلى `security@lahbabicode.dev`
2. **اشمل المعلومات التالية**:
   - وصف الثغرة الأمنية
   - خطوات إعادة إنتاج المشكلة
   - تقييم التأثير المحتمل
   - الإصلاح المقترح (إن كان لديك واحد)
   - معلومات الاتصال الخاصة بك

## Response Timeline / الجدول الزمني للاستجابة

- **Initial Response / الاستجابة الأولية**: Within 24 hours / خلال 24 ساعة
- **Assessment Complete / اكتمال التقييم**: Within 72 hours / خلال 72 ساعة
- **Fix Development / تطوير الإصلاح**: Depends on severity / يعتمد على الخطورة
- **Public Disclosure / الكشف العام**: After fix is released / بعد إصدار الإصلاح

## Security Measures / التدابير الأمنية

### Current Security Practices / الممارسات الأمنية الحالية

- **Content Security Policy (CSP)** implemented / تم تنفيذ سياسة أمان المحتوى
- **HTTPS enforcement** on all deployments / فرض HTTPS على جميع عمليات النشر
- **Input sanitization** for user data / تعقيم المدخلات لبيانات المستخدم
- **Regular dependency updates** / تحديثات منتظمة للتبعيات
- **Environment variable protection** / حماية متغيرات البيئة

### Data Protection / حماية البيانات

- **Local Storage Only**: All user data is stored locally / تخزين محلي فقط: جميع بيانات المستخدم مخزنة محلياً
- **No Server Storage**: We do not collect or store personal data on servers / لا تخزين في الخادم: لا نجمع أو نخزن البيانات الشخصية على الخوادم
- **Privacy First**: User privacy is our top priority / الخصوصية أولاً: خصوصية المستخدم هي أولويتنا العليا

### Islamic Content Integrity / سلامة المحتوى الإسلامي

- **Verified Sources**: All Quranic text from authenticated sources / مصادر موثقة: جميع النصوص القرآنية من مصادر موثقة
- **Content Validation**: Regular verification of Islamic content accuracy / التحقق من المحتوى: التحقق المنتظم من دقة المحتوى الإسلامي
- **Immutable Quranic Text**: Core Quranic content is protected from modification / نص قرآني ثابت: المحتوى القرآني الأساسي محمي من التعديل

## Vulnerability Categories / فئات الثغرات

### High Priority / أولوية عالية
- Cross-Site Scripting (XSS) / البرمجة النصية عبر المواقع
- Injection attacks / هجمات الحقن
- Authentication bypass / تجاوز المصادقة
- Data corruption / فساد البيانات
- Islamic content manipulation / تلاعب في المحتوى الإسلامي

### Medium Priority / أولوية متوسطة
- Cross-Site Request Forgery (CSRF) / تزوير الطلبات عبر المواقع
- Information disclosure / الكشف عن المعلومات
- Denial of Service (DoS) / رفض الخدمة
- Privacy violations / انتهاكات الخصوصية

### Low Priority / أولوية منخفضة
- UI/UX issues / مشاكل واجهة المستخدم
- Performance issues / مشاكل الأداء
- Minor configuration issues / مشاكل تكوين بسيطة

## Bug Bounty Program / برنامج مكافآت الثغرات

Currently, we do not have a formal bug bounty program. However, we greatly appreciate responsible disclosure and will:

حالياً، لا يوجد لدينا برنامج رسمي لمكافآت الثغرات. ومع ذلك، نقدر بشدة الإفصاح المسؤول وسنقوم بـ:

- Acknowledge your contribution / الاعتراف بمساهمتك
- Credit you in our security hall of fame / إدراجك في قاعة مشاهير الأمان
- Consider you for future collaboration opportunities / النظر في إشراكك في فرص تعاون مستقبلية

## Security Best Practices for Users / أفضل الممارسات الأمنية للمستخدمين

### English
1. Keep your browser updated / حافظ على تحديث متصفحك
2. Use the official deployment only / استخدم النشر الرسمي فقط
3. Report suspicious behavior / أبلغ عن السلوك المشبوه
4. Verify the URL before using / تحقق من الرابط قبل الاستخدام

### Arabic / العربية
1. **استخدم متصفحاً محدثاً**: تأكد من أن متصفحك محدث دائماً
2. **استخدم الموقع الرسمي فقط**: `https://quran-kareem-app.netlify.app`
3. **أبلغ عن أي سلوك مشبوه**: إذا لاحظت شيئاً غير طبيعي
4. **تحقق من الرابط**: تأكد أنك على الموقع الصحيح

## Contact Information / معلومات الاتصال

- **Security Email**: security@lahbabicode.dev
- **General Contact**: contact@lahbabicode.dev
- **GitHub Issues**: For non-security issues only / للمشاكل غير الأمنية فقط

## Acknowledgments / شكر وتقدير

We would like to thank all security researchers and users who help us maintain the security of Quran Kareem.

نود أن نشكر جميع الباحثين الأمنيين والمستخدمين الذين يساعدوننا في الحفاظ على أمان تطبيق القرآن الكريم.

---

*This security policy is subject to updates. Please check regularly for the latest version.*

*هذه السياسة الأمنية قابلة للتحديث. يرجى المراجعة بانتظام للحصول على أحدث إصدار.*