"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useSessionData } from "@/hooks/useSessionData";
import { updateUserProfile, changeUserPassword, uploadTeacherImage } from "@/app/actions/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { user, isLoading } = useSessionData();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [img, setImg] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [compactView, setCompactView] = useState(false);

  useEffect(() => {
    if (user) {
      const u = user as any;
      setName(u.name || "");
      setUsername(u.username || "");
      setEmail(u.email || "");
      setPhone(u.phone || "");
      setAddress(u.address || "");
      setImg(u.img || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.role) {
      toast.error("User session not found.");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      toast.loading("Updating profile...");

      let imagePath = img;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("img", selectedFile);
        const uploadResult = await uploadTeacherImage(formData);
        if (uploadResult.success && uploadResult.imagePath) {
          imagePath = uploadResult.imagePath;
        } else {
          toast.error(uploadResult.error || "Failed to upload image.");
        }
      }

      const res = await updateUserProfile({
        userId: user.id,
        role: user.role,
        name,
        username,
        email,
        phone,
        address,
        img: imagePath,
      });

      if (res.success) {
        toast.success("Profile updated successfully!");
        setImg(imagePath);
        setSelectedFile(null);
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "An error occurred.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.role) {
      toast.error("User session not found.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      toast.loading("Changing password...");

      const res = await changeUserPassword({
        userId: user.id,
        role: user.role,
        currentPassword,
        newPassword,
      });

      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.error || "Failed to change password.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "An error occurred.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePreferencesSave = () => {
    toast.success("System preferences saved!");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-medium text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account profile, security preferences, and dashboard controls.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 flex w-full justify-start gap-4 border-b bg-transparent p-0">
          <TabsTrigger
            value="profile"
            className="rounded-t-md px-4 py-2 text-sm font-semibold transition-all data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
          >
            Profile Information
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-t-md px-4 py-2 text-sm font-semibold transition-all data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
          >
            Security & Password
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-t-md px-4 py-2 text-sm font-semibold transition-all data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
          >
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PROFILE */}
        <TabsContent value="profile">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Personal Details</CardTitle>
              <CardDescription>Update your personal information and contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative size-20 overflow-hidden rounded-full border border-gray-300">
                    <Image
                      src={img || "/noAvatar.png"}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer text-xs font-semibold text-blue-600 hover:underline">
                      Upload New Photo
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                      }}
                    />
                    {selectedFile && <p className="text-xs text-green-600">Selected: {selectedFile.name}</p>}
                    <p className="text-xs text-gray-400">Allowed JPG, PNG or WEBP. Max 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@domain.com"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801700000000"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Street Name, City, Country"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isUpdatingProfile} className="w-fit self-end bg-blue-600 text-white hover:bg-blue-700">
                  {isUpdatingProfile ? "Saving Changes..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SECURITY */}
        <TabsContent value="security">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Change Password</CardTitle>
              <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 max-w-md">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                </div>

                <Button type="submit" disabled={isChangingPassword} className="mt-2 w-fit bg-blue-600 text-white hover:bg-blue-700">
                  {isChangingPassword ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PREFERENCES */}
        <TabsContent value="preferences">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">System & Notification Preferences</CardTitle>
              <CardDescription>Customize your notification alerts and UI display defaults.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 max-w-lg">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                  <p className="text-xs text-gray-500">Receive announcements and alert digests via email.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="size-5 rounded border-gray-300 text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Sound Alerts</h4>
                  <p className="text-xs text-gray-500">Play audio notifications on new system updates.</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="size-5 rounded border-gray-300 text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Compact Table Layout</h4>
                  <p className="text-xs text-gray-500">Reduce cell padding across data tables for higher density.</p>
                </div>
                <input
                  type="checkbox"
                  checked={compactView}
                  onChange={(e) => setCompactView(e.target.checked)}
                  className="size-5 rounded border-gray-300 text-blue-600"
                />
              </div>

              <Button onClick={handlePreferencesSave} className="w-fit bg-blue-600 text-white hover:bg-blue-700">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
