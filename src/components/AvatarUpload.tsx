'use client'

import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface AvatarUploadProps {
  currentAvatarUrl?: string
  teacherName: string
  onAvatarChange: (url: string) => void
}

export function AvatarUpload({
  currentAvatarUrl,
  teacherName,
  onAvatarChange,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // Create a preview using FileReader
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      setPreview(dataUrl)
      onAvatarChange(dataUrl)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setPreview(null)
    onAvatarChange(null as any)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const initials = teacherName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const displayUrl = preview || currentAvatarUrl || undefined

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={displayUrl} alt={teacherName} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        {displayUrl && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload size={16} className="mr-2" />
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </Button>

      <p className="text-xs text-muted-foreground">
        JPG, PNG or GIF (Max 5MB)
      </p>
    </div>
  )
}
