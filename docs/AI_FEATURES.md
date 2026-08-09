# JobEzz — AI Features Specification

> مواصفات ميزات الذكاء الاصطناعي للمنصة

## 🎯 1. المطابقة الذكية (Smart Matching)

### النظرة العامة
خوارزمية تطابق متعددة العوامل تربط العملاء بأفضل مزوّدي الخدمة، وتربط الباحثين عن عمل بالوظائف الأنسب.

### عوامل المطابقة للخدمات

| العامل | الوزن | الوصف |
|--------|-------|-------|
| **المسافة** | 30% | قرب المزوّد من موقع العميل |
| **التقييم** | 25% | متوسط تقييمات المزوّد |
| **التخصص** | 20% | تطابق فئة الخدمة مع تخصص المزوّد |
| **التوفر** | 15% | حالة المزوّد الحالية (متصل/مشغول) |
| **معدل الإكمال** | 10% | نسبة المهام المكتملة بنجاح |

### الخوارزمية

```python
def match_score(provider, request):
    distance_score = max(0, 1 - (provider.distance_km / 10)) * 0.30
    rating_score = (provider.rating / 5.0) * 0.25
    specialty_score = 1.0 if provider.category == request.category else 0.3
    specialty_score *= 0.20
    availability_score = 1.0 if provider.is_online else 0.2
    availability_score *= 0.15
    completion_score = provider.completion_rate * 0.10

    total = (distance_score + rating_score + specialty_score +
             availability_score + completion_score)

    # Boost verified providers
    if provider.verified:
        total *= 1.1

    return min(total, 1.0)
```

### مطابقة الوظائف

```python
def job_match_score(user, job):
    skills_overlap = len(user.skills & job.required_skills) / max(len(job.required_skills), 1)
    location_match = 1.0 if user.city == job.city else (0.5 if job.remote else 0.2)
    salary_fit = 1.0 if job.salary_max >= user.expected_salary else 0.5
    experience_fit = 1.0 if user.years_exp >= job.min_experience else 0.6

    return (skills_overlap * 0.4 + location_match * 0.25 +
            salary_fit * 0.2 + experience_fit * 0.15)
```

### واجهة API

```http
POST /ai/match/service
{
  "category_id": "cat_plumber",
  "location": { "lat": 32.1167, "lng": 20.0667 },
  "limit": 5
}
```

**Response:**
```json
{
  "matches": [
    { "provider_id": "prov_1", "score": 0.96, "reasons": ["الأقرب إليك", "تقييم 4.9"] },
    { "provider_id": "prov_2", "score": 0.88, "reasons": ["متخصص في التسريبات"] }
  ]
}
```

---

## 🤖 2. مساعد المحادثة الذكي (AI Chat Assistant)

### النظرة العامة
مساعد محادثة يفهم اللغة العربية (الليبية) ويساعد المستخدمين في:
- إنشاء طلبات الخدمة
- البحث عن الوظائف
- التسجيل في الدورات
- الإجابة على الأسئلة الشائعة
- تتبع الطلبات

### البنية المعمارية

```
User Message
    ↓
Intent Classification (LLM)
    ↓
┌─────────────┬─────────────┬─────────────┐
│ Book Service│ Search Job  │ FAQ Answer  │
└─────────────┴─────────────┴─────────────┘
    ↓
Entity Extraction (category, location, time)
    ↓
Action Execution (API calls)
    ↓
Response Generation (Arabic)
```

### الأمثلة

```
المستخدم: "أحتاج سباك بشكل عاجل في السلماني"
المساعد: Intent=book_service, Category=plumber, Location=السلماني, Urgency=high
→ يبحث عن سباكين متاحين قرب السلماني
→ "وجدت لك 3 سباكين متاحين قربك، أفضلهم أحمد (⭐4.9، يبعد 1.2 كم). أحجزه الآن؟"

المستخدم: "كم سعر إصلاح تسريب؟"
المساعد: Intent=price_inquiry, Category=plumber, Task=leak_repair
→ "إصلاح التسريب عادةً يتراوح بين 40-60 د.ل حسب حجم المشكلة. هل تريد طلب معاينة مجانية؟"
```

### System Prompt

```
أنت مساعد JobEzz الذكي، منصة العمل الشاملة في ليبيا.
- تتحدث العربية بلهجة ليبية ودودة ومهنية
- تساعد في: حجز الخدمات، البحث عن الوظائف، الدورات التدريبية
- دائماً تؤكد المعلومات قبل التنفيذ
- تقترح خيارات بديلة عند الحاجة
- لا تقدم وعوداً غير مؤكدة
```

### واجهة API

