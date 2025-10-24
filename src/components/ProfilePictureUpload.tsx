'use client';

import React, { useRef, useState } from 'react';
import { IKImage, ImageKitProvider, IKUpload } from 'imagekitio-next';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import config from '@/lib/config';

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorMessage}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, signature, expire };
  } catch (error: any) {
    throw new Error(`Failed to authenticate the request ${error.message}`);
  }
};

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  userName?: string;
  onImageChange: (imagePath: string) => void;
  isLoading?: boolean;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  userName = 'User',
  onImageChange,
  isLoading = false,
}) => {
  const ikUploadRef = useRef<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);

  // Helper function to build ImageKit URL
  const getImageKitUrl = (filePath: string) => {
    if (filePath.startsWith('http')) {
      return filePath;
    }
    return `${urlEndpoint}${filePath}`;
  };

  const onError = (error: any) => {
    console.error('Upload error:', error);
    setIsUploading(false);
    setUploadProgress(0);
    toast.error('Failed to upload profile picture. Please try again.');
  };

  const onSuccess = (res: any) => {
    setIsUploading(false);
    setUploadProgress(0);
    // Use the full URL for preview, but send the filePath to the server
    setPreviewImage(res.url || res.filePath);
    onImageChange(res.filePath);
    toast.success('Profile picture updated successfully!');
  };

  const onValidate = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return false;
    }

    // Check file size (max 5MB for profile pictures)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return false;
    }

    return true;
  };

  const handleUploadClick = () => {
    if (ikUploadRef.current && !isUploading) {
      ikUploadRef.current.click();
    }
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Avatar Display */}
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
            {previewImage ? (
              <AvatarImage 
                src={previewImage.startsWith('http') ? previewImage : getImageKitUrl(previewImage)} 
                alt="Profile picture"
                className="object-cover"
              />
            ) : currentImage ? (
              currentImage.startsWith('/profile-pictures') ? (
                <AvatarImage 
                  src={getImageKitUrl(currentImage)} 
                  alt="Profile picture"
                  className="object-cover"
                />
              ) : (
                <AvatarImage 
                  src={currentImage} 
                  alt="Profile picture"
                  className="object-cover"
                />
              )
            ) : (
              <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {getInitials(userName)}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50">
              <div className="text-center text-white">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-1" />
                <span className="text-xs">{uploadProgress}%</span>
              </div>
            </div>
          )}

          {/* Camera Button */}
          <Button
            type="button"
            size="sm"
            className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={handleUploadClick}
            disabled={isUploading || isLoading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Upload Button (Alternative) */}
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={isUploading || isLoading}
          className="text-sm"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Change Photo
            </>
          )}
        </Button>

        {/* Hidden ImageKit Upload Component */}
        <IKUpload
          ref={ikUploadRef}
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          validateFile={onValidate}
          onUploadStart={() => {
            setIsUploading(true);
            setUploadProgress(0);
          }}
          onUploadProgress={({ loaded, total }) => {
            const percent = Math.round((loaded / total) * 100);
            setUploadProgress(percent);
          }}
          folder="/profile-pictures"
          accept="image/*"
          className="hidden"
        />

        {/* Upload Instructions */}
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Click to upload a new profile picture. JPG, PNG or GIF. Max file size 5MB.
        </p>
      </div>
    </ImageKitProvider>
  );
};