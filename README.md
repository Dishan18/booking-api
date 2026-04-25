# Activity Booking API

## Overview

Simple backend API for:

* User registration & login (JWT auth)
* Activity creation & management
* Booking activities with validation (capacity + no duplicates)

---

## Tech Stack

* Next.js (API routes)
* JWT (`jsonwebtoken`)
* Password hashing (`bcryptjs`)
* In-memory storage (no database)

---

## Setup Instructions

### 1. Clone repo

```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

API base:

```
http://localhost:3000/api
```

---

## Important Note

```
Data is stored in-memory → resets when server restarts
```

---

# API Usage (Postman)

## 1. Setup Postman

### Create Environment

Variables:

```
base_url = http://localhost:3000/api
token =
activityId =
```

---

## 2. Register User

**POST** `{{base_url}}/auth/register`

Body (JSON):

```json
{
  "name": "test",
  "email": "test@test.com",
  "password": "123456"
}
```

Response:

```json
{
  "message": "Registered"
}
```

---

## 3. Login

**POST** `{{base_url}}/auth/login`

Body:

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN"
}
```

### Save token automatically (Postman Script)

Go to **Scripts → Post-response**:

```javascript
pm.environment.set("token", pm.response.json().token);
```

---

## 4. Create Activity

**POST** `{{base_url}}/activities`

Headers:

```
Authorization: Bearer {{token}}
Content-Type: application/json
```

Body:

```json
{
  "title": "Cricket",
  "description": "match",
  "date": "2026-05-01",
  "capacity": 2
}
```

Response:

```json
{
  "id": "123",
  "title": "Cricket",
  "description": "match",
  "date": "2026-05-01",
  "capacity": 2
}
```

### Save activityId

```javascript
pm.environment.set("activityId", pm.response.json().id);
```

---

## 5. Get All Activities

**GET** `{{base_url}}/activities`

---

## 6. Get Single Activity

**GET** `{{base_url}}/activities/{{activityId}}`

---

## 7. Update Activity (Admin Only)

**PUT** `{{base_url}}/activities/{{activityId}}`

Headers:

```
Authorization: Bearer {{token}}
```
> Note: Only user with email `admin@test.com` can update or delete activities (admin is simulated).
---

## 8. Delete Activity (Admin Only)

**DELETE** `{{base_url}}/activities/{{activityId}}`

Headers:

```
Authorization: Bearer {{token}}
```

---

## 9. Book Activity

**POST** `{{base_url}}/bookings`

Headers:

```
Authorization: Bearer {{token}}
Content-Type: application/json
```

Body:

```json
{
  "activityId": "{{activityId}}"
}
```

Response:

```json
{
  "id": "booking_id",
  "userId": "...",
  "activityId": "...",
  "createdAt": "..."
}
```

---

## 10. Get My Bookings

**GET** `{{base_url}}/bookings/me`

Headers:

```
Authorization: Bearer {{token}}
```

---

# Validation Rules

* Cannot book same activity twice
* Cannot exceed activity capacity
* Only authenticated users can book
* Only admin can update/delete activities

---

# Error Codes

| Code | Meaning                                                       |
| ---- | ------------------------------------------------------------- |
| 400  | Bad Request (invalid input, duplicate booking, full capacity) |
| 401  | Unauthorized (missing/invalid token)                          |
| 403  | Forbidden (non-admin access)                                  |
| 404  | Not Found                                                     |

---

# Example Flow

```
Register → Login → Create Activity → Book Activity → Get My Bookings
```

---
