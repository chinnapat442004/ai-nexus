import { useEffect, useState } from 'react';

import { Button } from '../components/ui/button';
import { useAnimal } from '@/hooks/use-animal';
import {
  useFileUpload,
  formatBytes,
  type FileMetadata,
  type FileWithPreview,
} from '@/hooks/use-file-upload';

import { cn } from '@/lib/utils';

import { ImageIcon, UploadIcon, ZoomInIcon, XIcon } from 'lucide-react';

import { Spinner } from './ui/spinner';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface AnimalClassifierProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
}

export function AnimalClassifier({
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/*',
  multiple = false,
  className,
  onFilesChange,
}: AnimalClassifierProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {},
  );
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const isImage = (file: File | FileMetadata) => {
    return file.type.startsWith('image/');
  };

  const [
    { files, isDragging },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: [],
    onFilesChange: async (files) => {
      if (!files.length) return;

      try {
        await scan(files[0].file);
      } catch (error) {
        setOcrError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด');
      }

      onFilesChange?.(files);
    },
  });

  const { loading, result, scan, clearAnimal } = useAnimal();

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  useEffect(() => {
    if (ocrError) {
      const timer = setTimeout(() => {
        setOcrError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [ocrError]);

  const handleRemove = (id: string) => {
    removeFile(id);
    clearAnimal();
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm',
        className,
      )}
    >
      <div className="mb-6">
        <h2 className="mb-1 text-xl font-semibold text-zinc-800">
          Animal Classifier AI
        </h2>

        <p className="text-sm text-zinc-500">
          อัปโหลดรูปภาพสัตว์เลี้ยงหรือสัตว์ป่า
          เพื่อให้ระบบวิเคราะห์ประเภทของสัตว์
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Upload Section */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-zinc-700">
            รูปภาพที่ต้องการตรวจสอบ
          </label>

          <div className="w-full">
            {files.length === 0 ? (
              <div
                className={cn(
                  'relative w-full rounded-xl border border-dashed p-8 text-center transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input {...getInputProps()} className="sr-only" />

                <div className="flex flex-col items-center gap-4">
                  <div
                    className={cn(
                      'flex h-16 w-16 items-center justify-center rounded-full',
                      isDragging ? 'bg-primary/10' : 'bg-muted',
                    )}
                  >
                    <ImageIcon
                      className={cn(
                        'h-6 w-6',
                        isDragging ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">อัปโหลดรูปภาพ</h3>

                    <p className="text-sm text-muted-foreground">
                      ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์รูปภาพ
                    </p>

                    <p className="text-xs text-muted-foreground">
                      รองรับไฟล์ PNG, JPG, JPEG ขนาดไม่เกิน{' '}
                      {formatBytes(maxSize)}
                    </p>
                  </div>

                  <Button onClick={openFileDialog}>
                    <UploadIcon className="h-4 w-4" />
                    เลือกไฟล์
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex justify-center">
                {files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="group relative overflow-hidden rounded-xl border bg-white shadow-sm"
                  >
                    {isImage(fileItem.file) && fileItem.preview ? (
                      <>
                        {loadingImages[fileItem.id] !== false && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted/50">
                            <Spinner className="size-6 text-muted-foreground" />
                          </div>
                        )}

                        <img
                          src={fileItem.preview}
                          alt={fileItem.file.name}
                          onLoad={() =>
                            setLoadingImages((prev) => ({
                              ...prev,
                              [fileItem.id]: false,
                            }))
                          }
                          className={cn(
                            'max-h-[320px] rounded-xl object-contain transition-all duration-300 group-hover:scale-105',
                            loadingImages[fileItem.id] !== false
                              ? 'opacity-0'
                              : 'opacity-100',
                          )}
                        />
                      </>
                    ) : (
                      <div className="flex h-[320px] w-[320px] items-center justify-center rounded-lg bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      {fileItem.preview && (
                        <Button
                          onClick={() => {
                            setSelectedImage(fileItem.preview!);

                            setIsPreviewLoading(true);
                          }}
                          variant="secondary"
                          size="icon"
                          className="size-8"
                        >
                          <ZoomInIcon className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        onClick={() => handleRemove(fileItem.id)}
                        variant="secondary"
                        size="icon"
                        className="size-8"
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-zinc-700">
            ผลการวิเคราะห์จากระบบ
          </label>

          <div className="flex min-h-[300px] flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-5">
            {!result && !loading && (
              <div className="my-auto py-10 text-center text-zinc-400">
                <p className="text-sm">
                  กรุณาอัปโหลดรูปภาพฝั่งซ้ายมือ
                  <br />
                  เพื่อเริ่มต้นแสดงผลการวิเคราะห์
                </p>
              </div>
            )}

            {loading && (
              <div className="my-auto flex flex-col items-center justify-center gap-3">
                <Spinner className="size-8" />

                <p className="text-sm text-zinc-500">กำลังประมวลผลด้วย AI...</p>
              </div>
            )}

            {!loading && result && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        result.success ? 'bg-emerald-500' : 'bg-rose-500',
                      )}
                    />

                    <p className="text-sm font-medium text-zinc-700">
                      {result.message}
                    </p>
                  </div>

                  {result.data && (
                    <span className="rounded-full bg-zinc-200 px-2.5 py-1 font-mono text-xs font-medium text-zinc-700">
                      Confidence: {result.data.confidence}%
                    </span>
                  )}
                </div>

                {result.data && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        สัตว์ที่ตรวจพบ
                      </p>

                      <p className="mt-1 text-3xl font-bold text-zinc-900">
                        {result.data.animal}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent
          className="
           w-auto
    max-w-[90vw]
    max-h-[90vh]
    sm:max-w-none
    border-none
    bg-transparent
    p-0
    shadow-none
    [&_[data-slot=dialog-close]]:-right-8
    [&_[data-slot=dialog-close]]:-top-8
    [&_[data-slot=dialog-close]]:size-8
    [&_[data-slot=dialog-close]]:rounded-full
    [&_[data-slot=dialog-close]]:bg-black/50
    [&_[data-slot=dialog-close]]:text-white
    [&_[data-slot=dialog-close]]:hover:bg-black/70
    [&_[data-slot=dialog-close]]:border
    [&_[data-slot=dialog-close]]:border-white/10
    [&_[data-slot=dialog-close]]:transition-all
    [&_[data-slot=dialog-close]]:duration-200
"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          <div className="relative flex items-center justify-center">
            {selectedImage && (
              <>
                {isPreviewLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Spinner className="size-8 text-white" />
                  </div>
                )}

                <img
                  src={selectedImage}
                  alt="Preview"
                  onLoad={() => setIsPreviewLoading(false)}
                  className={cn(
                    'rounded-lg sm:max-h-[45vh] sm:max-w-[85vw]  max-h-[85vh] max-w-[85vw] w-auto h-auto object-contain transition-opacity duration-300',
                    isPreviewLoading ? 'opacity-0' : 'opacity-100',
                  )}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
