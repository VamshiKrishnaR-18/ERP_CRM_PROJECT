# CORS Error Fix

## Problem
The frontend (running on `http://localhost:5173`) was unable to make API requests to the backend (running on `http://localhost:3000`) due to CORS policy blocking.

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/users/register' from origin 'http://localhost:5173' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause
The `CORS_ORIGIN` environment variable in `backend/.env` was incorrectly set to `http://localhost:3000` (the backend's own URL) instead of `http://localhost:5173` (the frontend URL).

## Solution

### Step 1: Update Backend Environment Variable

**File:** `backend/.env`

**Change:**
```env
# Before
CORS_ORIGIN= http://localhost:3000

# After
CORS_ORIGIN=http://localhost:5173
```

### Step 2: Restart Backend Server

After updating the `.env` file, you **must restart** the backend server for the changes to take effect:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

### Step 3: Verify CORS Configuration

The CORS middleware in `backend/src/middleware/cors.js` is configured to:
- Allow requests from origins listed in `CORS_ORIGIN` environment variable
- Support credentials (cookies, authorization headers)
- Allow methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allow headers: Content-Type, Authorization

## Testing

After restarting the backend server:

1. **Open the frontend** at `http://localhost:5173`
2. **Try to register** a new user
3. **Try to login** with credentials
4. **Check browser console** - CORS errors should be gone

## Additional Configuration (Optional)

If you need to allow multiple origins (e.g., for production deployment), you can use comma-separated values:

```env
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com,https://www.yourdomain.com
```

## Production Deployment

For production, update the `CORS_ORIGIN` to your actual frontend domain:

```env
CORS_ORIGIN=https://your-frontend-domain.com
```

## Troubleshooting

### CORS errors still occurring?

1. **Verify backend server restarted:**
   - Check terminal for "Server is running on port 3000"
   - Look for "MongoDB Connected" message

2. **Check environment variable loaded:**
   - Add `console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);` in `cors.js`
   - Should print: `CORS_ORIGIN: http://localhost:5173`

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or clear browser cache completely

4. **Check frontend API URL:**
   - Verify `frontend/.env` has: `VITE_API_BASE_URL=http://localhost:3000`
   - Restart frontend if you changed it

### Still not working?

Try this temporary development-only CORS configuration:

**File:** `backend/src/middleware/cors.js`

```javascript
export const corsMidlleware = cors({
    origin: process.env.NODE_ENV === 'development' ? '*' : allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
})
```

⚠️ **Warning:** Using `origin: '*'` is only for development. Never use this in production!

## Status

✅ **Fixed:** Updated `CORS_ORIGIN` to `http://localhost:5173`

🔄 **Action Required:** Restart backend server to apply changes

## Next Steps

1. Stop the backend server (if running)
2. Restart: `npm run dev` in backend directory
3. Test registration/login from frontend
4. Verify no CORS errors in browser console

