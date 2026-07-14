"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  bucketName?: string;
  folderName?: string;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 100,
  bucketName = "rd-engineering",
  folderName = "projects",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Compress & convert to WebP client-side
  const compressAndConvertToWebp = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Resize if width > 1600px
          const MAX_WIDTH = 1600;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas conversion error"));
              }
            },
            "image/webp",
            0.82
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleUpload = async (files: FileList) => {
    if (images.length >= maxImages) {
      toast.error(`Maximum limit of ${maxImages} images reached`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];
    const totalFiles = Math.min(files.length, maxImages - images.length);

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      // Max size limit (e.g. 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 10MB limit`);
        continue;
      }

      try {
        setUploadProgress(Math.round(((i + 0.1) / totalFiles) * 100));

        // Compress file
        const webpBlob = await compressAndConvertToWebp(file);

        // Define upload path
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
        const filePath = `${folderName}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, webpBlob, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: publicData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicData.publicUrl);
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      } catch (err: any) {
        console.error("Upload error:", err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
      toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
    }

    setUploading(false);
    setUploadProgress(0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  // Pure HTML5 Drag-and-Drop Reordering handlers
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const list = [...images];
    const draggedItem = list[draggedIdx];
    list.splice(draggedIdx, 1);
    list.splice(index, 0, draggedItem);
    
    setDraggedIdx(index);
    onChange(list);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const list = [...images];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    onChange(list);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const list = [...images];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    onChange(list);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-secondary bg-secondary/10"
            : "border-border/60 bg-muted/10 hover:bg-muted/20 hover:border-border"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxImages > 1}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            <p className="text-sm font-semibold">Uploading & compressing... {uploadProgress}%</p>
            <div className="w-48 bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="h-10 w-10 rounded-lg bg-muted/40 flex items-center justify-center border border-border/20">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium">
              Drag & Drop images or <span className="text-secondary font-semibold">Browse files</span>
            </p>
            <p className="text-xs text-gray-500">
              Supports JPG, PNG, WEBP (Max 10MB per file). Auto-converted to compressed WebP.
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Images List with drag & drop reordering */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((url, idx) => (
            <div
              key={url + "-" + idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              className="relative aspect-square rounded-lg border border-border/40 overflow-hidden bg-muted/20 group cursor-move transition-transform duration-200 active:scale-95"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Uploaded thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Index Badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-white px-2 py-0.5 rounded-md">
                {idx === 0 ? "Cover" : idx + 1}
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="self-end p-1.5 bg-red-500/80 hover:bg-red-500 rounded-md text-white transition-colors"
                  title="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>

                <div className="flex justify-between items-center gap-1">
                  <span className="text-[10px] text-gray-300 font-medium">Drag to reorder</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 bg-black/50 hover:bg-black text-white rounded disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowUp className="h-3 w-3 -rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === images.length - 1}
                      className="p-1 bg-black/50 hover:bg-black text-white rounded disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowDown className="h-3 w-3 -rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
