# JWT Authentication Implementation

This document explains how to use the JWT authentication system implemented in the Page-by-Page API.

## Configuration

The JWT configuration is stored in `global.js`:

- `JWT_SECRET`: Secret key for signing tokens (use environment variable in production)
- `JWT_EXPIRES_IN`: Token expiration time (default: 24 hours)

## Login Endpoints

### Regular Login

**POST** `/api/users/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "userID": "user_id_here",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id_here",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "status": "active",
    "permissions": [],
    "bio": "User bio",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### Native Login

**POST** `/api/users/loginNative`

Same request/response format as regular login.

## Using JWT Tokens

### Protected Routes

To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Protected Route

**GET** `/api/users/profile`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "user_id_here",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "status": "active",
    "permissions": [],
    "bio": "User bio",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

## Middleware Functions

### `authenticateToken`

General authentication middleware for any protected route.

**Usage:**

```javascript
import { authenticateToken } from "../middlewares/auth.js";

router.get("/protected-route", authenticateToken, (req, res) => {
  // req.user contains the decoded token payload
  res.json({ user: req.user });
});
```

### `isAdmin`

Admin-only middleware that checks if the user has admin role.

**Usage:**

```javascript
import { isAdmin } from "../middlewares/auth.js";

router.get("/admin-only", isAdmin, (req, res) => {
  // Only admins can access this route
  res.json({ message: "Admin access granted" });
});
```

## Token Payload

The JWT token contains the following information:

- `userId`: User's MongoDB ObjectId
- `email`: User's email address
- `role`: User's role (user/admin)
- `iat`: Token issued at timestamp
- `exp`: Token expiration timestamp

## Error Responses

### Token Missing

```json
{
  "message": "Access denied: No token provided"
}
```

### Invalid Token

```json
{
  "message": "Invalid token"
}
```

### Expired Token

```json
{
  "message": "Token expired"
}
```

### Admin Access Required

```json
{
  "message": "Forbidden: Admins only"
}
```

## Security Notes

1. **Environment Variables**: In production, set `JWT_SECRET` as an environment variable
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Storage**: Store tokens securely on the client side (httpOnly cookies recommended)
4. **Token Expiration**: Tokens expire after 24 hours by default
5. **Secret Rotation**: Regularly rotate the JWT secret in production

## Example Client Usage

### JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch("/api/users/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
  }),
});

const { token } = await loginResponse.json();

// Use token for protected requests
const profileResponse = await fetch("/api/users/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token for protected request
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <your_token_here>"
```
