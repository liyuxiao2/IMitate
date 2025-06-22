import { supabase } from './supabaseClient';

export interface ProfilePictureUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a profile picture to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID
 * @returns Promise with upload result
 */
export async function uploadProfilePicture(file: File, userId: string): Promise<ProfilePictureUploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(fileName, file, {
        upsert: true
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Update user's profile picture URL in the database
 * @param profilePictureUrl - The URL of the uploaded image
 * @param accessToken - User's access token
 * @returns Promise with update result
 */
export async function updateProfilePictureUrl(profilePictureUrl: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8000/updateProfilePicture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        profile_picture_url: profilePictureUrl,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating profile picture URL:", error);
    return false;
  }
}

/**
 * Get user's profile picture URL
 * @param userId - The user's ID
 * @returns Promise with profile picture URL or null
 */
export async function getProfilePictureUrl(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("profile_picture_url")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.profile_picture_url;
  } catch (error) {
    console.error("Error fetching profile picture URL:", error);
    return null;
  }
} 