# Profile Pictures Feature

## Overview

The profile pictures feature allows users to upload and display profile pictures throughout the application. Profile pictures are stored in Supabase Storage and referenced in the database.

## Database Schema

### Users Table

```sql
ALTER TABLE users
ADD COLUMN profile_picture_url TEXT;
```

### Storage Bucket

- **Bucket Name**: `profile-pictures`
- **Access**: Public read, authenticated upload/update/delete
- **File Structure**: `{user_id}/profile.{extension}`

## API Endpoints

### Update Profile Picture

- **Endpoint**: `POST /updateProfilePicture`
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "profile_picture_url": "https://..."
  }
  ```
- **Response**:
  ```json
  {
    "username": "john_doe",
    "profile_picture_url": "https://..."
  }
  ```

### Get Leaderboard (Updated)

- **Endpoint**: `GET /getLeaderboard`
- **Response**: Now includes `profile_picture_url` field

## Frontend Components

### Profile Page (`/Profile`)

- **File**: `src/app/Profile/page.tsx`
- **Features**:
  - Display current profile picture
  - Upload new profile picture
  - Camera icon overlay for easy access
  - Loading states during upload
  - File validation (image types, size limits)

### Header Component

- **File**: `src/components/ui/header.tsx`
- **Features**:
  - Display user's profile picture in header
  - Fallback to user icon if no picture
  - Hover effects

### Social Screen (Leaderboard)

- **File**: `src/components/ui/social-screen.tsx`
- **Features**:
  - Display profile pictures for top 3 users
  - Display profile pictures in leaderboard table
  - Fallback to user icons

## Utility Functions

### Profile Utils (`src/lib/profileUtils.ts`)

#### `uploadProfilePicture(file, userId)`

- Uploads image to Supabase Storage
- Validates file type and size
- Returns upload result with URL

#### `updateProfilePictureUrl(url, accessToken)`

- Updates profile picture URL in database
- Requires authentication

#### `getProfilePictureUrl(userId)`

- Retrieves user's profile picture URL
- Returns null if no picture exists

## File Validation

- **Supported Types**: All image formats (jpg, png, gif, webp, etc.)
- **Max Size**: 5MB
- **Storage**: Supabase Storage bucket `profile-pictures`

## Security

- **RLS Policies**: Users can only upload/update their own pictures
- **Authentication**: All upload operations require valid session
- **File Validation**: Server-side validation of file types and sizes
- **Public Access**: Profile pictures are publicly readable for leaderboard display

## Usage Examples

### Upload Profile Picture

```typescript
import {
  uploadProfilePicture,
  updateProfilePictureUrl,
} from "@/lib/profileUtils";

const file = event.target.files[0];
const uploadResult = await uploadProfilePicture(file, userId);

if (uploadResult.success) {
  await updateProfilePictureUrl(uploadResult.url!, accessToken);
}
```

### Display Profile Picture

```typescript
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src={profilePictureUrl} />
  <AvatarFallback>
    <User className="w-5 h-5" />
  </AvatarFallback>
</Avatar>;
```

## Storage Structure

```
profile-pictures/
├── user-uuid-1/
│   └── profile.jpg
├── user-uuid-2/
│   └── profile.png
└── user-uuid-3/
    └── profile.webp
```

## Error Handling

- File type validation
- File size limits
- Upload failures
- Network errors
- Authentication errors
- Database update failures

All errors are logged and user-friendly messages are displayed.
