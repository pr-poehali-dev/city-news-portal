import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
    setUrlInput(value);
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      
      setUploading(true);
      try {
        const response = await fetch('https://functions.poehali.dev/bc882f30-e97a-4dcc-aca0-a79cffa9bd71', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64,
            filename: file.name
          })
        });

        const data = await response.json();
        
        if (data.url) {
          onChange(data.url);
          setPreview(data.url);
        } else {
          alert('Ошибка загрузки изображения');
          setPreview(value);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Ошибка загрузки изображения');
        setPreview(value);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!uploading) fileInputRef.current?.click();
          }}
          disabled={uploading}
          className="gap-2"
        >
          <Icon name={uploading ? "Loader2" : "Upload"} size={16} className={uploading ? "animate-spin" : ""} />
          {uploading ? 'Загрузка...' : 'Загрузить изображение'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowUrlInput(!showUrlInput);
          }}
          className="gap-1"
        >
          <Icon name="Link" size={16} />
          {showUrlInput ? 'Скрыть' : 'По ссылке'}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPreview('');
              setUrlInput('');
              onChange('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(urlInput);
              setPreview(urlInput);
            }}
            size="sm"
          >
            Применить
          </Button>
        </div>
      )}
      
      {preview && (
        <div className="relative w-full max-w-md">
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg border w-full h-48 object-cover"
          />
        </div>
      )}
    </div>
  );
};