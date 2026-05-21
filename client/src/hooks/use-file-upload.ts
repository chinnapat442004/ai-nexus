import { useRef, useState } from "react"

export interface FileMetadata {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface FileWithPreview {
  id: string
  file: File
  preview: string
}

interface Options {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: FileMetadata[]
  onFilesChange?: (files: FileWithPreview[]) => void
}

export function formatBytes(bytes: number) {
  return `${(bytes / 1024).toFixed(2)} KB`
}

export function useFileUpload(options: Options) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const newErrors: string[] = []
    const acceptedFiles: File[] = []

    Array.from(fileList).forEach((file) => {
      if (options.maxSize && file.size > options.maxSize) {
        newErrors.push(`File ${file.name} is too large. Max size is ${formatBytes(options.maxSize)}`)
      } else {
        acceptedFiles.push(file)
      }
    })

    if (options.maxFiles && files.length + acceptedFiles.length > options.maxFiles) {
      newErrors.push(`Cannot upload more than ${options.maxFiles} files`)
      const allowedCount = options.maxFiles - files.length
      if (allowedCount > 0) {
        acceptedFiles.splice(allowedCount)
      } else {
        acceptedFiles.splice(0)
      }
    }

    setErrors(newErrors)

    if (acceptedFiles.length === 0) return

    const newFiles = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }))

    setFiles(newFiles)

    options.onFilesChange?.([...files, ...newFiles])
  }

  return [
    {
      files,
      isDragging,
      errors,
    },
    {
      removeFile: (id: string) => {
        setFiles((prev) =>
          prev.filter((file) => file.id !== id)
        )
      },

      clearFiles: () => {
        setFiles([])
        setErrors([])
      },

      handleDragEnter: () => setIsDragging(true),

      handleDragLeave: () => setIsDragging(false),

      handleDragOver: (e: React.DragEvent) => {
        e.preventDefault()
      },

      handleDrop: (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        processFiles(e.dataTransfer.files)
      },

      openFileDialog: () => {
        inputRef.current?.click()
      },

      getInputProps: () => ({
        ref: inputRef,
        type: "file",
        multiple: options.multiple,
        accept: options.accept,
        onChange: (
          e: React.ChangeEvent<HTMLInputElement>
        ) => processFiles(e.target.files),
      }),
    },
  ] as const
}