'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  aspectClass?: string
}

export default function ImageUpload({
  value,
  onChange,
  bucket = 'images',
  aspectClass = 'aspect-[4/5]',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas (JPG, PNG, WEBP)')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo 8MB.')
      return
    }

    setUploading(true)
    setError('')
    setProgress(10)

    try {
      // Tenta criar o bucket se não existir
      await supabase.storage.createBucket(bucket, { public: true }).catch(() => {})
      setProgress(30)

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError
      setProgress(80)

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
      setProgress(100)
      onChange(urlData.publicUrl)
    } catch (err: any) {
      setError(err?.message?.includes('row-level')
        ? 'Permissão negada. Adicione a política de storage no Supabase (veja SETUP.md).'
        : `Erro: ${err?.message || 'Tente novamente'}`)
    } finally {
      setUploading(false)
      setProgress(0)
      // Reset input so same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <div>
      {/* Preview area */}
      <div
        className={`${aspectClass} rounded-xl overflow-hidden bg-gray-100 border-2 transition-colors relative group ${
          uploading ? 'border-[#D4645A]' : 'border-dashed border-gray-200 hover:border-[#D4645A]/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-white text-gray-800 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Trocar imagem
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="bg-red-500 text-white font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-600 transition-colors"
              >
                Remover
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-[#D4645A] transition-colors p-4"
          >
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold">Clique ou arraste a imagem</p>
            <p className="text-xs mt-1 text-gray-400">JPG, PNG, WEBP · Máx. 8MB</p>
          </button>
        )}

        {/* Upload progress overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-3 p-6">
            <svg className="w-8 h-8 animate-spin text-[#D4645A]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#D4645A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 font-medium">Enviando para o Supabase...</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      {/* URL fallback */}
      <div className="mt-3">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Ou cole uma URL de imagem:</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4645A] transition-colors"
          placeholder="https://..."
        />
      </div>

      {error && (
        <div className="mt-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
