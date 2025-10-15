'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void;
  translations: {
    dragDrop: string;
    or: string;
    browse: string;
    supported: string;
  };
}

export function ImageUploader({ onImagesSelected, translations }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onImagesSelected(acceptedFiles);
  }, [onImagesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.avif', '.heic']
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 cursor-pointer
        ${isDragActive
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        {isDragActive ? (
          <>
            <div className="rounded-full bg-primary/10 p-6">
              <ImageIcon className="w-12 h-12 text-primary animate-pulse" />
            </div>
            <p className="text-lg font-medium text-primary">
              {translations.dragDrop}
            </p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-muted p-6">
              <Upload className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {translations.dragDrop}{' '}
                <span className="text-muted-foreground">{translations.or}</span>{' '}
                <span className="text-primary hover:underline">{translations.browse}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {translations.supported}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
