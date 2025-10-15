'use client';

import { useState } from 'react';
import { Languages, ImageIcon, Zap, Shield, Layers, Maximize2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/image-uploader';
import { ImagePreviewCard } from '@/components/image-preview-card';
import { ConvertAllButton } from '@/components/convert-all-button';
import { translations, Language } from '@/lib/translations';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];
  const isRTL = language === 'ar';

  const handleImagesSelected = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const features = [
    { icon: Layers, title: t.feature1Title, desc: t.feature1Desc },
    { icon: ImageIcon, title: t.feature2Title, desc: t.feature2Desc },
    { icon: Zap, title: t.feature3Title, desc: t.feature3Desc },
    { icon: Maximize2, title: t.feature4Title, desc: t.feature4Desc },
    { icon: Shield, title: t.feature5Title, desc: t.feature5Desc },
    { icon: Gift, title: t.feature6Title, desc: t.feature6Desc },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted ${isRTL ? 'rtl' : 'ltr'}`}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {t.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="rounded-full"
            >
              <Languages className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.subtitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="space-y-8">
          <ImageUploader
            onImagesSelected={handleImagesSelected}
            translations={{
              dragDrop: t.dragDrop,
              or: t.or,
              browse: t.browse,
              supported: t.supported,
            }}
          />

          {images.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">{images.length} {images.length === 1 ? 'Image' : 'Images'}</h3>
                <ConvertAllButton
                  images={images}
                  format="webp" // Default format
                  quality={90} // Default quality
                  preserveExif={false}
                  translations={{
                    convertAll: t.convertAll,
                    converting: t.convertingAll,
                    noImages: t.noImages,
                    error: t.conversionError,
                    success: t.conversionSuccess,
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {images.map((file, index) => (
                  <ImagePreviewCard
                    key={`${file.name}-${index}`}
                    file={file}
                    onRemove={() => handleRemoveImage(index)}
                    translations={{
                      format: t.format,
                      quality: t.quality,
                      resize: t.resize,
                      width: t.width,
                      height: t.height,
                      convert: t.convert,
                      converting: t.converting,
                      remove: t.remove,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-24 space-y-8">
          <h3 className="text-3xl font-bold text-center">{t.features}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-3">
                    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-3 w-fit">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="border-t mt-24 py-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 {t.title}. Fast, secure, and free image conversion.</p>
        </div>
      </footer>
    </div>
  );
}
