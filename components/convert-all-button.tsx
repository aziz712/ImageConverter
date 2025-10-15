'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ConvertAllButtonProps {
  images: File[];
  format: string;
  quality: number;
  width?: number;
  height?: number;
  preserveExif: boolean;
  translations: {
    convertAll: string;
    converting: string;
    noImages: string;
    error: string;
    success: string;
  };
}

export function ConvertAllButton({
  images,
  format,
  quality,
  width,
  height,
  preserveExif,
  translations
}: ConvertAllButtonProps) {
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const handleConvertAll = async () => {
    if (images.length === 0) {
      toast({
        title: translations.noImages,
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);
    toast({
      title: translations.converting,
    });

    try {
      const formData = new FormData();
      
      // Add all images to the form data
      images.forEach((image) => {
        formData.append('images', image);
      });
      
      // Add conversion parameters
      formData.append('format', format);
      formData.append('quality', quality.toString());
      if (width) formData.append('width', width.toString());
      if (height) formData.append('height', height.toString());
      formData.append('preserveExif', preserveExif.toString());

      // Send the request to the API
      const response = await fetch('/api/convert-all', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      // Get the ZIP file blob
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted_images.zip';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: translations.success,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error converting images:', error);
      toast({
        title: translations.error,
        variant: 'destructive',
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Button
      onClick={handleConvertAll}
      disabled={isConverting || images.length === 0}
      className="w-full gap-2"
      size="lg"
    >
      {isConverting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {translations.converting}
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {translations.convertAll}
        </>
      )}
    </Button>
  );
}