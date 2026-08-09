# JobEzz — API Documentation

> RESTful API reference for JobEzz backend integration

## 📋 Base URL

```
Production:  https://api.jobezz.ly/v1
Staging:     https://staging-api.jobezz.ly/v1
Development: http://localhost:3000/v1
```

## 🔐 Authentication

All API requests require authentication via Bearer token.

```http
Authorization: Bearer <access_token>
```

### Get Access Token

```http
POST /auth/otp/send
Content-Type: application/json

{
  "phone": "+218912345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "session_id": "sess_abc123",
    "expires_in": 300
  }
}
```

### Verify OTP

```http
POST /auth/otp/verify
Content-Type: application/json

{
  "session_id": "sess_abc123",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {
      "id": "usr_123",
      "name": "يوسف المنفي",
      "phone": "+218912345678",
      "roles": ["customer", "jobseeker"],
      "verified": true
    }
  }
}
```

---

## 👤 Users

### Get Current User

```http
GET /users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "usr_123",
    "name": "يوسف المنفي",
    "phone": "+218912345678",
    "email": "youssef@example.com",
    "city": "بنغازي",
    "roles": ["customer", "jobseeker", "student"],
    "verified": true,
    "wallet_balance": 340,
    "rating": 4.8,
    "completed_orders": 12,
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-07-20T14:22:00Z"
  }
}
```

### Update User Profile

```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "يوسف المنفي",
  "city": "طرابلس",
  "bio": "مطور برمجيات"
}
```

### Get User by ID

```http
GET /users/:id
Authorization: Bearer <token>
```

---

## 💼 Jobs

### List Jobs

```http
GET /jobs?page=1&limit=20&category=tech&location=بنغازي&type=full_time
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Items per page (default: 20, max: 100) |
| `category` | string | Filter by category |
| `location` | string | Filter by city |
| `type` | string | `full_time`, `part_time`, `remote`, `contract` |
| `search` | string | Search in title/description |
| `sort` | string | `newest`, `oldest`, `salary_high`, `salary_low` |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "job_123",
        "title": "محاسب مالي",
        "company": {
          "id": "comp_456",
          "name": "شركة الأفق",
          "logo": "https://cdn.jobezz.ly/logos/afq.png",
          "verified": true
        },
        "location": "بنغازي",
        "type": "full_time",
        "salary": {
          "min": 2000,
          "max": 3000,
          "currency": "LYD"
        },
        "description": "مطلوب محاسب ذو خبرة...",
        "requirements": ["بكالوريوس محاسبة", "خبرة 3 سنوات"],
        "posted_at": "2026-07-18T09:00:00Z",
        "expires_at": "2026-08-18T09:00:00Z",
        "applicants_count": 8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "total_pages": 8
    }
  }
}
```

### Get Job Details

```http
GET /jobs/:id
Authorization: Bearer <token>
```

### Apply to Job

```http
POST /jobs/:id/apply
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "cv": <file>,
  "cover_letter": "أنا مهتم بهذه الوظيفة..."
}
```

### Create Job (Employer)

```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "مطور واجهات أمامية",
  "description": "نبحث عن مطور...",
  "requirements": ["React", "TypeScript"],
  "location": "طرابلس",
  "type": "remote",
  "salary_min": 3000,
  "salary_max": 5000,
  "category": "tech"
}
```

### Get Job Applications (Employer)

```http
GET /jobs/:id/applications
Authorization: Bearer <token>
```

---

## 🔧 Services

### List Categories

```http
GET /services/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_plumber",
      "name": "سباك",
      "icon": "🔧",
      "mode": "instant",
      "providers_count": 145
    },
    {
      "id": "cat_electrician",
      "name": "كهربائي",
      "icon": "⚡",
      "mode": "instant",
      "providers_count": 132
    }
  ]
}
```

### List Providers

