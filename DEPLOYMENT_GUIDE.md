# 🚀 Deployment Guide

## The Problem

Your production build is failing because the frontend is trying to connect to `http://localhost:8000` (your local FastAPI server), but that doesn't exist in the production environment.

## ✅ Solution Implemented

I've updated your codebase to use environment-based API configuration:

### 1. **API Configuration (`src/lib/apiConfig.ts`)**

```typescript
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL ||
      "https://your-fastapi-backend.railway.app"
    : "http://localhost:8000";
```

### 2. **Updated Files**

- ✅ `src/app/chat/loadPatient.tsx` - Updated to use `apiEndpoints.getRandomPatient`
- ✅ `src/app/chat/page.tsx` - Updated all API calls to use `apiEndpoints.*`
- ✅ `src/lib/profileUtils.ts` - Updated to use `apiEndpoints.updateProfilePicture`
- ✅ `src/app/History/page.tsx` - Updated to use `API_BASE_URL/fetchHistory`

## 🔧 Deployment Options

### **Option 1: Quick Fix (Temporary)**

Set the `NEXT_PUBLIC_API_URL` environment variable in Vercel to point to a placeholder:

1. Go to your Vercel project settings
2. Add environment variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://api-placeholder.com` (or any valid URL)
3. Redeploy

**Note**: This will fix the build but API calls will fail until you deploy your backend.

### **Option 2: Deploy FastAPI Backend (Recommended)**

#### **Deploy to Railway:**

1. **Create `requirements.txt`** (already exists):

   ```
   fastapi
   uvicorn[standard]
   python-supabase
   python-dotenv
   httpx
   pydantic
   ```

2. **Create `Procfile`**:

   ```
   web: uvicorn src.api.main:app --host 0.0.0.0 --port $PORT
   ```

3. **Deploy to Railway:**

   - Connect your GitHub repo to Railway
   - Set environment variables:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_KEY`
     - `GEMINI_API_KEY`
   - Deploy

4. **Update Vercel Environment Variables:**
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-app-name.railway.app`

#### **Deploy to Render/Heroku:**

Similar process - connect repo, set environment variables, deploy.

## 🔐 Required Environment Variables

### **For Vercel (Frontend):**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_API_URL=https://your-fastapi-backend.railway.app
```

### **For Railway/Backend:**

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

## 🧪 Testing

### **Local Development:**

```bash
# Backend (Terminal 1)
cd src/api
python main.py

# Frontend (Terminal 2)
npm run dev
```

### **Production Testing:**

1. Deploy backend first
2. Update `NEXT_PUBLIC_API_URL` in Vercel
3. Redeploy frontend
4. Test all features

## 📝 Notes

- **Development**: Uses `http://localhost:8000`
- **Production**: Uses `process.env.NEXT_PUBLIC_API_URL`
- **Fallback**: Uses `https://your-fastapi-backend.railway.app` if env var not set
- **Build**: ✅ Now passes successfully

## 🚨 Quick Fix for Immediate Deployment

If you need to deploy immediately without the backend:

1. **Set placeholder API URL in Vercel:**

   ```
   NEXT_PUBLIC_API_URL=https://httpbin.org
   ```

2. **This will:**

   - ✅ Fix the build errors
   - ✅ Allow successful deployment
   - ❌ API calls will fail (expected)

3. **When ready to deploy backend:**
   - Deploy FastAPI to Railway/Render
   - Update `NEXT_PUBLIC_API_URL` to your backend URL
   - Redeploy frontend

Your app will now build successfully and be ready for production deployment! 🎉
