# Online Course Management System
## REST API Documentation

### Base URL

Base URL: https://course-management-online-sep.onrender.com

---

## 1. Authentication APIs

### Register User

**POST** `/api/register`

Creates a new user account.

#### Request Body

```json
{
  "name": "Divya M",
  "email": "divya@example.com",
  "password": "123456"
}