```http
GET /services/providers?category=plumber&lat=32.1167&lng=20.0667&radius=10
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Category ID |
| `lat` | float | User latitude |
| `lng` | float | User longitude |
| `radius` | integer | Search radius in km (default: 10) |
| `sort` | string | `distance`, `rating`, `price_low`, `price_high` |
| `available_only` | boolean | Only show available providers |

### Request Service

```http
POST /services/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "category_id": "cat_plumber",
  "description": "تسريب في المطبخ",
  "location": {
    "lat": 32.1167,
    "lng": 20.0667,
    "address": "بنغازي، السلماني"
  },
  "images": ["https://cdn.jobezz.ly/uploads/img1.jpg"],
  "mode": "instant",
  "scheduled_at": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request_id": "req_789",
    "status": "searching",
    "estimated_wait": 30
  }
}
```

### Get Request Status

```http
GET /services/requests/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "req_789",
    "status": "in_progress",
    "provider": {
      "id": "prov_456",
      "name": "أحمد العريبي",
      "rating": 4.9,
      "verified": true,
      "phone": "+218912345678",
      "current_location": {
        "lat": 32.1200,
        "lng": 20.0700
      }
    },
    "timeline": [
      { "status": "created", "at": "2026-07-20T14:00:00Z" },
      { "status": "accepted", "at": "2026-07-20T14:02:00Z" },
      { "status": "en_route", "at": "2026-07-20T14:05:00Z" },
      { "status": "in_progress", "at": "2026-07-20T14:15:00Z" }
    ],
    "estimated_arrival": "2026-07-20T14:20:00Z"
  }
}
```

### Rate Provider

```http
POST /services/requests/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "review": "عمل ممتاز وسريع",
  "tips": 10
}
```

---

## 🎓 Courses

### List Courses

```http
GET /courses?page=1&limit=20&category=plumbing&level=beginner
Authorization: Bearer <token>
```

### Get Course Details

```http
GET /courses/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "course_123",
    "title": "كن سباكاً معتمداً",
    "instructor": {
      "id": "inst_456",
      "name": "م. سالم البرعصي",
      "rating": 4.8
    },
    "description": "دورة شاملة في السباكة...",
    "level": "beginner",
    "duration_hours": 12,
    "lessons_count": 24,
    "students_count": 430,
    "rating": 4.6,
    "price": 150,
    "currency": "LYD",
    "certificate": true,
    "curriculum": [
      {
        "section": "الأساسيات",
        "lessons": [
          { "id": "les_1", "title": "مقدمة", "duration": 15, "type": "video" },
          { "id": "les_2", "title": "الأدوات", "duration": 20, "type": "video" }
        ]
      }
    ]
  }
}
```

### Enroll in Course

```http
POST /courses/:id/enroll
Authorization: Bearer <token>
```

### Get Lesson Content

```http
GET /courses/:id/lessons/:lessonId
Authorization: Bearer <token>
```

### Submit Quiz

```http
POST /courses/:id/quizzes/:quizId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    { "question_id": "q1", "answer": "a" },
    { "question_id": "q2", "answer": "c" }
  ]
}
```

### Get Certificate

```http
GET /courses/:id/certificate
Authorization: Bearer <token>
```

---

## 💰 Payments & Wallet

### Get Wallet Balance

```http
GET /wallet
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 340,
    "currency": "LYD",
    "pending": 50,
    "transactions": [
      {
        "id": "txn_123",
        "type": "service_payment",
        "amount": -60,
        "description": "صيانة سباكة",
        "date": "2026-07-20T14:30:00Z"
      }
    ]
  }
}
```

### Create Payment

```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 60,
  "currency": "LYD",
  "method": "wallet",
  "reference_id": "req_789",
  "reference_type": "service_request"
}
```

### Request Withdrawal (Provider)

```http
POST /wallet/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "method": "bank_transfer",
  "bank_details": {
    "bank_name": "مصرف الوحدة",
    "account_number": "1234567890",
    "iban": "LY1234567890"
  }
}
```

---

## 💬 Chat

### Get Conversations

```http
GET /chat/conversations
Authorization: Bearer <token>
```

### Get Messages

```http
GET /chat/conversations/:id/messages?page=1&limit=50
Authorization: Bearer <token>
```

### Send Message

```http
POST /chat/conversations/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "مرحباً، أنا في الطريق",
  "type": "text"
}
```

### WebSocket Connection

```javascript
const ws = new WebSocket('wss://api.jobezz.ly/v1/chat/ws?token=<access_token>');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle incoming message
};

