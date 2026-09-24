# Online Course Management System
## REST API Documentation

### Base URL

http://localhost:5000

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