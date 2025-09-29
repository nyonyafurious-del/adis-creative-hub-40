import { useState, useEffect } from 'react'
import { Upload, Trash2, Eye, Download, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'

interface MediaFile {
  id: string
  filename: string
  original_name: string
  file_path: string
  mime_type: string
  file_size: number
  alt_text?: string
  caption?: string
  created_at: string
}

export function MediaManager() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMediaFiles(data || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch media files',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setLoading(true)
    
    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `uploads/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            filename: fileName,
            original_name: file.name,
            file_path: filePath,
            mime_type: file.type,
            file_size: file.size,
          })

        if (dbError) throw dbError

        toast({
          title: 'Success',
          description: `${file.name} uploaded successfully`,
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        })
      }
    }

    await fetchMediaFiles()
    setLoading(false)
  }

  const handleDelete = async (file: MediaFile) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([file.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', file.id)

      if (dbError) throw dbError

      toast({
        title: 'Success',
        description: 'File deleted successfully',
      })

      await fetchMediaFiles()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      })
    }
  }

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(filePath)
    return data.publicUrl
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'images' && file.mime_type.startsWith('image/')) ||
                         (filterType === 'videos' && file.mime_type.startsWith('video/')) ||
                         (filterType === 'documents' && !file.mime_type.startsWith('image/') && !file.mime_type.startsWith('video/'))
    
    return matchesSearch && matchesFilter
  })

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading media files...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Media Library</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="images">Images</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild className="cursor-pointer">
            <label>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                {file.mime_type.startsWith('image/') ? (
                  <img
                    src={getFileUrl(file.file_path)}
                    alt={file.alt_text || file.original_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">📄</div>
                      <div className="text-xs text-muted-foreground">
                        {file.mime_type.split('/')[1]?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary" onClick={() => setSelectedFile(file)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{file.original_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {file.mime_type.startsWith('image/') && (
                          <img
                            src={getFileUrl(file.file_path)}
                            alt={file.alt_text || file.original_name}
                            className="w-full max-h-96 object-contain"
                          />
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>File Name:</strong> {file.original_name}
                          </div>
                          <div>
                            <strong>File Size:</strong> {formatFileSize(file.file_size)}
                          </div>
                          <div>
                            <strong>Type:</strong> {file.mime_type}
                          </div>
                          <div>
                            <strong>Uploaded:</strong> {new Date(file.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => window.open(getFileUrl(file.file_path), '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm truncate" title={file.original_name}>
                  {file.original_name}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {file.mime_type.split('/')[0]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.file_size)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || filterType !== 'all' 
              ? 'No files match your search criteria.' 
              : 'No files uploaded yet. Upload your first file to get started.'}
          </div>
        </div>
      )}
    </div>
  )
}