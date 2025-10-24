'use client';

import React, { useRef, useState } from 'react';
import { IKImage, ImageKitProvider, IKUpload, IKVideo } from 'imagekitio-next';
import config from '@/lib/config';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';

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

interface Props {
  type: 'Image' | 'Video';
  accept: string;
  placeholder: string;
  folder: string;
  variant: 'dark' | 'light';
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef<any>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === 'dark'
        ? 'bg-dark-300'
        : 'bg-light-600 button-gray-100 border',
    placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
    text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
  };

  const onError = (error: any) => {
    console.log(error);
    toast.error(`${type} could not be uploaded. Please try again.`);
  };
  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);
    toast.success(`${type} uploaded successfully.`);
  };
  const onValidate = (file: File) => {
    if (type === 'Image') {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('File size should be less than 20MB');
        return false;
      }
    } else if (type === 'Video') {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size should be less than 50MB');
        return false;
      }
    }
    return true;
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />
      <button
        className={cn(
          'flex min-h-14 w-full items-center justify-center gap-1.5 rounded-md',
          styles.button
        )}
        onClick={e => {
          e.preventDefault();
          if (ikUploadRef.current) {
            ikUploadRef.current?.click();
          }
        }}
      >
        <CloudUpload width={20} height={20} />
        <p className={cn('text-base', styles.placeholder)}>{placeholder}</p>
        {file && file.filePath && (
          <p
            title={file.filePath}
            className={cn('mt-1 text-center text-xs', styles.text)}
          >
            {file.filePath.length > 50
              ? `${file.filePath?.substring(0, 50)}...`
              : file.filePath}
          </p>
        )}
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div
            className="rounded-full bg-green-800 p-0.5 text-center font-bebas-neue text-[8px] font-bold leading-none text-light-100"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {file?.filePath &&
        (type === 'Image' ? (
          <IKImage
            alt={file.filePath}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === 'Video' ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};
export default FileUpload;
