'use client';

import { useState } from 'react';
import { X, Download, Settings2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface ImagePreviewCardProps {
  file: File;
  onRemove: () => void;
  translations: {
    format: string;
    quality: string;
    resize: string;
    width: string;
    height: string;
    convert: string;
    converting: string;
    remove: string;
  };
}

const FORMATS = [
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'avif', label: 'AVIF' },
  { value: 'tiff', label: 'TIFF' },
  { value: 'bmp', label: 'BMP' },
  { value: 'gif', label: 'GIF' },
];

export function ImagePreviewCard({ file, onRemove, translations }: ImagePreviewCardProps) {
  const [preview, setPreview] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState('webp');
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useState(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  });

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('format', selectedFormat);
      formData.append('quality', quality.toString());
      if (width) formData.append('width', width);
      if (height) formData.append('height', height);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.split('.').slice(0, -1).join('.')}.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const fileSize = (file.size / 1024).toFixed(2);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {preview && (
              <Image
                src={preview}
                alt={file.name}
                fill
                sizes="96px"
                className="object-cover"
                placeholder={preview ? 'blur' : 'empty'}
                blurDataURL={preview || undefined}
                priority={false}
              />
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{fileSize} KB</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="flex-shrink-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">{translations.format}</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">{translations.quality}: {quality}%</Label>
                <Slider
                  value={[quality]}
                  onValueChange={(v) => setQuality(v[0])}
                  min={1}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8 text-xs w-full"
            >
              <Settings2 className="h-3 w-3 mr-1" />
              {translations.resize}
            </Button>

            {showAdvanced && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                <div className="space-y-1">
                  <Label className="text-xs">{translations.width} (px)</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{translations.height} (px)</Label>
                  <Input
                    type="number"
                    placeholder="Auto"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleConvert}
              disabled={isConverting}
              className="w-full"
              size="sm"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations.converting}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {translations.convert}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
