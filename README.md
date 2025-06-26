# Essex Auto Works - Invoice Generator (Backend)

This is the **backend API** for the Essex Auto Works invoice management system. It handles:

- User authentication (JWT-based)
- Email verification (via Brevo)
- Customer + vehicle storage
- Invoice + service tracking
- Advanced search + filtering

---

##  Stack

- **Node.js + Express**
- **MySQL**
- **JWT Authentication**
- **Brevo (Sendinblue)** for email verification
- **bcrypt** for password hashing
- **express-validator** for input validation
- **rate limiting, CORS, Helmet** for security

---

##  Folder Structure

```
/src
 - controllers/
 - routes/
 - middleware/
 - utils/
 - models/
 - index.js
```
---

## Scripts

```bash
npm install       # Install dependencies
npm run dev       # Start in dev mode with nodemon
```

---

##  API Endpoints

### Auth

- `POST /auth/register` - register new user
- `POST /auth/login` - login with email/password
- `GET /auth/verify-email/:token` - verify user email
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`


---

##  Notes

- UUIDs used for all table primary keys
- Supports multi-user login/session
- Rate limited to prevent abuse
- Designed for future frontend with React + Redux

---


