"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Edit, Camera, Check, X } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

import { useState, useRef } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  uploadProfilePicture,
  updateProfilePictureUrl,
} from "@/lib/profileUtils";

type EditableField = "username" | "full_name" | null;

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    profile_picture_url: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for editing fields
  const [editingField, setEditingField] = useState<EditableField>(null);
  const [fieldValue, setFieldValue] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) return;

      const { data: profileData } = await supabase
        .from("users")
        .select("*") // Select all fields to get the ID
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field: EditableField, currentValue: string) => {
    setEditingField(field);
    setFieldValue(currentValue);
  };

  const handleCancel = () => {
    setEditingField(null);
    setFieldValue("");
  };

  const handleSave = async () => {
    if (!editingField || !profile.id) return;

    const { data, error } = await supabase
      .from("users")
      .update({ [editingField]: fieldValue })
      .eq("id", profile.id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${editingField}:`, error);
      alert(`Failed to update ${editingField}.`);
    } else if (data) {
      setProfile(data); // Update the profile with the returned data
      handleCancel(); // Exit editing mode
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No active session");
      }

      // Upload the file using utility function
      const uploadResult = await uploadProfilePicture(file, session.user.id);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      // Update the profile picture URL in the database
      const updateSuccess = await updateProfilePictureUrl(
        uploadResult.url!,
        session.access_token
      );

      if (!updateSuccess) {
        throw new Error("Failed to update profile picture");
      }

      // Update local state
      setProfile((prev) => ({
        ...prev,
        profile_picture_url: uploadResult.url!,
      }));
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again.";
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold text-mcmaster-maroon mb-16">
              Profile
            </h1>

            <div className="grid grid-cols-3 gap-x-24 items-start">
              {/* Form Section */}
              <div className="col-span-2 space-y-12">
                {/* Display Name */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">
                    Display Name
                  </Label>
                  <div className="relative">
                    <Input
                      value={
                        editingField === "full_name"
                          ? fieldValue
                          : profile.full_name
                      }
                      onChange={(e) =>
                        editingField === "full_name" &&
                        setFieldValue(e.target.value)
                      }
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-24 rounded-full w-full"
                      readOnly={editingField !== "full_name"}
                    />
                    {editingField === "full_name" ? (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button
                          onClick={handleSave}
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700 h-10 w-10"
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 h-10 w-10"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() =>
                          handleEdit("full_name", profile.full_name)
                        }
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      value={
                        editingField === "username"
                          ? fieldValue
                          : profile.username
                      }
                      onChange={(e) =>
                        editingField === "username" &&
                        setFieldValue(e.target.value)
                      }
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-24 rounded-full w-full"
                      readOnly={editingField !== "username"}
                    />
                    {editingField === "username" ? (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button
                          onClick={handleSave}
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-700 h-10 w-10"
                        >
                          <Check className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 h-10 w-10"
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleEdit("username", profile.username)}
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 h-10 w-10"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label className="text-xl font-medium text-mcmaster-maroon">
                    E-Mail
                  </Label>
                  <div className="relative">
                    <Input
                      value={profile.email}
                      className="bg-gray-300 border-0 text-gray-800 text-xl py-4 pr-14 rounded-full w-full"
                      readOnly
                    />
                    {/* No Edit Button for Email */}
                  </div>
                </div>
              </div>

              {/* Profile Picture Section */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-60 h-60 rounded-full border-8 border-mcmaster-maroon bg-gray-300 flex items-center justify-center overflow-hidden">
                    <Avatar className="w-full h-full">
                      <AvatarImage src={profile.profile_picture_url} />
                      <AvatarFallback className="bg-gray-400 text-gray-600">
                        <User className="w-28 h-28" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Upload overlay */}
                  <button
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-mcmaster-maroon rounded-full flex items-center justify-center text-white hover:bg-mcmaster-light transition-colors disabled:opacity-50"
                    title="Upload profile picture"
                  >
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Button
                  onClick={triggerFileUpload}
                  disabled={isUploading}
                  className="bg-mcmaster-maroon hover:bg-mcmaster-light text-white px-10 py-4 rounded-full text-lg font-semibold disabled:opacity-50"
                >
                  {isUploading ? "UPLOADING..." : "CHANGE PHOTO"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
