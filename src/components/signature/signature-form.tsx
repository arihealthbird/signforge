"use client";

import { SignatureData, SOCIAL_PLATFORMS, SocialLink } from "@/types/signature";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, Mail, MapPin, 
  Globe, Type, Plus, Trash2, Image, Upload, Loader2, X, Sparkles, Film
} from "lucide-react";
import { useRef, useState, useMemo } from "react";
import { GiphyPicker } from "@/components/ui/giphy-picker";
import { EmailThemeId } from "@/lib/email-themes";
import { getThemePlaceholders } from "@/lib/theme-placeholders";

interface SignatureFormProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  emailTheme?: EmailThemeId;
}

export function SignatureForm({ data, onChange, emailTheme = "professional" }: SignatureFormProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  
  // Get theme-specific placeholders
  const placeholders = useMemo(() => getThemePlaceholders(emailTheme), [emailTheme]);
  
  // Map platform ID to placeholder key
  const getSocialPlaceholder = (platformId: string): string => {
    const platformMap: Record<string, keyof typeof placeholders> = {
      linkedin: "linkedin",
      twitter: "twitter",
      facebook: "facebook",
      instagram: "instagram",
      github: "github",
      youtube: "youtube",
      tiktok: "tiktok",
      website: "websiteUrl",
    };
    const key = platformMap[platformId];
    return key ? (placeholders[key] as string) : "";
  };

  const updateField = <K extends keyof SignatureData>(
    field: K,
    value: SignatureData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const addSocialLink = () => {
    const newLink: SocialLink = { platform: "linkedin", url: "" };
    onChange({ ...data, socialLinks: [...data.socialLinks, newLink] });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...data.socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, socialLinks: updated });
  };

  const removeSocialLink = (index: number) => {
    onChange({ ...data, socialLinks: data.socialLinks.filter((_, i) => i !== index) });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logoUrl" | "profilePhotoUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = field === "logoUrl" ? setUploadingLogo : setUploadingPhoto;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const { url } = await response.json();
      updateField(field, url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Full Name *</label>
              <Input
                placeholder={placeholders.fullName}
                value={data.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Job Title *</label>
              <Input
                placeholder={placeholders.jobTitle}
                value={data.jobTitle}
                onChange={(e) => updateField("jobTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Company *</label>
              <Input
                placeholder={placeholders.company}
                value={data.company}
                onChange={(e) => updateField("company", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Department</label>
              <Input
                placeholder={placeholders.department}
                value={data.department || ""}
                onChange={(e) => updateField("department", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder={placeholders.email}
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Phone</label>
              <Input
                type="tel"
                placeholder={placeholders.phone}
                value={data.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Mobile</label>
              <Input
                type="tel"
                placeholder={placeholders.mobile}
                value={data.mobile || ""}
                onChange={(e) => updateField("mobile", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Website</label>
              <Input
                type="url"
                placeholder={placeholders.website}
                value={data.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Address (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium">Street Address</label>
            <Input
              placeholder={placeholders.address}
              value={data.address || ""}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">City</label>
              <Input
                placeholder={placeholders.city}
                value={data.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">State</label>
              <Input
                placeholder={placeholders.state}
                value={data.state || ""}
                onChange={(e) => updateField("state", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">ZIP Code</label>
              <Input
                placeholder={placeholders.zipCode}
                value={data.zipCode || ""}
                onChange={(e) => updateField("zipCode", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Country</label>
              <Input
                placeholder="USA"
                value={data.country || ""}
                onChange={(e) => updateField("country", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {data.socialLinks.map((link, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              <select
                className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm w-full sm:w-auto"
                value={link.platform}
                onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
              >
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <Input
                className="flex-1"
                placeholder={getSocialPlaceholder(link.platform)}
                value={link.url}
                onChange={(e) => updateSocialLink(index, "url", e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSocialLink(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addSocialLink} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadError && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {uploadError}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Company Logo</label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "logoUrl")}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
              >
                {uploadingLogo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {data.logoUrl ? "Change Logo" : "Upload Logo"}
                  </>
                )}
              </Button>
              {data.logoUrl && (
                <div className="mt-2 p-2 border rounded-lg bg-secondary/50 relative group">
                  <img
                    src={data.logoUrl}
                    alt="Logo preview"
                    className="max-h-16 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("logoUrl", undefined)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                    title="Remove logo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Profile Photo</label>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "profilePhotoUrl")}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {data.profilePhotoUrl ? "Change Photo" : "Upload Photo"}
                  </>
                )}
              </Button>
              {data.profilePhotoUrl && (
                <div className="mt-2 p-2 border rounded-lg bg-secondary/50 relative group">
                  <img
                    src={data.profilePhotoUrl}
                    alt="Photo preview"
                    className="max-h-16 w-16 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("profilePhotoUrl", undefined)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* GIF Banner Section */}
          <div className="pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Film className="w-4 h-4 text-purple-500" />
                Animated GIF Banner
                <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Add an eye-catching animated GIF to make your signature stand out!
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-dashed hover:border-purple-500/50 hover:bg-purple-500/5"
                onClick={() => setIsGifPickerOpen(true)}
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                {data.gifBannerUrl ? "Change GIF Banner" : "Choose a GIF from GIPHY"}
              </Button>
              {data.gifBannerUrl && (
                <div className="mt-3 p-3 border rounded-lg bg-secondary/50 relative group">
                  <img
                    src={data.gifBannerUrl}
                    alt="GIF Banner preview"
                    className="w-full max-h-32 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("gifBannerUrl", undefined)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                    title="Remove GIF"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3" />
                    Powered by GIPHY
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Giphy Picker Modal */}
      <GiphyPicker
        isOpen={isGifPickerOpen}
        onClose={() => setIsGifPickerOpen(false)}
        onSelect={(gifUrl) => {
          updateField("gifBannerUrl", gifUrl);
        }}
        title="Choose a GIF Banner"
        searchPlaceholder="Search for the perfect GIF..."
      />

      {/* Additional */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="w-5 h-5 text-primary" />
            Additional Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Disclaimer / Legal Text</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={placeholders.disclaimer}
              value={data.disclaimer || ""}
              onChange={(e) => updateField("disclaimer", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Calendar Booking Link</label>
            <Input
              type="url"
              placeholder={placeholders.calendarLink}
              value={data.calendarLink || ""}
              onChange={(e) => updateField("calendarLink", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
