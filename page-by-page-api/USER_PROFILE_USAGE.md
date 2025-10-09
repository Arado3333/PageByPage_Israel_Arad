# User Profile API Usage

This document explains how to use the updated user profile API endpoints.

## Getting Current User Profile

### Endpoint

**GET** `/api/users/profile`

### Headers

```
Authorization: Bearer <your_jwt_token>
```

### Response

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "permissions": [],
    "bio": "Software developer and writer",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

## Getting Specific User Profile (Admin Only)

### Endpoint

**GET** `/api/users/profile/:userId`

### Headers

```
Authorization: Bearer <admin_jwt_token>
```

### Response

Same format as above, but returns the profile of the specified user.

## Frontend Usage Examples

### JavaScript/React Example

```javascript
// Get current user profile
async function getCurrentUserProfile() {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch("/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      console.log("User profile:", data.user);
      return data.user;
    } else {
      console.error("Failed to get profile:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

// Usage in React component
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const userData = await getCurrentUserProfile();
      setUser(userData);
      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Failed to load profile</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.status}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      {user.bio && <p>Bio: {user.bio}</p>}
    </div>
  );
}
```

### Using with Admin Dashboard

```javascript
// In admin dashboard to get any user's profile
async function getUserProfile(userId) {
  try {
    const token = await getTokenFromCookies();

    const response = await fetch(`/api/users/profile/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      return data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
```

## Key Changes Made

1. **Complete User Object**: The profile endpoint now returns the complete user object from the database, not just the JWT token payload.

2. **Password Security**: Passwords are automatically removed from the response for security.

3. **Enhanced JWT Token**: The JWT token now includes additional fields like `permissions` and `status`.

4. **Consistent Response Format**: All user-related endpoints now return a consistent response format with `success` and `user` fields.

5. **Error Handling**: Improved error handling with proper HTTP status codes and error messages.

## User Object Fields

The user object returned includes:

- `_id`: Unique user identifier
- `name`: User's full name
- `email`: User's email address
- `role`: User role (user, editor, admin)
- `status`: User status (active, suspended, deleted)
- `permissions`: Array of user permissions
- `bio`: User biography/description
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp
- `lastLogin`: Last login timestamp

## Authentication Requirements

- The `/api/users/profile` endpoint requires a valid JWT token
- The `/api/users/profile/:userId` endpoint requires admin privileges
- All requests must include the `Authorization: Bearer <token>` header
