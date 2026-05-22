import { useState, useEffect } from "react"
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from "../hooks/use-file-upload"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useOCR } from "@/hooks/use-ocr"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { CircleAlertIcon, ImageIcon, UploadIcon, XIcon, ZoomInIcon } from 'lucide-react'

interface GalleryUploadProps {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
}

export function Pattern({
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = "image/*",
  multiple = false,
  className,
  onFilesChange,
}: GalleryUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
  )
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  // Create default images using FileMetadata type
 
  const {
  loading,
  result,
  scan,  clearOCR,
} = useOCR()

const [ocrError, setOcrError] = useState<string | null>(null)

  useEffect(() => {
    if (ocrError) {
      const timer = setTimeout(() => {
        setOcrError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [ocrError])

  const [
    { files, isDragging },
    {
      removeFile,
      //clearFiles,
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
    if (!files.length) return

    try {
   await scan(files[0].file)
  
} catch (error) {
      setOcrError(
        error instanceof Error
          ? error.message
          : "เกิดข้อผิดพลาด"
      )
    }

    onFilesChange?.(files)
  },
})


  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type
    return type.startsWith("image/")
  }

const handleRemove = (id: string) => {
  removeFile(id)
  clearOCR()
}

  return (
    
    <div className="flex flex-col gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
           <h2 className="text-lg font-semibold"> สกัดข้อมูลจาก บัตรประชาชนไทย</h2>
           <div className="text-muted-foreground text-md">ระบบใช้สำหรับสกัดข้อมูลจากบัตรประชาชนเท่านั้น ไม่มีการจัดเก็บข้อมูลลงฐานข้อมูล สามารถใช้บัตรจำลองในการทดสอบได้</div>
    <div className={cn("w-full max-w-4xl flex flex-col gap-4", className)}>
      <div className="w-full flex flex-col md:flex-row gap-8 items-start mt-6">
        {/* Left Column: Upload Area OR Image Preview */}
        <div className="w-full md:w-1/2">
          {files.length === 0 ? (
            <div
              className={cn(
                "rounded-lg relative border border-dashed p-8 text-center transition-colors w-full",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50"
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
                    "flex h-16 w-16 items-center justify-center rounded-full",
                    isDragging ? "bg-primary/10" : "bg-muted"
                  )}
                >
                  <ImageIcon
                    className={cn(
                      "h-5 w-5",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    อัปโหลดบัตรประชาชน
                  </h3>

                  <p className="text-muted-foreground text-sm">
                    ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์บัตรประชาชน
                  </p>

                  <p className="text-muted-foreground text-xs">
                    รองรับไฟล์ PNG, JPG, GIF ขนาดไม่เกิน{" "}
                    {formatBytes(maxSize)} ต่อไฟล์
                    (สูงสุด {maxFiles} ไฟล์)
                  </p>

                 
                </div>

                <Button onClick={openFileDialog}>
                  <UploadIcon className="h-4 w-4" />
                  เลือกไฟล์
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              {/* Gallery Stats */}
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">รูปภาพที่อัปโหลด</h4>
                  <span className="text-xs text-zinc-400">
                    ({formatBytes(files.reduce((acc, file) => acc + file.file.size, 0))})
                  </span>
                </div>
              </div>

              {/* Image Grid */}
              <div className="mt-4 flex justify-center">
                {files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="group/item relative inline-block overflow-hidden rounded-xl border bg-white shadow-sm"
                  >
                    {isImage(fileItem.file) && fileItem.preview ? (
                      <>
                        {loadingImages[fileItem.id] !== false && (
                          <div className="bg-muted/50 rounded-lg absolute inset-0 flex items-center justify-center border">
                            <Spinner className="text-muted-foreground size-6" />
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
                            "rounded-xl max-w-full h-auto object-contain transition-all duration-300 group-hover/item:scale-105",
                            loadingImages[fileItem.id] !== false
                              ? "opacity-0"
                              : "opacity-100"
                          )}
                        />
                      </>
                    ) : (
                      <div className="bg-muted rounded-lg flex h-full w-full items-center justify-center border">
                        <ImageIcon className="text-muted-foreground h-8 w-8" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="bg-black/50 absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover/item:opacity-100">
                      {/* View Button */}
                      {fileItem.preview && (
                        <Button
                          onClick={() => {
                            setSelectedImage(fileItem.preview!)
                            setIsPreviewLoading(true)
                          }}
                          variant="secondary"
                          size="icon"
                          className="size-7"
                        >
                          <ZoomInIcon className="opacity-100/80" />
                        </Button>
                      )}

                      {/* Remove Button */}
                      <Button
                        onClick={() => handleRemove(fileItem.id)}
                        variant="secondary"
                        size="icon"
                        className="size-7"
                      >
                        <XIcon className="opacity-100/8" />
                      </Button>
                    </div>

                    {/* File Info */}
                    <div className="rounded-b-lg absolute right-0 bottom-0 left-0 bg-black/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-xs font-medium">
                        {fileItem.file.name}
                      </p>
                      <p className="text-xs text-gray-300">
                        {formatBytes(fileItem.file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

     
        <div className="w-full md:w-1/2 pl-6  rounded-2xl bg-white  min-h-[300px]">

  

  <h2 className="text-lg font-semibold">
    ข้อมูลบัตรประชาชน
  </h2>
{loading && (
  <div className="flex h-[300px] items-center justify-center">
    <Spinner className="size-20 text-blue-500" />
  </div>
)}

 {!loading&&[
  {
    label: "เลขบัตรประชาชน",
    value: result?.id_number,
  },
  {
    label: "คำนำหน้า (ไทย)",
    value: result?.prefix_th,
  },
  {
    label: "ชื่อ นามสกุล (ไทย)",
    value: result?.name_th,
  },
  {
    label: "Title (EN)",
    value: result?.prefix_en,
  },
  {
    label: "Full name (EN)",
    value: result?.name_en,
  },
  {
    label: "วันเกิด (ไทย)",
    value: result?.date_of_birth_th,
  },
  {
    label: "ที่อยู่",
    value: result?.address,
  },
  {
    label: "วันออกบัตร",
    value: result?.date_of_issue,
  },
  {
    label: "วันบัตรหมดอายุ",
    value: result?.date_of_expiry,
  },
].map((item) => (
  <div
    key={item.label}
    className="flex flex-col gap-2"
  >
    <label className="text-sm font-medium text-zinc-700">
      {item.label}
    </label>

    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-xl border bg-gray-50 px-4 py-3 text-sm text-zinc-700 break-words">
        {item.value || "-"}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!item.value}
        onClick={() =>
          navigator.clipboard.writeText(item.value ?? "")
        }
      >
        คัดลอก
      </Button>
    </div>
  </div>
))}
</div>
        </div>
      

      {/* Floating Error Messages */}
      {ocrError && (
        <div className="fixed top-6 right-6 z-50 w-full max-w-sm animate-in fade-in slide-in-from-top-5 duration-300">
          <Alert variant="destructive" className="shadow-lg border-destructive/20 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md pr-10">
            <CircleAlertIcon />
            <AlertTitle>เกิดข้อผิดพลาด</AlertTitle>
            <AlertDescription>
              <p className="last:mb-0 text-destructive/90 font-medium">
                {ocrError}
              </p>
            </AlertDescription>
            <button
              onClick={() => setOcrError(null)}
              className="absolute top-3 right-3 text-destructive/50 hover:text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="Close error"
            >
              <XIcon className="size-4" />
            </button>
          </Alert>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="
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
    [&_[data-slot=dialog-close]]:duration-200">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
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
  "rounded-lg sm:max-h-[45vh] sm:max-w-[85vw]  max-h-[85vh] max-w-[85vw] w-auto h-auto object-contain transition-opacity duration-300",
  isPreviewLoading ? "opacity-0" : "opacity-100"
)}
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </div>
    </div>
  )
}
