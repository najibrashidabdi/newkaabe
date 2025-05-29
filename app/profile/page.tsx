"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Camera } from "lucide-react";

interface ProfileRes {
  full_name:   string;
  school_name: string;
  avatar_url:  string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [school, setSchool] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // fetch current profile details
  useEffect(() => {
    const load = async () => {
      try {
        const data = await api<ProfileRes>("/api/profile/");
        setFullName(data.full_name);
        setSchool(data.school_name || "");
        setAvatarUrl(data.avatar_url);
      } catch (e: any) {
        setError("Unable to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // handle avatar input
  const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  // save handler — uses multipart when updating avatar
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        form.append("full_name", fullName);
        form.append("school_name", school);
        await api("/api/profile/", "PATCH", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api("/api/profile/", "PATCH", {
          full_name: fullName,
          school_name: school,
        });
      }
      setSuccess(true);
      setAvatarFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError("Update failed – please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-examprep-kaabe-maroon" /></div>;
  }

  return (
    <div className="flex justify-center py-10 px-4">
      <Card className="w-full max-w-md shadow-custom bg-white/70 backdrop-blur rounded-xl border border-examprep-kaabe-light-maroon/20">
        <CardHeader>
          <CardTitle className="text-examprep-kaabe-maroon">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-md border border-examprep-kaabe-light-maroon/30">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="avatar" fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-examprep-kaabe-cream text-examprep-kaabe-maroon font-bold text-4xl">
                  {fullName ? fullName[0] : "U"}
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-1 bg-white/80 rounded-full cursor-pointer hover:bg-white">
                <Camera className="h-4 w-4 text-examprep-kaabe-maroon" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </label>
            </div>
            <p className="text-xs text-examprep-kaabe-light-brown">Click the camera to change photo</p>
          </div>

          {/* name & school */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-examprep-kaabe-brown mb-1">Full name</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-examprep-kaabe-brown mb-1">School (optional)</label>
              <Input value={school} onChange={(e) => setSchool(e.target.value)} placeholder="School name" />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">Profile updated!</p>}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button disabled={saving} onClick={handleSave} className="bg-examprep-kaabe-maroon hover:bg-examprep-kaabe-brown text-white">
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}