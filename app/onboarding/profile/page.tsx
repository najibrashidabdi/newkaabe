"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Upload, User, Check, X, Loader2 } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePicturePage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await api("/api/auth/me/");
        setUserName(userData.full_name || "");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Create preview when file is selected
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Free memory when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = e.target.files[0];

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select a profile picture to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("profile_picture", selectedFile);

      // Upload to backend using the correct endpoint
      await api("/api/auth/upload-profile-picture/", "POST", formData, true);

      toast({
        title: "Profile picture uploaded",
        description: "Your profile picture has been updated successfully",
      });

      // Redirect to onboarding instead of dashboard
      router.push("/onboarding");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = async () => {
    try {
      // Redirect to onboarding without uploading
      router.push("/onboarding");
    } catch (error) {
      console.error("Error navigating to onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to continue. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden border-none bg-white shadow-custom">
          <CardContent className="p-8">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-examprep-kaabe-maroon">
                Add Your Profile Picture
              </h1>
              <p className="text-examprep-kaabe-brown">
                Let's personalize your account, {userName}
              </p>
            </div>

            <div className="mb-8 flex flex-col items-center">
              <div className="group relative mb-6 h-32 w-32 cursor-pointer overflow-hidden rounded-full bg-examprep-kaabe-light-maroon/10 sm:h-40 sm:w-40">
                {preview ? (
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-16 w-16 text-examprep-kaabe-light-maroon/50" />
                  </div>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2 border-examprep-kaabe-light-maroon text-examprep-kaabe-maroon hover:bg-examprep-kaabe-light-maroon/10"
              >
                {selectedFile ? "Change Picture" : "Select Picture"}
              </Button>

              {selectedFile && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-examprep-kaabe-brown">
                    {selectedFile.name}
                  </span>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="ml-1 rounded-full p-1 text-examprep-kaabe-light-brown hover:bg-examprep-kaabe-cream/30 hover:text-examprep-kaabe-maroon"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="order-2 text-examprep-kaabe-light-brown hover:text-examprep-kaabe-brown sm:order-1"
              >
                Skip for now
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="order-1 bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white sm:order-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
