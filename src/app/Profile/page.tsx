"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User} from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";

import { useState, useRef } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  uploadProfilePicture,
  updateProfilePictureUrl,
} from "@/lib/profileUtils";
import EditableField from "./edit";
import { useRouter } from "next/navigation";
export type EditableField = "username" | "full_name" | "email" | null;

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    profile_picture_url: "",
    total_score: "",
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

      console.log(profileData);

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
    event: React.ChangeEvent<HTMLInputElement>,
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
        session.access_token,
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

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    router.push('/');
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
                  <EditableField
                    label="Display Name"
                    fieldKey="full_name"
                    value={profile.full_name}
                    editingField={editingField ?? ""}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    fieldValue={fieldValue}
                    setFieldValue={setFieldValue}
                    allowEdit={true}
                  />

                  <EditableField
                    label="Username"
                    fieldKey="username"
                    value={profile.username}
                    editingField={editingField ?? ""}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    fieldValue={fieldValue}
                    setFieldValue={setFieldValue}
                    allowEdit={true}
                  />

                  <EditableField
                    label="E-Mail"
                    fieldKey="email"
                    value={profile.email}
                    editingField={editingField ?? ""}
                    onEdit={() => {}}
                    onSave={() => {}}
                    onCancel={() => {}}
                    fieldValue={profile.email}
                    setFieldValue={() => {}}
                    allowEdit={false}
                  />

                  <EditableField
                    label="Score"
                    fieldKey="email"
                    value={profile.total_score}
                    editingField={editingField ?? ""}
                    onEdit={() => {}}
                    onSave={() => {}}
                    onCancel={() => {}}
                    fieldValue={profile.total_score}
                    setFieldValue={() => {}}
                    allowEdit={false}
                  />
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
                <div className="p-1">
                  <Button className="bg-[#5d002e] w-20 h-10 font-bold" variant={"destructive"} onClick={handleLogout}> Logout </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
