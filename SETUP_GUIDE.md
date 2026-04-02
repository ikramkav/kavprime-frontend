# Frontend Setup Guide for Multiple Laptops

## Problem
Login works on one laptop but not on another even though they're on the same network.

## Solution
The frontend now uses environment variables to configure the API URL.

---

## Setup Instructions

### **For Your Laptop (Where Backend is Running)**

1. The `.env.local` file is already configured:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://192.168.100.238:8000/api
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

### **For the Other Laptop**

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and set the backend URL:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://192.168.100.238:8000/api
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

---

## Backend Configuration (IMPORTANT!)

### If backend is running on one laptop and other laptop can't connect:

#### **For Django Backend:**
```bash
# Run server on all network interfaces (not just localhost)
python manage.py runserver 0.0.0.0:8000
```

#### **For FastAPI Backend:**
```bash
# Run server on all network interfaces
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### **For Express/Node.js Backend:**
```javascript
// Listen on all network interfaces
app.listen(8000, '0.0.0.0', () => {
  console.log('Server running on port 8000');
});
```

### **CORS Configuration**

Add the other laptop's origin to CORS allowed origins:

#### Django (settings.py):
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://192.168.100.238:3000",
    "http://192.168.100.XXX:3000",  # Replace XXX with other laptop's IP
]

# Or for development (less secure):
CORS_ALLOW_ALL_ORIGINS = True
```

#### FastAPI (main.py):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.100.238:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Firewall Configuration**

#### Windows (Your Laptop):
```powershell
# Allow port 8000 through firewall
New-NetFirewallRule -DisplayName "Backend API" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

#### Or disable firewall temporarily for testing:
```
Control Panel → Windows Defender Firewall → Turn off (for Private Network)
```

---

## Troubleshooting

### 1. **Test Backend Connectivity**
On the other laptop, open browser and visit:
```
http://192.168.100.238:8000/api
```
- ✅ If you see API response → Backend is accessible
- ❌ If "connection refused" → Backend not listening on network OR firewall blocking

### 2. **Check Frontend is Using Correct URL**
Open browser console and check network tab:
- Should be making requests to: `http://192.168.100.238:8000/api/...`
- If still using `localhost` → Restart the dev server

### 3. **CORS Error**
If you see "CORS policy blocked" in console:
- Update backend CORS configuration (see above)
- Restart backend server

### 4. **Find Your Laptop's IP**
If 192.168.100.238 is wrong:
```bash
# Windows
ipconfig

# Look for "IPv4 Address" under your WiFi adapter
```

---

## Environment Variable Options

### Option 1: Both laptops connect to one backend
```env
# Both laptops use the same .env.local
NEXT_PUBLIC_API_BASE_URL=http://192.168.100.238:8000/api
```

### Option 2: Each laptop runs its own backend
```env
# Each laptop's .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Option 3: Use production server
```env
# Both laptops point to production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```