```http
POST /ai/chat
{
  "session_id": "sess_123",
  "message": "أحتاج سباك بشكل عاجل",
  "context": {
    "user_location": { "lat": 32.1167, "lng": 20.0667 }
  }
}
```

**Response:**
```json
{
  "reply": "وجدت لك 3 سباكين متاحين قربك...",
  "intent": "book_service",
  "actions": [
    { "type": "show_providers", "provider_ids": ["prov_1", "prov_2", "prov_3"] }
  ],
  "suggestions": ["احجز أحمد الآن", "قارن الأسعار", "حدد موعداً لاحقاً"]
}
```

---

## 💡 3. التسعير الذكي (Smart Pricing)

### النظرة العامة
تقدير فوري للتكلفة العادلة بناءً على:
- نوع العمل وتعقيده
- المسافة والموقع
- أسعار السوق التاريخية
- العرض والطلب الحالي

### النموذج

```python
def estimate_price(task_type, location, urgency="normal"):
    # Base price from historical data
    base = HISTORICAL_PRICES[task_type]["median"]

    # Location adjustment
    location_factor = LOCATION_FACTORS.get(location.city, 1.0)

    # Urgency multiplier
    urgency_factor = {"normal": 1.0, "urgent": 1.25, "emergency": 1.5}[urgency]

    # Supply/demand adjustment
    demand_factor = current_demand(task_type, location) / current_supply(task_type, location)
    demand_factor = max(0.9, min(1.3, demand_factor))

    estimate = base * location_factor * urgency_factor * demand_factor

    return {
        "low": round(estimate * 0.85),
        "mid": round(estimate),
        "high": round(estimate * 1.2),
        "confidence": calculate_confidence(task_type, location)
    }
```

### أمثلة التقديرات

| المهمة | التقدير | الثقة |
|--------|---------|-------|
| إصلاح تسريب بسيط | 40-60 د.ل | 92% |
| تركيب سخان مياه | 70-90 د.ل | 88% |
| تمديد شبكة مياه كاملة | 200-350 د.ل | 75% |
| صيانة مكيف | 50-80 د.ل | 90% |
| نقل أثاث (شقة) | 150-250 د.ل | 82% |

### واجهة API

```http
POST /ai/price-estimate
{
  "task_type": "leak_repair",
  "category_id": "cat_plumber",
  "location": { "lat": 32.1167, "lng": 20.0667 },
  "urgency": "normal",
  "description": "تسريب في وصلة المطبخ"
}
```

---

## 📝 4. توليد أوصاف الوظائف (Job Description Generator)

### النظرة العامة
يساعد أصحاب العمل في كتابة أوصاف وظيفية احترافية من مدخلات بسيطة.

### المثال

**المدخل:**
```
المسمى: محاسب
الشركة: شركة الأفق
المدينة: بنغازي
الراتب: 2000-3000
```

**المخرج (AI):**
```
📢 وظيفة: محاسب مالي — شركة الأفق

📍 الموقع: بنغازي، ليبيا
💰 الراتب: 2,000 - 3,000 د.ل شهرياً
⏰ النوع: دوام كامل

عن الدور:
نبحث عن محاسب مالي دقيق ومنظم للانضمام إلى فريقنا في بنغازي.
ستكون مسؤولاً عن إدارة الحسابات اليومية، إعداد التقارير المالية،
والمساهمة في التخطيط المالي للشركة.

المسؤوليات:
• إدارة الحسابات العامة والدفاتر اليومية
• إعداد التقارير المالية الشهرية والسنوية
• متابعة الذمم المدينة والدائنة
• التنسيق مع المدققين الخارجيين

المتطلبات:
• بكالوريوس محاسبة أو مالية
• خبرة 2-5 سنوات في مجال مماثل
• إلمام ببرامج المحاسبة (Excel, ERP)
• مهارات تحليلية قوية

المزايا:
• تأمين صحي
• إجازات سنوية مدفوعة
• فرص تطوير مهني

📩 للتقديم: أرسل سيرتك الذاتية عبر منصة JobEzz
```

---

## 🛡️ 5. كشف الاحتيال (Fraud Detection)

### النظرة العامة
نظام يراقب الأنماط المشبوهة ويحمي المنصة والمستخدمين.

### القواعد

```python
FRAUD_RULES = [
    # Multiple accounts from same device
    Rule("same_device_accounts", threshold=3, action="flag"),

    # Rapid booking + cancellation pattern
    Rule("booking_churn", threshold=5, window="1h", action="flag"),

    # Payment anomalies
    Rule("payment_velocity", threshold=10, window="10m", action="block"),

    # Fake review patterns
    Rule("review_ring", similarity=0.9, action="flag"),

    # Location spoofing
    Rule("location_impossible_travel", action="verify"),
]
```

### واجهة API