// Send message
ws.send(JSON.stringify({
  type: 'message',
  conversation_id: 'conv_123',
  content: 'Hello!'
}));
```

---

## 🔔 Notifications

### Get Notifications

```http
GET /notifications?page=1&limit=20&unread_only=true
Authorization: Bearer <token>
```

### Mark as Read

```http
POST /notifications/:id/read
Authorization: Bearer <token>
```

### Mark All as Read

```http
POST /notifications/read-all
Authorization: Bearer <token>
```

### Register Push Token

```http
POST /notifications/push-token
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "ExponentPushToken[xxx]",
  "platform": "android"
}
```

---

## 📊 Admin

### Get Analytics

```http
GET /admin/analytics?period=30d
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "active_users": 12840,
      "bookings": 3240,
      "applications": 1870,
      "revenue": 48200
    },
    "growth": [12, 18, 15, 22, 28, 26, 34, 31, 40, 45, 42, 52],
    "revenue_by_module": [
      { "module": "services", "value": 26000 },
      { "module": "courses", "value": 14200 },
      { "module": "jobs", "value": 8000 }
    ],
    "top_categories": [
      { "name": "سباكة", "count": 612 },
      { "name": "كهرباء", "count": 540 }
    ]
  }
}
```

### List Users (Admin)

```http
GET /admin/users?page=1&limit=50&role=provider&status=active
Authorization: Bearer <admin_token>
```

### Verify User

```http
POST /admin/users/:id/verify
Authorization: Bearer <admin_token>
```

### Suspend User

```http
POST /admin/users/:id/suspend
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "مخالفة شروط الاستخدام"
}
```

---

## 🚨 Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "رقم الهاتف غير صالح",
    "details": [
      {
        "field": "phone",
        "message": "يجب أن يبدأ بـ +218"
      }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 📈 Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1721480400
```

- 100 requests per minute per user
- 1000 requests per minute per IP (unauthenticated)

---

## 🔄 Pagination

All list endpoints support pagination:

```http
GET /jobs?page=2&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 156,
    "total_pages": 8,
    "has_next": true,
    "has_prev": true
  }
}
```

---

## 🌐 Webhooks

### Service Request Updates

```json
POST /webhooks/service-request
{
  "event": "service_request.status_changed",
  "data": {
    "request_id": "req_789",
    "old_status": "en_route",
    "new_status": "in_progress",
    "timestamp": "2026-07-20T14:15:00Z"
  }
}
```

### Payment Completed

```json
POST /webhooks/payment
{
  "event": "payment.completed",
  "data": {
    "payment_id": "pay_123",
    "amount": 60,
    "currency": "LYD",
    "reference_id": "req_789",
    "timestamp": "2026-07-20T14:30:00Z"
  }
}
```

---

## 📝 SDK Examples

### JavaScript/TypeScript

```typescript
import { JobEzzClient } from '@jobezz/sdk';

const client = new JobEzzClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

// List jobs
const jobs = await client.jobs.list({
  category: 'tech',
  location: 'بنغازي',
  page: 1
});

// Request service
const request = await client.services.request({
  categoryId: 'cat_plumber',
  description: 'تسريب في المطبخ',
  location: { lat: 32.1167, lng: 20.0667 }
});
```

### Python

```python
from jobezz import Client

client = Client(api_key='your_api_key')

# List jobs
jobs = client.jobs.list(category='tech', location='بنغازي')

# Request service
request = client.services.request(
    category_id='cat_plumber',
    description='تسريب في المطبخ',
    location={'lat': 32.1167, 'lng': 20.0667}
)
```

---

## 📄 OpenAPI Specification

Full OpenAPI 3.0 spec available at:
```
https://api.jobezz.ly/v1/openapi.json
```

---

## 🆘 Support

- Documentation: https://docs.jobezz.ly
- Status Page: https://status.jobezz.ly
- Support Email: api-support@jobezz.ly
- Discord: https://discord.gg/jobezz

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.2 | 2026-07-20 | Added WebSocket chat, push notifications |
| v1.1 | 2026-07-10 | Added admin endpoints, webhooks |
| v1.0 | 2026-07-01 | Initial API release |
