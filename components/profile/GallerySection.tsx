"use client";

import { useState } from "react";
import { Plus, ImageOff, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/cards/Card";
import { CompanyLogoPlaceholder } from "@/components/ui/CompanyLogoPlaceholder";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import type { CompanyProfile } from "@/lib/types/company-profile";

interface GallerySectionProps {
  profile: CompanyProfile;
  onChangeGallery: (fileNames: string[]) => void;
}

const MOCK_IMAGE_NAMES = ["mill_yard.jpg", "warehouse.jpg", "loading_dock.jpg", "office_front.jpg"];

export function GallerySection({ profile, onChangeGallery }: GallerySectionProps) {
  const [adding, setAdding] = useState(false);

  function handleAddImage() {
    setAdding(true);
    window.setTimeout(() => {
      const next = MOCK_IMAGE_NAMES[profile.galleryImageFileNames.length % MOCK_IMAGE_NAMES.length];
      onChangeGallery([...profile.galleryImageFileNames, next]);
      setAdding(false);
    }, 600);
  }

  function handleRemove(index: number) {
    onChangeGallery(profile.galleryImageFileNames.filter((_, i) => i !== index));
  }

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>Company Gallery</CardTitle>
        <Button variant="outline" size="sm" loading={adding} onClick={handleAddImage}>
          <Plus size={14} /> Add image
        </Button>
      </CardHeader>
      <CardBody>
        <p className="text-[11px] text-ink-faint mb-3">Logo</p>
        <CompanyLogoPlaceholder name={profile.companyName || "Company"} size="lg" className="mb-6" />

        <p className="text-[11px] text-ink-faint mb-3">Photos</p>
        {profile.galleryImageFileNames.length === 0 ? (
          <div className="flex items-center gap-2 rounded-sm border border-dashed border-line p-6 text-ink-faint">
            <ImageOff size={16} />
            <span className="text-[13px]">No photos added yet — mill yard, warehouse, or office photos help build trust.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.galleryImageFileNames.map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="relative aspect-square rounded-sm bg-charcoal/[0.06] border border-line flex items-center justify-center"
              >
                <span className="text-[11px] text-ink-faint text-center px-2 truncate">{name}</span>
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label={`Remove ${name}`}
                  className="absolute top-1 right-1"
                  onClick={() => handleRemove(i)}
                >
                  <X size={13} />
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