```http
POST /ai/fraud-check
{
  "event_type": "booking_created",
  "user_id": "usr_123",
  "metadata": { ... }
}
```

**Response:**
```json
{
  "risk_score": 0.12,
  "verdict": "allow",
  "triggered_rules": []
}
```

---

## 🔮 6. التوصيات الشخصية (Personalized Recommendations)

### النظرة العامة
محرك توصيات يقترح:
- وظائف تناسب المهارات والاهتمامات
- دورات تكمل مسار التعلم
- خدمات بناءً على السلوك السابق

### الخوارزمية

```python
def recommend_courses(user):
    # Content-based: skills user wants to learn
    content_scores = cosine_similarity(user.skill_vector, course_vectors)

    # Collaborative: users with similar patterns
    collab_scores = collaborative_filtering(user.id, matrix)

    # Popularity: trending in user's city
    popularity_scores = trending_scores(user.city)

    return combine(content_scores * 0.5 +
                   collab_scores * 0.3 +
                   popularity_scores * 0.2)
```

---

## 📊 7. تحليلات تنبؤية (Predictive Analytics)

### للنظرة العامة للأدمن

- **الطلب المتوقع**: توقع الطلب على كل فئة خدمة حسب اليوم/الساعة
- **التسرب**: تحديد المستخدمين المعرضين للتوقف عن الاستخدام
- **الإيرادات**: توقع الإيرادات الشهرية
- **التوظيف**: توقع الوظائف الأكثر طلباً

### واجهة API

```http
GET /ai/forecast/demand?category=plumber&days=7
```

**Response:**
```json
{
  "forecast": [
    { "date": "2026-07-21", "predicted_requests": 45, "confidence": 0.87 },
    { "date": "2026-07-22", "predicted_requests": 52, "confidence": 0.84 }
  ],
  "peak_hours": ["17:00", "18:00", "19:00"],
  "recommendation": "زد عدد المزوّدين المتاحين مساءً بنسبة 20%"
}
```

---

## 🗺️ خطة التنفيذ

| المرحلة | الميزة | الأولوية | المدة المتوقعة |
|---------|--------|----------|----------------|
| 1 | المطابقة الذكية (قواعد) | 🔴 عالية | أسبوعان |
| 2 | التسعير الذكي (إحصائي) | 🔴 عالية | أسبوعان |
| 3 | مساعد المحادثة (LLM) | 🟡 متوسطة | شهر |
| 4 | توليد أوصاف الوظائف | 🟡 متوسطة | أسبوع |
| 5 | التوصيات الشخصية | 🟢 منخفضة | شهر |
| 6 | كشف الاحتيال | 🟡 متوسطة | 3 أسابيع |
| 7 | التحليلات التنبؤية | 🟢 منخفضة | شهران |

---

## 🔧 البنية التقنية المقترحة

```
┌─────────────────────────────────────────────┐
│              AI Gateway (FastAPI)            │
├─────────────────────────────────────────────┤
│  Matching Engine │ Pricing Engine │ Chat AI  │
│  (Python/NumPy)  │ (Stats Models) │ (LLM API)│
├─────────────────────────────────────────────┤
│         Feature Store (Redis)                │
├─────────────────────────────────────────────┤
│      Supabase (Postgres + pgvector)          │
└─────────────────────────────────────────────┘
```

### الخيارات التقنية

| المكوّن | الخيار الأساسي | البديل |
|---------|----------------|--------|
| LLM للمحادثة | Claude API | GPT-4o, Llama 3 (محلي) |
| Embeddings | OpenAI text-embedding-3 | Sentence Transformers |
| قاعدة متجهات | pgvector | Pinecone, Qdrant |
| نماذج ML | scikit-learn | XGBoost, LightGBM |
| Orchestration | FastAPI | Ray Serve |

---

## 🔒 الاعتبارات الأخلاقية

1. **الشفافية**: أخبر المستخدم دائماً عندما يتفاعل مع AI
2. **التحكم البشري**:允许 المستخدم رفض توصيات AI
3. **العدالة**: راقب التحيز في خوارزميات المطابقة
4. **الخصوصية**: لا تستخدم بيانات المستخدم لتدريب نماذج خارجية دون إذن
5. **المساءلة**: احتفظ بسجلات قرارات AI للتدقيق

---

## 📈 مؤشرات النجاح

| الميزة | المؤشر | الهدف |
|--------|--------|-------|
| المطابقة | معدل قبول أول اقتراح | > 70% |
| التسعير | دقة التقدير (±15%) | > 85% |
| المساعد | معدل حل الاستفسارات | > 80% |
| التوصيات | CTR على التوصيات | > 25% |
| الاحتيال | معدل الكشف | > 90% |
